#!/usr/bin/env node
/**
 * Test subcategory assignment on ~100 random Open Food Facts products,
 * simulating USER INPUT (name-only classification, no OFF taxonomy tags).
 *
 * Ground truth: OFF taxonomy → category/subcategory (via the full pipeline).
 * Test target:  name-only → category/subcategory (catalogue + keyword fallback).
 *
 * Usage:  node scripts/test-subcategory.js
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ── Load classify.js source and extract the maps ─────────────────────────────
const classifySrc = readFileSync(join(__dirname, '..', 'src', 'utils', 'classify.js'), 'utf-8')

function extractValue(src, varName) {
    const re = new RegExp(`const\\s+${varName}\\s*=\\s*`)
    const match = re.exec(src)
    if (!match) throw new Error(`Could not find ${varName}`)
    const openChar = src[match.index + match[0].length]
    const closeChar = openChar === '{' ? '}' : ']'
    let depth = 0
    let i = match.index + match[0].length
    const begin = i
    for (; i < src.length; i++) {
        if (src[i] === openChar) depth++
        else if (src[i] === closeChar) { depth--; if (depth === 0) break }
    }
    return src.slice(begin, i + 1)
}

const OFF_CATEGORY_MAP = eval('(' + extractValue(classifySrc, 'OFF_CATEGORY_MAP') + ')')
const OFF_SUBCATEGORY_MAP = eval('(' + extractValue(classifySrc, 'OFF_SUBCATEGORY_MAP') + ')')
const KEYWORD_RULES = eval('(' + extractValue(classifySrc, 'KEYWORD_RULES') + ')')
const CATEGORY_PRIORITY = eval('(' + extractValue(classifySrc, 'CATEGORY_PRIORITY') + ')')

// ── Load product catalogue ───────────────────────────────────────────────────
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
let PRODUCT_CATALOGUE = []
const catArr = extractArray(catalogueSrc, 'PRODUCT_CATALOGUE')
if (catArr) PRODUCT_CATALOGUE = eval(catArr)

// ── Load subcategories ───────────────────────────────────────────────────────
const subcatSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'subcategories.js'), 'utf-8')
const subcatArr = extractArray(subcatSrc, 'SUBCATEGORIES')
const SUBCATEGORIES = subcatArr ? eval(subcatArr) : []
const SUBCAT_BY_NAME = new Map(SUBCATEGORIES.map(s => [s.name, s]))

// ── Load productMatcher.js source and extract brand words ────────────────────
const matcherSrc = readFileSync(join(__dirname, '..', 'src', 'utils', 'productMatcher.js'), 'utf-8')

// Extract BRAND_WORDS — it's `new Set([...])`, so find the inner array
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
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || null,
    norm: normalize(p.name),
    tokens: tokenize(normalize(p.name)),
}))

function scoreEntry(inputTokens, entry) {
    const catTokens = entry.tokens
    if (inputTokens.length === 0 || catTokens.length === 0) return 0
    const inputJoined = inputTokens.join(' ')
    if (inputJoined === entry.norm) return 1.0
    if (inputTokens.length === 1 && catTokens.length > 0 && catTokens[0] === inputTokens[0]) return 0.95

    let forwardSum = 0
    for (const it of inputTokens) {
        let best = 0
        for (const ct of catTokens) {
            const sim = tokenSimilarity(it, ct)
            if (sim > best) best = sim
            if (best === 1.0) break
        }
        if (best < 0.75 && it.length >= 4 && entry.norm.includes(it)) best = Math.max(best, 0.75)
        forwardSum += best
    }
    const forwardScore = forwardSum / inputTokens.length

    let reverseSum = 0
    for (const ct of catTokens) {
        let best = 0
        for (const it of inputTokens) {
            const sim = tokenSimilarity(ct, it)
            if (sim > best) best = sim
            if (best === 1.0) break
        }
        if (best < 0.75 && ct.length >= 4 && inputJoined.includes(ct)) best = Math.max(best, 0.75)
        reverseSum += best
    }
    const reverseScore = reverseSum / catTokens.length

    return forwardScore * 0.6 + reverseScore * 0.4
}

function bestMatch(input, threshold = 0.4) {
    if (!input || typeof input !== 'string') return null
    const norm = normalize(input)
    const inputTokens = tokenize(norm, true)
    if (inputTokens.length === 0) return null

    let bestEntry = null, bestScore = 0
    for (const entry of INDEX) {
        const score = scoreEntry(inputTokens, entry)
        if (score > bestScore) {
            bestScore = score
            bestEntry = entry
        }
    }
    if (bestScore >= threshold && bestEntry) {
        return { name: bestEntry.name, category: bestEntry.category, subcategory: bestEntry.subcategory, score: bestScore }
    }
    return null
}

// ── classifyProduct — NAME ONLY (simulates user input) ───────────────────────

// Keyword matching helper — matches classify.js
function keywordInText(text, kw) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (kw.length <= 3) {
        return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(text)
    }
    return new RegExp(`(?:^|\\s)${escaped}`).test(text)
}

// Load KEYWORD_SUBCATEGORY_HINTS from classify.js
const KEYWORD_SUBCATEGORY_HINTS = eval('(' + extractValue(classifySrc, 'KEYWORD_SUBCATEGORY_HINTS') + ')')

function classifyByNameOnly(name, brand = '') {
    // Step 1: catalogue match (primary path for user input)
    if (name) {
        const match = bestMatch(name, 0.5)
        if (match) {
            return {
                category: match.category,
                subcategory: match.subcategory || null,
                source: 'catalogue',
                matchedTo: match.name,
                score: match.score,
            }
        }
    }

    // Step 2: keyword rules
    const text = [name, brand].join(' ').toLowerCase()
    let bestKw = null
    let matchedKeyword = null
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
    if (bestKw) return { category: bestKw, subcategory: KEYWORD_SUBCATEGORY_HINTS[matchedKeyword] || null, source: 'keyword', matchedTo: null, score: 0 }

    return { category: 'Other', subcategory: null, source: 'fallback', matchedTo: null, score: 0 }
}

// ── Ground truth: classify using full OFF taxonomy ───────────────────────────
function classifyWithOFF(name, brand, categories) {
    let bestOff = null, bestSub = null
    for (const tag of categories) {
        const cat = OFF_CATEGORY_MAP[tag]
        if (cat && (bestOff === null || CATEGORY_PRIORITY[cat] < CATEGORY_PRIORITY[bestOff])) {
            bestOff = cat
        }
        const sub = OFF_SUBCATEGORY_MAP[tag]
        if (sub) bestSub = sub
    }
    if (bestOff) return { category: bestOff, subcategory: bestSub }
    return null
}

// ── Fetch products from OFF ──────────────────────────────────────────────────
const SEARCH_URL = 'https://world.openfoodfacts.org/api/v2/search'
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchProducts(page, pageSize, retries = 3) {
    const params = new URLSearchParams({
        countries_tags_contains: 'germany',
        sort_by: 'unique_scans_n',
        page_size: String(pageSize),
        page: String(page),
        fields: 'code,product_name,product_name_de,brands,categories_tags,categories',
    })
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(`${SEARCH_URL}?${params}`, {
                headers: { 'User-Agent': 'LiebensmittelApp-Test/1.0' }
            })
            if (res.status === 503 || res.status === 429) {
                console.log(`  Page ${page} attempt ${attempt}: ${res.status}, retrying in ${attempt * 3}s...`)
                await sleep(attempt * 3000)
                continue
            }
            if (!res.ok) throw new Error(`OFF search failed: ${res.status}`)
            const data = await res.json()
            return data.products || []
        } catch (err) {
            if (attempt === retries) throw err
            console.log(`  Attempt ${attempt} failed: ${err.message}, retrying...`)
            await sleep(attempt * 3000)
        }
    }
    return []
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('Fetching ~100 products from Open Food Facts (Germany, popular)...')
    console.log('Testing NAME-ONLY classification (simulating user input)\n')

    const allProducts = []
    for (let page = 1; page <= 6; page++) {
        const batch = await fetchProducts(page, 20)
        allProducts.push(...batch)
        console.log(`  Fetched page ${page}: ${batch.length} products (total: ${allProducts.length})`)
        if (allProducts.length >= 100) break
        await sleep(1000) // rate limit
    }
    const products = allProducts.slice(0, 100)
    console.log(`\nGot ${products.length} products to test.\n`)

    // ── Classify each product ───────────────────────────────────────────────
    const results = []
    for (const p of products) {
        const name = p.product_name_de || p.product_name || '(no name)'
        const brand = p.brands || ''
        const cats = p.categories_tags || []

        // Ground truth from OFF taxonomy
        const truth = classifyWithOFF(name, brand, cats)

        // Name-only classification (what we're testing)
        const tested = classifyByNameOnly(name, brand)

        const catMatch = truth ? tested.category === truth.category : null
        const subMatch = truth && truth.subcategory ? tested.subcategory === truth.subcategory : null

        results.push({
            name,
            brand,
            truthCat: truth?.category || '?',
            truthSub: truth?.subcategory || '?',
            testedCat: tested.category,
            testedSub: tested.subcategory,
            source: tested.source,
            matchedTo: tested.matchedTo,
            score: tested.score,
            catMatch,
            subMatch,
        })
    }

    // ── Detailed results table ──────────────────────────────────────────────
    console.log('═'.repeat(160))
    console.log(
        '  #  │ Cat? │ Sub? │ Source    │ Score │ ' +
        'Tested Category     │ Tested Subcategory              │ ' +
        'Truth Category      │ Truth Subcategory               │ Product → Matched To'
    )
    console.log('─'.repeat(160))

    for (let i = 0; i < results.length; i++) {
        const r = results[i]
        const num = String(i + 1).padStart(3)
        const catOk = r.catMatch === null ? ' ?? ' : r.catMatch ? ' ✓  ' : ' ✗  '
        const subOk = r.subMatch === null ? ' ?? ' : r.subMatch ? ' ✓  ' : ' ✗  '
        const src = (r.source || '').padEnd(9)
        const scr = r.score ? r.score.toFixed(2).padStart(5) : '  —  '
        const tCat = (r.testedCat || '').padEnd(20)
        const tSub = (r.testedSub || '—').padEnd(32)
        const gCat = (r.truthCat || '').padEnd(20)
        const gSub = (r.truthSub || '—').padEnd(32)
        const nm = (r.name || '').slice(0, 30)
        const mt = r.matchedTo ? ` → ${r.matchedTo.slice(0, 25)}` : ''
        console.log(`${num}  │${catOk}│${subOk}│ ${src}│ ${scr} │ ${tCat}│ ${tSub}│ ${gCat}│ ${gSub}│ ${nm}${mt}`)
    }
    console.log('═'.repeat(160))

    // ── Summary ─────────────────────────────────────────────────────────────
    const total = results.length
    const withTruth = results.filter(r => r.catMatch !== null)
    const catCorrect = results.filter(r => r.catMatch === true).length
    const catWrong = results.filter(r => r.catMatch === false).length
    const subCorrect = results.filter(r => r.subMatch === true).length
    const subWrong = results.filter(r => r.subMatch === false).length
    const subNA = results.filter(r => r.subMatch === null).length
    const noSub = results.filter(r => !r.testedSub).length
    const bySource = {}
    for (const r of results) bySource[r.source] = (bySource[r.source] || 0) + 1

    console.log('\n╔══════════════════════════════════════════════════════════════════╗')
    console.log('║           NAME-ONLY CLASSIFICATION TEST RESULTS                 ║')
    console.log('╠══════════════════════════════════════════════════════════════════╣')
    console.log(`║  Total products:           ${String(total).padStart(4)}                                  ║`)
    console.log(`║  With OFF ground truth:    ${String(withTruth.length).padStart(4)}                                  ║`)
    console.log('╠══════════════════════════════════════════════════════════════════╣')
    console.log('║  CATEGORY ACCURACY (vs OFF ground truth)                         ║')
    console.log(`║    Correct:  ${String(catCorrect).padStart(3)} / ${String(withTruth.length).padStart(3)}  (${(catCorrect / withTruth.length * 100).toFixed(1).padStart(5)}%)                            ║`)
    console.log(`║    Wrong:    ${String(catWrong).padStart(3)} / ${String(withTruth.length).padStart(3)}  (${(catWrong / withTruth.length * 100).toFixed(1).padStart(5)}%)                            ║`)
    console.log('╠══════════════════════════════════════════════════════════════════╣')
    console.log('║  SUBCATEGORY ACCURACY (vs OFF ground truth, where truth exists)  ║')
    const subTotal = subCorrect + subWrong
    if (subTotal > 0) {
        console.log(`║    Correct:  ${String(subCorrect).padStart(3)} / ${String(subTotal).padStart(3)}  (${(subCorrect / subTotal * 100).toFixed(1).padStart(5)}%)                            ║`)
        console.log(`║    Wrong:    ${String(subWrong).padStart(3)} / ${String(subTotal).padStart(3)}  (${(subWrong / subTotal * 100).toFixed(1).padStart(5)}%)                            ║`)
    }
    console.log(`║    No OFF subcategory:     ${String(subNA).padStart(3)}                                    ║`)
    console.log(`║    No tested subcategory:  ${String(noSub).padStart(3)}                                    ║`)
    console.log('╠══════════════════════════════════════════════════════════════════╣')
    console.log('║  CLASSIFICATION SOURCE                                           ║')
    for (const [src, count] of Object.entries(bySource).sort((a, b) => b[1] - a[1])) {
        console.log(`║    ${src.padEnd(12)} ${String(count).padStart(3)} (${(count / total * 100).toFixed(1).padStart(5)}%)                                ║`)
    }
    console.log('╠══════════════════════════════════════════════════════════════════╣')

    // ── Misclassifications detail ───────────────────────────────────────────
    const catErrors = results.filter(r => r.catMatch === false)
    console.log(`║  CATEGORY MISMATCHES (${catErrors.length})                                          ║`)
    if (catErrors.length === 0) {
        console.log('║    None!                                                          ║')
    } else {
        for (const r of catErrors.slice(0, 25)) {
            const nm = (r.name || '').slice(0, 28).padEnd(28)
            const got = (r.testedCat || '').padEnd(16)
            const exp = (r.truthCat || '').padEnd(16)
            console.log(`║    ${nm} got:${got} exp:${exp}  ║`)
        }
        if (catErrors.length > 25) console.log(`║    ... and ${catErrors.length - 25} more                                                ║`)
    }
    console.log('╠══════════════════════════════════════════════════════════════════╣')

    const subErrors = results.filter(r => r.subMatch === false)
    console.log(`║  SUBCATEGORY MISMATCHES (${subErrors.length})                                       ║`)
    if (subErrors.length === 0) {
        console.log('║    None!                                                          ║')
    } else {
        for (const r of subErrors.slice(0, 25)) {
            const nm = (r.name || '').slice(0, 22).padEnd(22)
            const got = (r.testedSub || '—').slice(0, 18).padEnd(18)
            const exp = (r.truthSub || '—').slice(0, 18).padEnd(18)
            console.log(`║    ${nm} got:${got} exp:${exp}  ║`)
        }
        if (subErrors.length > 25) console.log(`║    ... and ${subErrors.length - 25} more                                                ║`)
    }
    console.log('╠══════════════════════════════════════════════════════════════════╣')

    const fallbacks = results.filter(r => r.source === 'fallback')
    console.log(`║  UNCLASSIFIED (fallback to Other): ${String(fallbacks.length).padStart(3)}                             ║`)
    for (const r of fallbacks.slice(0, 15)) {
        const nm = (r.name || '').slice(0, 50).padEnd(50)
        console.log(`║    ${nm}              ║`)
    }

    const kwOnly = results.filter(r => r.source === 'keyword')
    console.log(`║  KEYWORD-ONLY (no subcategory): ${String(kwOnly.length).padStart(3)}                                ║`)
    for (const r of kwOnly.slice(0, 15)) {
        const nm = (r.name || '').slice(0, 40).padEnd(40)
        const cat = (r.testedCat || '').padEnd(16)
        console.log(`║    ${nm} → ${cat}        ║`)
    }

    console.log('╚══════════════════════════════════════════════════════════════════╝')
}

main().catch(err => { console.error('Error:', err); process.exit(1) })
