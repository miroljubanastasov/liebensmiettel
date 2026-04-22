#!/usr/bin/env node
/**
 * Debug classification for a single product name.
 * Usage:  node scripts/debug-classify.js "Blaubeeren"
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const input = process.argv[2] || 'Blaubeeren'

// ── Load helpers ─────────────────────────────────────────────────────────────
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

// Load catalogue
const catSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'productCatalogue.js'), 'utf-8')
const PRODUCT_CATALOGUE = eval(extractArray(catSrc, 'PRODUCT_CATALOGUE'))

// Load brand words
const pmSrc = readFileSync(join(__dirname, '..', 'src', 'utils', 'productMatcher.js'), 'utf-8')
const bStart = pmSrc.indexOf('const BRAND_WORDS = new Set([')
const bArr = pmSrc.indexOf('[', bStart)
let d = 0, bi = bArr
for (; bi < pmSrc.length; bi++) { if (pmSrc[bi] === '[') d++; else if (pmSrc[bi] === ']') { d--; if (d === 0) break } }
const BRAND_WORDS = new Set(eval(pmSrc.slice(bArr, bi + 1)))

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
            dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
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
    norm: normalize(p.name), tokens: tokenize(normalize(p.name)),
}))

function scoreEntry(inputTokens, entry) {
    if (inputTokens.length === 0 || entry.tokens.length === 0) return 0
    const inputJoined = inputTokens.join(' ')
    if (inputJoined === entry.norm) return 1.0
    let forwardSum = 0
    for (const it of inputTokens) {
        let best = 0
        for (const ct of entry.tokens) {
            const sim = tokenSimilarity(it, ct)
            if (sim > best) best = sim
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
        }
        if (best < 0.75 && ct.length >= 4 && inputJoined.includes(ct)) best = Math.max(best, 0.75)
        reverseSum += best
    }
    return (forwardSum / inputTokens.length) * 0.6 + (reverseSum / entry.tokens.length) * 0.4
}

const norm = normalize(input)
const inputTokens = tokenize(norm, true)
console.log(`Input: "${input}" → normalized: "${norm}" → tokens: [${inputTokens}]`)

// Top catalogue matches
const scored = []
for (const entry of INDEX) {
    const score = scoreEntry(inputTokens, entry)
    if (score >= 0.3) scored.push({ ...entry, score })
}
scored.sort((a, b) => b.score - a.score)
console.log('\nTop 10 catalogue matches:')
for (const s of scored.slice(0, 10)) {
    console.log(`  ${s.score.toFixed(3)} | ${s.category.padEnd(18)} | ${(s.subcategory || '—').padEnd(30)} | ${s.name}`)
}

// Check keyword rules
const classifySrc = readFileSync(join(__dirname, '..', 'src', 'utils', 'classify.js'), 'utf-8')
function extractValue(src, varName) {
    const re = new RegExp(`const\\s+${varName}\\s*=\\s*`)
    const match = re.exec(src)
    if (!match) return null
    const openChar = src[match.index + match[0].length]
    const closeChar = openChar === '{' ? '}' : ']'
    let depth = 0, i = match.index + match[0].length
    for (; i < src.length; i++) {
        if (src[i] === openChar) depth++
        else if (src[i] === closeChar) { depth--; if (depth === 0) break }
    }
    return src.slice(match.index + match[0].length, i + 1)
}

const KEYWORD_RULES = eval('(' + extractValue(classifySrc, 'KEYWORD_RULES') + ')')

function keywordInText(text, kw) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (kw.length <= 3) return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(text)
    return new RegExp(`(?:^|\\s)${escaped}`).test(text)
}

const text = input.toLowerCase()
console.log('\nKeyword matches:')
for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
        if (keywordInText(text, kw)) {
            console.log(`  "${kw}" → ${rule.category}`)
        }
    }
}

// Check OFF expansion hints
const offExpansion = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'offExpansion.json'), 'utf-8'))
const normText = text.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9\s]/g, ' ').trim()
const offHint = offExpansion.keywordHints?.[normText]
console.log(`\nOFF keyword hint for "${normText}":`, offHint || '(none)')
