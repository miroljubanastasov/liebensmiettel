#!/usr/bin/env node
/**
 * Test the FULL classification pipeline (catalogue + keywords + OFF expansion + embeddings)
 * on the same set of tricky product names.
 *
 * Usage:  node scripts/test-full-pipeline.js
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { pipeline as hfPipeline } from '@huggingface/transformers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ── Load all source data ─────────────────────────────────────────────────────
const classifySrc = readFileSync(join(__dirname, '..', 'src', 'utils', 'classify.js'), 'utf-8')

function extractValue(src, varName) {
    const re = new RegExp(`const\\s+${varName}\\s*=\\s*`)
    const match = re.exec(src)
    if (!match) throw new Error(`Could not find ${varName}`)
    const openChar = src[match.index + match[0].length]
    const closeChar = openChar === '{' ? '}' : ']'
    let depth = 0
    let i = match.index + match[0].length
    for (; i < src.length; i++) {
        if (src[i] === openChar) depth++
        else if (src[i] === closeChar) { depth--; if (depth === 0) break }
    }
    return src.slice(match.index + match[0].length, i + 1)
}

const KEYWORD_RULES = eval('(' + extractValue(classifySrc, 'KEYWORD_RULES') + ')')
const CATEGORY_PRIORITY = eval('(' + extractValue(classifySrc, 'CATEGORY_PRIORITY') + ')')
const KEYWORD_SUBCATEGORY_HINTS = eval('(' + extractValue(classifySrc, 'KEYWORD_SUBCATEGORY_HINTS') + ')')

// Load OFF expansion
const offExpansion = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'offExpansion.json'), 'utf-8'))
const OFF_KEYWORD_HINTS = offExpansion.keywordHints || {}

// Load product catalogue
const catalogueSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'productCatalogue.js'), 'utf-8')
function extractArray(src, varName) {
    const re = new RegExp(`(?:const|export const|export default)\\s+${varName}\\s*=\\s*\\[`)
    const match = re.exec(src)
    if (!match) return null
    let depth = 0, i = src.indexOf('[', match.index), begin = i
    for (; i < src.length; i++) {
        if (src[i] === '[') depth++
        else if (src[i] === ']') { depth--; if (depth === 0) break }
    }
    return src.slice(begin, i + 1)
}
const PRODUCT_CATALOGUE = eval(extractArray(catalogueSrc, 'PRODUCT_CATALOGUE'))
const GENERIC_ALIASES = eval('(' + extractValue(catalogueSrc, 'GENERIC_ALIASES') + ')')

// Build alias index (mirrors productCatalogue.js findGenericByAlias)
function _normAlias(s) {
    return s.toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ').trim()
}
const ALIAS_INDEX = new Map()
for (const p of PRODUCT_CATALOGUE) {
    ALIAS_INDEX.set(_normAlias(p.name), p)
    for (const a of (GENERIC_ALIASES[p.name] || [])) {
        const key = _normAlias(a)
        if (!ALIAS_INDEX.has(key)) ALIAS_INDEX.set(key, p)
    }
}
function findGenericByAlias(text) {
    if (!text) return null
    return ALIAS_INDEX.get(_normAlias(text)) || null
}

// Load subcategories for reverse lookup
const subcatSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'subcategories.js'), 'utf-8')
const subcatArr = extractArray(subcatSrc, 'SUBCATEGORIES')
const SUBCATEGORIES = subcatArr ? eval(subcatArr) : []
const _subcatToCat = new Map(SUBCATEGORIES.map(s => [s.name, s.category]))
function subcatToCategory(name) { return _subcatToCat.get(name) || null }

// Load brand words
const matcherSrc = readFileSync(join(__dirname, '..', 'src', 'utils', 'productMatcher.js'), 'utf-8')
function extractBrandWords(src) {
    const start = src.indexOf('const BRAND_WORDS = new Set([')
    if (start === -1) return new Set()
    const arrStart = src.indexOf('[', start)
    let depth = 0, i = arrStart
    for (; i < src.length; i++) {
        if (src[i] === '[') depth++
        else if (src[i] === ']') { depth--; if (depth === 0) break }
    }
    return new Set(eval(src.slice(arrStart, i + 1)))
}
const BRAND_WORDS = extractBrandWords(matcherSrc)

// ── Replicate productMatcher.js logic ────────────────────────────────────────
function normalize(str) {
    if (!str) return ''
    return str.toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s]/g, ' ').trim()
}

function tokenize(str, stripBrands = false) {
    const words = str.split(/\s+/).filter(w => w.length >= 2)
    if (!stripBrands) return words
    const filtered = words.filter(w => !BRAND_WORDS.has(w))
    return filtered.length > 0 ? filtered : words
}

function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 3) return 99
    const m = a.length, n = b.length
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1))
    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        }
    }
    return dp[m][n]
}

function tokenSimilarity(a, b) {
    if (a === b) return 1.0
    if (a.length >= 3 && b.startsWith(a)) return 0.85
    if (b.length >= 3 && a.startsWith(b)) return 0.80
    if (a.length >= 4 && b.includes(a)) return 0.75
    if (b.length >= 4 && a.includes(b)) return 0.70
    if (a.length >= 4 && b.length >= 4) {
        const dist = editDistance(a, b)
        const maxLen = Math.max(a.length, b.length)
        if (dist <= 1) return 0.85
        if (dist <= 2 && maxLen >= 7) return 0.65
    }
    return 0
}

const INDEX = PRODUCT_CATALOGUE.map(p => ({
    name: p.name, category: p.category, subcategory: p.subcategory || null,
    unit: p.defaultUnit, qty: p.defaultQty,
    norm: normalize(p.name), tokens: tokenize(normalize(p.name)),
}))

function scoreEntry(inputTokens, entry) {
    if (inputTokens.length === 0 || entry.tokens.length === 0) return 0
    const inputJoined = inputTokens.join(' ')
    if (inputJoined === entry.norm) return 1.0
    if (inputTokens.length === 1 && entry.tokens[0] === inputTokens[0]) return 0.95
    let forwardSum = 0
    for (const it of inputTokens) {
        let best = 0
        for (const ct of entry.tokens) {
            const sim = tokenSimilarity(it, ct)
            if (sim > best) best = sim
            if (best === 1.0) break
        }
        if (best < 0.75 && it.length >= 4 && entry.norm.includes(it)) best = Math.max(best, 0.75)
        forwardSum += best
    }
    let reverseSum = 0
    for (const ct of entry.tokens) {
        let best = 0
        for (const it of inputTokens) {
            const sim = tokenSimilarity(ct, it)
            if (sim > best) best = sim
            if (best === 1.0) break
        }
        if (best < 0.75 && ct.length >= 4 && inputJoined.includes(ct)) best = Math.max(best, 0.75)
        reverseSum += best
    }
    return (forwardSum / inputTokens.length) * 0.6 + (reverseSum / entry.tokens.length) * 0.4
}

function bestMatch(input, threshold = 0.5) {
    const norm = normalize(input)
    const inputTokens = tokenize(norm, true)
    if (inputTokens.length === 0) return null
    let best = null, bestScore = 0
    for (const entry of INDEX) {
        const score = scoreEntry(inputTokens, entry)
        if (score > bestScore && score >= threshold) {
            bestScore = score
            best = { ...entry, score }
        }
    }
    return best
}

function keywordInText(text, kw) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (kw.length <= 3) return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(text)
    return new RegExp(`(?:^|\\s)${escaped}`).test(text)
}

// ── Embedding search ─────────────────────────────────────────────────────────
const catalogue = JSON.parse(readFileSync(join(__dirname, '..', 'public', 'data', 'subcategory-embeddings.json'), 'utf-8'))
console.log(`Loaded ${catalogue.count} subcategory anchors`)

console.log('Loading model...')
const extractor = await hfPipeline('feature-extraction', 'Xenova/multilingual-e5-small', { dtype: 'q8' })
console.log('Model loaded.\n')

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; normA += a[i] * a[i]; normB += b[i] * b[i] }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function embeddingBestMatch(input, threshold = 0.6) {
    const output = await extractor(`query: ${input}`, { pooling: 'mean', normalize: true })
    const inputVec = output.tolist()[0]
    const scored = []
    for (const entry of catalogue.entries) {
        const sim = cosineSimilarity(inputVec, entry.vec)
        if (sim >= threshold) {
            scored.push({
                level: entry.level || 'subcategory',
                category: entry.category,
                subcategory: entry.subcategory,
                genericName: entry.genericName || null,
                score: sim,
            })
        }
    }
    scored.sort((a, b) => b.score - a.score)
    if (scored.length === 0) return null
    const top = scored[0]
    if (top.level === 'generic') return top
    const closeGen = scored.find(r => r.level === 'generic' && r.subcategory === top.subcategory && (top.score - r.score) <= 0.05)
    return closeGen || top
}

// ── Full pipeline (mirrors classifyProductAsync) ─────────────────────────────
async function classifyFull(name) {
    // Step 0: Exact generic alias match
    const alias = findGenericByAlias(name)
    if (alias) {
        return {
            category: alias.category, subcategory: alias.subcategory || null,
            source: 'generic-exact', score: 1.0, matchedTo: alias.name,
        }
    }

    // Step 1: catalogue fuzzy match
    const catMatch = bestMatch(name, 0.5)
    if (catMatch) {
        return { category: catMatch.category, subcategory: catMatch.subcategory, source: 'catalogue', score: catMatch.score, matchedTo: catMatch.name }
    }

    // Step 2: keyword rules
    const text = name.toLowerCase()
    let bestKw = null, matchedKeyword = null
    for (const rule of KEYWORD_RULES) {
        const hit = rule.keywords.find(kw => keywordInText(text, kw))
        if (hit) {
            if (bestKw === null || CATEGORY_PRIORITY[rule.category] < CATEGORY_PRIORITY[bestKw]) {
                bestKw = rule.category
                const hinted = rule.keywords.find(kw => keywordInText(text, kw) && KEYWORD_SUBCATEGORY_HINTS[kw])
                matchedKeyword = hinted || hit
            }
        }
    }
    if (bestKw) {
        return {
            category: bestKw,
            subcategory: KEYWORD_SUBCATEGORY_HINTS[matchedKeyword] || OFF_KEYWORD_HINTS[matchedKeyword] || null,
            source: 'keyword', score: 0, matchedTo: matchedKeyword
        }
    }

    // Step 3: OFF-expansion keyword hints
    const normText = text.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9\s]/g, ' ').trim()
    const offHintSub = OFF_KEYWORD_HINTS[normText]
    if (offHintSub) {
        const cat = subcatToCategory(offHintSub)
        if (cat) return { category: cat, subcategory: offHintSub, source: 'off-kw', score: 0, matchedTo: normText }
    }

    // Step 4: Embedding fallback
    const embMatch = await embeddingBestMatch(name, 0.6)
    if (embMatch) {
        return {
            category: embMatch.category, subcategory: embMatch.subcategory,
            source: embMatch.level === 'generic' ? 'embedding-gen' : 'embedding',
            score: embMatch.score,
            matchedTo: embMatch.genericName || embMatch.subcategory,
        }
    }

    return { category: 'Other', subcategory: null, source: 'fallback', score: 0, matchedTo: null }
}

// ── Test cases ───────────────────────────────────────────────────────────────
const TEST_CASES = [
    // German products
    { input: 'Walnusskerne naturbelassen', expectedCat: 'Fruits & Veg', expectedSub: 'Nüsse & Kerne' },
    { input: 'Edelbitter mild 85%', expectedCat: 'Snacks & Sweets', expectedSub: 'Schokolade' },
    { input: 'Nussmix', expectedCat: 'Fruits & Veg', expectedSub: 'Nüsse & Kerne' },
    { input: 'Haferflocken', expectedCat: 'Bread & Grains', expectedSub: 'Frühstückscerealien' },
    { input: 'Philadelphia Original', expectedCat: 'Dairy & Eggs', expectedSub: 'Käse — Frischkäse & Aufstrich' },
    { input: 'Kidney Bohnen', expectedCat: 'Fruits & Veg', expectedSub: 'Hülsenfrüchte (trocken & Dose)' },
    { input: 'Vollmilch 3.5%', expectedCat: 'Dairy & Eggs', expectedSub: 'Milch' },
    { input: 'Sojamilch', expectedCat: 'Drinks', expectedSub: 'Pflanzenmilch' },

    // Brand names
    { input: 'Snickers', expectedCat: 'Snacks & Sweets', expectedSub: 'Riegel' },
    { input: 'Nutella', expectedCat: 'Snacks & Sweets', expectedSub: 'Aufstriche (süß)' },
    { input: 'Nesquik', expectedCat: 'Drinks', expectedSub: 'Kakao & Heißgetränke' },
    { input: 'Coca-Cola', expectedCat: 'Drinks', expectedSub: 'Schorle & Limonaden' },
    { input: 'Weetabix', expectedCat: 'Bread & Grains', expectedSub: 'Frühstückscerealien' },

    // French products
    { input: 'Beurre doux', expectedCat: 'Dairy & Eggs', expectedSub: 'Butter & Margarine' },
    { input: 'Moutarde de Dijon', expectedCat: 'Condiments', expectedSub: 'Tischsoßen' },
    { input: 'Confiture de fraises', expectedCat: 'Condiments', expectedSub: 'Marmelade & Aufstrich' },
    { input: 'Sardines à l\'huile d\'olive', expectedCat: 'Meat & Fish', expectedSub: 'Fisch aus der Dose / geräuchert' },
    { input: 'Chocolat noir 85%', expectedCat: 'Snacks & Sweets', expectedSub: 'Schokolade' },

    // English products
    { input: 'Peanut butter', expectedCat: 'Fruits & Veg', expectedSub: 'Nüsse & Kerne' },
    { input: 'Tomato ketchup', expectedCat: 'Condiments', expectedSub: 'Tischsoßen' },
    { input: 'Orange juice', expectedCat: 'Drinks', expectedSub: 'Saft' },
    { input: 'Dark chocolate 70%', expectedCat: 'Snacks & Sweets', expectedSub: 'Schokolade' },
    { input: 'Oat milk', expectedCat: 'Drinks', expectedSub: 'Pflanzenmilch' },

    // Mixed/tricky
    { input: 'Bio Hafer Drink', expectedCat: 'Drinks', expectedSub: 'Pflanzenmilch' },
    { input: 'Arrabbiata Sauce', expectedCat: 'Ready Meals', expectedSub: 'Nudelsoßen (Glas)' },
    { input: 'Meisterbäckers Classic', expectedCat: 'Bread & Grains', expectedSub: 'Brot' },
    { input: 'Ratatouille', expectedCat: 'Ready Meals', expectedSub: 'Fertiggerichte (Dose / Glas)' },
    { input: 'Ginger Shot', expectedCat: 'Drinks', expectedSub: 'Saft' },
    { input: 'Coca-Cola Zero Sugar', expectedCat: 'Drinks', expectedSub: 'Schorle & Limonaden' },
    { input: 'Sojasauce', expectedCat: 'Condiments', expectedSub: 'Asiatische Soßen & Pasten' },

    // ── 3rd-layer tests (generic product aliases) ─────────────────────────
    { input: 'Blaubeeren', expectedCat: 'Fruits & Veg', expectedSub: 'Frisches Obst — Beeren' },
    { input: 'UHT milk', expectedCat: 'Dairy & Eggs', expectedSub: 'Milch' },
    { input: 'chicken breast', expectedCat: 'Meat & Fish', expectedSub: 'Geflügel' },
    { input: 'greek yogurt', expectedCat: 'Dairy & Eggs', expectedSub: 'Joghurt' },
    { input: 'ground beef', expectedCat: 'Meat & Fish', expectedSub: 'Rindfleisch' },
    { input: 'blueberries', expectedCat: 'Fruits & Veg', expectedSub: 'Frisches Obst — Beeren' },
]

// ── Run tests ────────────────────────────────────────────────────────────────
let catCorrect = 0, subCorrect = 0

console.log('═'.repeat(150))
console.log(
    '#'.padStart(3), '│ Cat? │ Sub? │ Source    │ Score │',
    'Input'.padEnd(30), '│',
    'Got Category'.padEnd(18), '│',
    'Got Subcategory'.padEnd(30), '│',
    'Matched To'
)
console.log('─'.repeat(150))

for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i]
    const result = await classifyFull(tc.input)

    const catOk = result.category === tc.expectedCat
    const subOk = result.subcategory === tc.expectedSub
    if (catOk) catCorrect++
    if (subOk) subCorrect++

    console.log(
        String(i + 1).padStart(3), '│',
        (catOk ? '✓' : '✗').padEnd(4), '│',
        (subOk ? '✓' : '✗').padEnd(4), '│',
        result.source.padEnd(9), '│',
        (result.score ? result.score.toFixed(2) : '—').padStart(5), '│',
        tc.input.padEnd(30).slice(0, 30), '│',
        result.category.padEnd(18), '│',
        (result.subcategory || '—').padEnd(30), '│',
        (result.matchedTo || '—').slice(0, 30)
    )
}

console.log('═'.repeat(150))
console.log(`\n  Category accuracy:    ${catCorrect}/${TEST_CASES.length} (${(catCorrect / TEST_CASES.length * 100).toFixed(1)}%)`)
console.log(`  Subcategory accuracy: ${subCorrect}/${TEST_CASES.length} (${(subCorrect / TEST_CASES.length * 100).toFixed(1)}%)`)

// Count by source
const sources = {}
for (const tc of TEST_CASES) {
    const r = await classifyFull(tc.input)
    sources[r.source] = (sources[r.source] || 0) + 1
}
console.log(`\n  Classification sources:`)
for (const [src, count] of Object.entries(sources).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${src.padEnd(15)} ${count}`)
}
