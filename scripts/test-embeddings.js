#!/usr/bin/env node
/**
 * Test embedding-based classification on a set of tricky product names.
 *
 * Compares: fuzzy NLP matcher vs. embedding cosine similarity.
 *
 * Usage:  node scripts/test-embeddings.js
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { pipeline, cos_sim } from '@huggingface/transformers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ── Load pre-computed subcategory anchor embeddings ──────────────────────────
const embPath = join(__dirname, '..', 'public', 'data', 'subcategory-embeddings.json')
const catalogue = JSON.parse(readFileSync(embPath, 'utf-8'))
console.log(`Loaded ${catalogue.count} subcategory anchors (${catalogue.dim}d)`)

// ── Load model ───────────────────────────────────────────────────────────────
console.log('Loading model...')
const extractor = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
    dtype: 'q8',
})
console.log('Model loaded.\n')

async function embed(text) {
    const output = await extractor(`query: ${text}`, { pooling: 'mean', normalize: true })
    return output.tolist()[0]
}

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function findTopMatches(input, topN = 5) {
    const inputVec = await embed(input)
    const scored = []
    for (const entry of catalogue.entries) {
        const sim = cosineSimilarity(inputVec, entry.vec)
        scored.push({ ...entry, score: sim })
    }
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, topN).map(s => ({
        subcategory: s.subcategory,
        category: s.category,
        score: Math.round(s.score * 1000) / 1000,
    }))
}

// ── Test cases — tricky products from the OFF test ───────────────────────────
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
]

// ── Run tests ────────────────────────────────────────────────────────────────
let catCorrect = 0
let subCorrect = 0

console.log('═'.repeat(130))
console.log(
    '#'.padStart(3),
    '│ Cat? │ Sub? │ Score │',
    'Input'.padEnd(30),
    '│',
    'Got Category'.padEnd(18),
    '│',
    'Got Subcategory'.padEnd(30),
    '│',
    'Expected'
)
console.log('─'.repeat(130))

for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i]
    const matches = await findTopMatches(tc.input, 1)
    const best = matches[0]

    const catOk = best && best.category === tc.expectedCat
    const subOk = best && best.subcategory === tc.expectedSub
    if (catOk) catCorrect++
    if (subOk) subCorrect++

    console.log(
        String(i + 1).padStart(3),
        '│',
        (catOk ? '✓' : '✗').padEnd(4),
        '│',
        (subOk ? '✓' : '✗').padEnd(4),
        '│',
        (best?.score?.toFixed(3) || '—').padStart(5),
        '│',
        tc.input.padEnd(30).slice(0, 30),
        '│',
        (best?.category || '—').padEnd(18),
        '│',
        (best?.subcategory || '—').padEnd(30),
        '│',
        `${tc.expectedCat} / ${tc.expectedSub}`
    )
}

console.log('═'.repeat(130))
console.log(`\nCategory accuracy:    ${catCorrect}/${TEST_CASES.length} (${(catCorrect / TEST_CASES.length * 100).toFixed(1)}%)`)
console.log(`Subcategory accuracy: ${subCorrect}/${TEST_CASES.length} (${(subCorrect / TEST_CASES.length * 100).toFixed(1)}%)`)
