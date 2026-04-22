#!/usr/bin/env node
/**
 * Expand the product catalogue and keyword hints using the Open Food Facts taxonomy.
 *
 * Downloads the full OFF category taxonomy (~14k categories with German translations),
 * maps them to our subcategories via OFF_SUBCATEGORY_MAP, and outputs:
 *   1. New KEYWORD_SUBCATEGORY_HINTS entries (German names → subcategory)
 *   2. New product catalogue entries
 *
 * Usage:  node scripts/expand-catalogue-off.js
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ── Load existing maps from classify.js ──────────────────────────────────────
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

const OFF_CATEGORY_MAP = eval('(' + extractValue(classifySrc, 'OFF_CATEGORY_MAP') + ')')
const OFF_SUBCATEGORY_MAP = eval('(' + extractValue(classifySrc, 'OFF_SUBCATEGORY_MAP') + ')')
const KEYWORD_SUBCATEGORY_HINTS = eval('(' + extractValue(classifySrc, 'KEYWORD_SUBCATEGORY_HINTS') + ')')

// ── Load existing catalogue ─────────────────────────────────────────────────
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
const existingNames = new Set(PRODUCT_CATALOGUE.map(p => p.name.toLowerCase()))

// ── Download OFF taxonomy ────────────────────────────────────────────────────
const TAXONOMY_URL = 'https://static.openfoodfacts.org/data/taxonomies/categories.full.json'

console.log('Downloading OFF taxonomy...')
const resp = await fetch(TAXONOMY_URL)
if (!resp.ok) throw new Error(`Failed to download taxonomy: ${resp.status}`)
const taxonomy = await resp.json()
console.log(`Got ${Object.keys(taxonomy).length} categories`)

// ── Build reverse map: subcategory → category ────────────────────────────────
// (we need to know which category a subcategory belongs to for catalogue entries)
const subcatSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'subcategories.js'), 'utf-8')
const subcatArr = extractArray(subcatSrc, 'SUBCATEGORIES')
const SUBCATEGORIES = subcatArr ? eval(subcatArr) : []
const subcatToCategory = new Map()
for (const s of SUBCATEGORIES) {
    subcatToCategory.set(s.name, s.category)
}

// ── Walk taxonomy and extract German names ───────────────────────────────────
const newKeywordHints = {}  // keyword → subcategory
const newCatalogueEntries = []  // { category, subcategory, name }

let directMapped = 0
let parentMapped = 0
let skipped = 0

for (const [tag, entry] of Object.entries(taxonomy)) {
    // Check if this tag directly maps to a subcategory
    let subcategory = OFF_SUBCATEGORY_MAP[tag]
    let category = OFF_CATEGORY_MAP[tag]

    // If no direct mapping, try walking up parents
    if (!subcategory && entry.parents) {
        for (const parent of entry.parents) {
            if (OFF_SUBCATEGORY_MAP[parent]) {
                subcategory = OFF_SUBCATEGORY_MAP[parent]
                category = category || OFF_CATEGORY_MAP[parent]
                parentMapped++
                break
            }
        }
    }

    if (!subcategory) {
        skipped++
        continue
    }

    // Resolve category from subcategory if not found
    if (!category) {
        category = subcatToCategory.get(subcategory) || null
    }
    if (!category) continue

    directMapped++

    // Extract German names
    const deName = entry.name?.de
    const deSynonyms = entry.synonyms?.de || []
    const enName = entry.name?.en

    const names = []
    if (deName) names.push(deName)
    names.push(...deSynonyms)
    // Also add English name as fallback keyword
    if (enName && !names.includes(enName)) names.push(enName)

    for (const rawName of names) {
        const name = rawName.trim()
        if (!name || name.length < 3) continue
        // Skip overly generic names
        if (['Lebensmittel', 'Essen', 'Nahrung', 'Food', 'Foods', 'Products',
            'Produkte', 'Getränke', 'Beverages', 'Drinks'].includes(name)) continue

        // Add as keyword hint (lowercase, no special chars)
        const keyword = name.toLowerCase()
            .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        if (keyword.length >= 3 && !KEYWORD_SUBCATEGORY_HINTS[keyword]) {
            newKeywordHints[keyword] = subcategory
        }

        // Add as catalogue entry if it's a specific-enough name
        const nameLower = name.toLowerCase()
        if (!existingNames.has(nameLower) && name.length >= 4 && name.length <= 50) {
            // Determine default unit/qty from subcategory
            const { unit, qty } = guessUnitQty(subcategory)
            newCatalogueEntries.push({
                category,
                subcategory,
                name,
                defaultUnit: unit,
                defaultQty: qty,
            })
            existingNames.add(nameLower)
        }
    }
}

function guessUnitQty(subcategory) {
    const sub = subcategory.toLowerCase()
    if (sub.includes('milch') || sub.includes('saft') || sub.includes('wasser') ||
        sub.includes('drink') || sub.includes('bier') || sub.includes('wein') ||
        sub.includes('limonade') || sub.includes('schorle') || sub.includes('smoothie') ||
        sub.includes('tee') || sub.includes('kaffee') || sub.includes('kakao') ||
        sub.includes('spirituose') || sub.includes('sahne') || sub.includes('öl')) {
        return { unit: 'ml', qty: 500 }
    }
    if (sub.includes('obst') || sub.includes('gemüse') || sub.includes('banane') ||
        sub.includes('apfel') || sub.includes('pilze') || sub.includes('salat') ||
        sub.includes('kräuter')) {
        return { unit: 'pc', qty: 1 }
    }
    if (sub.includes('eier')) return { unit: 'pc', qty: 6 }
    return { unit: 'g', qty: 200 }
}

// ── Deduplicate and sort ─────────────────────────────────────────────────────
// Remove keyword hints that are too generic (single common words)
const GENERIC_WORDS = new Set([
    'bio', 'natur', 'frisch', 'fresh', 'light', 'diet', 'vegan', 'organic',
    'pflanzlich', 'plant', 'raw', 'roh', 'pur', 'pure', 'extra', 'ohne',
    'mit', 'und', 'and', 'from', 'von', 'aus', 'fuer',
])
for (const kw of Object.keys(newKeywordHints)) {
    if (GENERIC_WORDS.has(kw) || kw.length < 3) {
        delete newKeywordHints[kw]
    }
}

// Filter catalogue entries: only keep entries that look like real product names
const filteredCatalogueEntries = newCatalogueEntries.filter(e => {
    const name = e.name
    if (/^ab\s+\d/i.test(name)) return false      // Age ranges
    if (/^\d+/.test(name)) return false             // Numbers/codes
    if (name.length > 40) return false              // Too long
    if (name.split(/\s+/).length > 5) return false  // Too many words
    if (/^(other|andere|sonstige|various|diverse|misc)/i.test(name)) return false
    return true
})

// Sort catalogue entries by category then subcategory
filteredCatalogueEntries.sort((a, b) =>
    a.category.localeCompare(b.category) || a.subcategory.localeCompare(b.subcategory) || a.name.localeCompare(b.name)
)

// ── Output results ───────────────────────────────────────────────────────────
const outputPath = join(__dirname, '..', 'src', 'data', 'offExpansion.json')
const output = {
    meta: {
        generatedAt: new Date().toISOString(),
        taxonomySize: Object.keys(taxonomy).length,
        directMapped,
        parentMapped,
        skipped,
    },
    keywordHints: newKeywordHints,
    catalogueEntries: filteredCatalogueEntries,
}
writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')

console.log(`\n══════════════════════════════════════════════════`)
console.log(`  OFF Taxonomy Expansion Results`)
console.log(`══════════════════════════════════════════════════`)
console.log(`  Taxonomy categories:     ${Object.keys(taxonomy).length}`)
console.log(`  Direct-mapped:           ${directMapped}`)
console.log(`  Parent-mapped:           ${parentMapped}`)
console.log(`  Skipped (no mapping):    ${skipped}`)
console.log(`  New keyword hints:       ${Object.keys(newKeywordHints).length}`)
console.log(`  New catalogue entries:   ${filteredCatalogueEntries.length} (filtered from ${newCatalogueEntries.length})`)
console.log(`══════════════════════════════════════════════════`)
console.log(`\nWritten to: ${outputPath}`)

// Show sample of new keyword hints
console.log(`\nSample keyword hints (first 30):`)
const sampleHints = Object.entries(newKeywordHints).slice(0, 30)
for (const [kw, sub] of sampleHints) {
    console.log(`  ${kw.padEnd(30)} → ${sub}`)
}

// Show sample of new catalogue entries
console.log(`\nSample catalogue entries (first 20):`)
for (const e of newCatalogueEntries.slice(0, 20)) {
    console.log(`  ${e.name.padEnd(30)} → ${e.category} / ${e.subcategory}`)
}
