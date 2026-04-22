#!/usr/bin/env node
/**
 * Test classification on random Open Food Facts products.
 *
 * Pulls a batch of real German-market products from OFF, feeds their
 * product names into our fuzzy matcher (productMatcher) and reports:
 *
 *   - how often a match was found above threshold
 *   - top-1 result per product (name → match, subcategory, icon)
 *   - suspicious matches (low score or cross-category)
 *
 * Usage:
 *   node scripts/test-classify-off.js            # 30 random products
 *   node scripts/test-classify-off.js 100        # 100 products
 *   node scripts/test-classify-off.js 50 --json  # machine-readable output
 */

import { pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '..', 'src')

// ─── CLI args ───────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const wantJson = argv.includes('--json')
const count = parseInt(argv.find(a => /^\d+$/.test(a)) || '30', 10)

// ─── OFF random-product fetch ───────────────────────────────────────────────
// OFF's v2 API lets us page over German products. We pick a random page
// to get a varied sample rather than always the top sellers.
async function fetchRandomOffProducts(n) {
    const pageSize = Math.min(Math.max(n, 20), 100)
    const maxPage = 20
    const page = 1 + Math.floor(Math.random() * maxPage)
    const fields = 'code,product_name,product_name_de,brands,categories_tags'
    const url = `https://world.openfoodfacts.org/api/v2/search`
        + `?countries_tags_en=germany&page_size=${pageSize}&page=${page}&fields=${fields}`

    const headers = { 'User-Agent': 'LiebensmittelApp-classifier-test/1.0 (dev)' }
    let attempt = 0, lastErr
    while (attempt < 3) {
        try {
            const res = await fetch(url, { headers })
            if (res.ok) {
                const data = await res.json()
                const products = (data.products || [])
                    .map(p => ({
                        ean: p.code,
                        name: p.product_name_de || p.product_name || '',
                        brand: (p.brands || '').split(',')[0].trim(),
                        categories: p.categories_tags || [],
                    }))
                    .filter(p => p.name && p.name.length >= 3)
                // Shuffle & trim
                products.sort(() => Math.random() - 0.5)
                return products.slice(0, n)
            }
            lastErr = new Error(`status ${res.status}`)
        } catch (e) {
            lastErr = e
        }
        attempt++
        await new Promise(r => setTimeout(r, 1500 * attempt))
    }
    throw new Error(`OFF fetch failed after ${attempt} attempts: ${lastErr?.message}`)
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
    const [{ matchProduct }, { getProductIcon }] = await Promise.all([
        import(pathToFileURL(resolve(SRC, 'utils', 'productMatcher.js')).href),
        import(pathToFileURL(resolve(SRC, 'data', 'productIcons.js')).href),
    ])

    console.log(`↓ fetching ${count} random OFF products (Germany) …`)
    const products = await fetchRandomOffProducts(count)
    console.log(`✓ got ${products.length} products\n`)

    const rows = []
    let matched = 0, strong = 0, weak = 0
    for (const p of products) {
        const [m] = matchProduct(p.name, { topN: 1, threshold: 0.3 })
        const row = {
            input: p.name,
            brand: p.brand,
            match: m?.name || null,
            subcategory: m?.subcategory || null,
            category: m?.category || null,
            score: m?.score ? +m.score.toFixed(2) : null,
            icon: m ? getProductIcon(m.name, m.category) : null,
        }
        rows.push(row)
        if (m) {
            matched++
            if (m.score >= 0.55) strong++
            else weak++
        }
    }

    if (wantJson) {
        console.log(JSON.stringify(rows, null, 2))
    } else {
        const pad = (s, n) => String(s ?? '—').slice(0, n).padEnd(n)
        console.log(pad('Input (brand)', 48), pad('→ Match', 30), pad('Subcategory', 24), 'Score  Icon')
        console.log('─'.repeat(120))
        for (const r of rows) {
            const left = `${r.input}${r.brand ? `  [${r.brand}]` : ''}`
            console.log(
                pad(left, 48),
                pad(r.match ? `→ ${r.match}` : '— no match —', 30),
                pad(r.subcategory, 24),
                (r.score ?? '    ').toString().padEnd(6),
                r.icon || '',
            )
        }
    }

    console.log(`\n── summary ──`)
    console.log(`  matched:  ${matched}/${products.length}   (${((matched / products.length) * 100).toFixed(0)} %)`)
    console.log(`  strong:   ${strong}   (score ≥ 0.55)`)
    console.log(`  weak:     ${weak}   (0.30–0.55)`)
    console.log(`  no match: ${products.length - matched}`)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
