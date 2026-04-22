#!/usr/bin/env node
/**
 * Pre-compute embeddings for ALL THREE TAXONOMY LEVELS:
 *
 *   - Subcategory anchors (~120): rich, multi-product descriptions for
 *     catching the right subcategory when the input is novel.
 *   - Generic product anchors (~1.3k): one per PRODUCT_CATALOGUE entry,
 *     built from name + aliases + subcategory context. Used for fine-grained
 *     matches like "chicken breast" → "Hähnchenbrustfilet".
 *
 * Both are written to a single file so the runtime loads once.
 *
 * Generates:
 *   public/data/subcategory-embeddings.json
 *
 * Usage:  node scripts/build-embeddings.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { pipeline } from '@huggingface/transformers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

function extractObject(src, varName) {
    const re = new RegExp(`(?:const|export const)\\s+${varName}\\s*=\\s*\\{`)
    const match = re.exec(src)
    if (!match) return null
    let depth = 0, i = src.indexOf('{', match.index), begin = i
    for (; i < src.length; i++) {
        if (src[i] === '{') depth++
        else if (src[i] === '}') { depth--; if (depth === 0) break }
    }
    return src.slice(begin, i + 1)
}

function slugifyGenericId(name) {
    if (!name) return ''
    return name
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// ── Load subcategories ───────────────────────────────────────────────────────
const subcatSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'subcategories.js'), 'utf-8')
const SUBCATEGORIES = eval(extractArray(subcatSrc, 'SUBCATEGORIES'))

// ── Load product catalogue ───────────────────────────────────────────────────
const catalogueSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'productCatalogue.js'), 'utf-8')
const PRODUCT_CATALOGUE = eval(extractArray(catalogueSrc, 'PRODUCT_CATALOGUE'))
const GENERIC_ALIASES = eval('(' + extractObject(catalogueSrc, 'GENERIC_ALIASES') + ')')

// Group products by subcategory
const productsBySubcat = new Map()
for (const p of PRODUCT_CATALOGUE) {
    const sub = p.subcategory || '_none'
    if (!productsBySubcat.has(sub)) productsBySubcat.set(sub, [])
    productsBySubcat.get(sub).push(p.name)
}

// ── Load OFF expansion for extra multilingual keywords ───────────────────────
let offHints = {}
try {
    const offExpansion = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'offExpansion.json'), 'utf-8'))
    for (const [kw, sub] of Object.entries(offExpansion.keywordHints || {})) {
        if (!offHints[sub]) offHints[sub] = []
        if (offHints[sub].length < 15) offHints[sub].push(kw)
    }
} catch { /* ignore */ }

// ── Build subcategory anchor texts ───────────────────────────────────────────
const subAnchors = []
for (const sub of SUBCATEGORIES) {
    const products = productsBySubcat.get(sub.name) || []
    const offKws = offHints[sub.name] || []

    const parts = [`${sub.category} — ${sub.name}`]
    if (products.length > 0) parts.push(...products.slice(0, 15))
    if (sub.ingredientEN) parts.push(sub.ingredientEN)

    const existing = new Set(parts.map(p => p.toLowerCase()))
    for (const kw of offKws) {
        if (!existing.has(kw.toLowerCase()) && kw.length >= 3) {
            parts.push(kw)
            existing.add(kw.toLowerCase())
        }
        if (parts.length >= 30) break
    }

    subAnchors.push({
        level: 'subcategory',
        subcategory: sub.name,
        category: sub.category,
        text: `passage: ${parts.join(', ')}`,
    })
}

// ── Build generic-product anchor texts ───────────────────────────────────────
const subByName = new Map(SUBCATEGORIES.map(s => [s.name, s]))

const genericAnchors = []
for (const p of PRODUCT_CATALOGUE) {
    const aliases = GENERIC_ALIASES[p.name] || []
    const subObj = p.subcategory ? subByName.get(p.subcategory) : null

    const parts = [p.name]
    for (const a of aliases) parts.push(a)
    if (p.subcategory) parts.push(p.subcategory)
    if (subObj?.ingredientEN) parts.push(subObj.ingredientEN)

    genericAnchors.push({
        level: 'generic',
        genericId: slugifyGenericId(p.name),
        genericName: p.name,
        subcategory: p.subcategory || null,
        category: p.category,
        text: `passage: ${parts.join(', ')}`,
    })
}

const anchors = [...subAnchors, ...genericAnchors]
console.log(`Built ${subAnchors.length} subcategory + ${genericAnchors.length} generic = ${anchors.length} anchors`)

// ── Load model ───────────────────────────────────────────────────────────────
console.log('\nLoading multilingual-e5-small model...')
const extractor = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
    dtype: 'q8',
})
console.log('Model loaded.')

// ── Compute embeddings ───────────────────────────────────────────────────────
const BATCH_SIZE = 32
const results = []
const startTime = Date.now()

for (let i = 0; i < anchors.length; i += BATCH_SIZE) {
    const batch = anchors.slice(i, i + BATCH_SIZE)
    const texts = batch.map(a => a.text)

    const output = await extractor(texts, { pooling: 'mean', normalize: true })
    const vecs = output.tolist()

    for (let j = 0; j < batch.length; j++) {
        const a = batch[j]
        // Subcategory anchors: 4 decimals (fewer, more critical).
        // Generic anchors:     3 decimals (many, moderate precision OK).
        const precision = a.level === 'subcategory' ? 10000 : 1000
        const vec = vecs[j].map(v => Math.round(v * precision) / precision)
        const entry = { level: a.level, category: a.category, subcategory: a.subcategory, vec }
        if (a.level === 'generic') {
            entry.genericId = a.genericId
            entry.genericName = a.genericName
        }
        results.push(entry)
    }

    const progress = Math.min(100, Math.round((i + batch.length) / anchors.length * 100))
    process.stdout.write(`\r  Embedding: ${progress}% (${i + batch.length}/${anchors.length})`)
}
console.log('')

// ── Save ─────────────────────────────────────────────────────────────────────
const outDir = join(__dirname, '..', 'public', 'data')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'subcategory-embeddings.json')
const payload = {
    model: 'Xenova/multilingual-e5-small',
    dtype: 'q8',
    dim: results[0].vec.length,
    count: results.length,
    subcategoryCount: subAnchors.length,
    genericCount: genericAnchors.length,
    generatedAt: new Date().toISOString(),
    entries: results,
}
writeFileSync(outPath, JSON.stringify(payload), 'utf-8')

const sizeMB = (Buffer.byteLength(JSON.stringify(payload)) / 1024 / 1024).toFixed(2)
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

console.log(`\n══════════════════════════════════════════════════`)
console.log(`  Multi-Level Anchor Embeddings Complete`)
console.log(`  Subcategory: ${subAnchors.length}`)
console.log(`  Generic:     ${genericAnchors.length}`)
console.log(`  Total:       ${results.length}`)
console.log(`  Dim:         ${results[0].vec.length}`)
console.log(`  Size:        ${sizeMB} MB`)
console.log(`  Time:        ${elapsed}s`)
console.log(`══════════════════════════════════════════════════`)
