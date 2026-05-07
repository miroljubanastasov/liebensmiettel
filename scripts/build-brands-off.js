#!/usr/bin/env node
/**
 * Build src/data/brands.generated.js from the Open Food Facts search API
 * (search-a-licious), aggregating brand counts for products sold in Germany.
 *
 * The OFF search API limits terms aggregations to the top 10 results per
 * call and does not expose a `size` parameter. To paginate we iteratively
 * query, capture the top brands, then *exclude* them from subsequent
 * queries via `NOT brands_tags:(...)` in the Lucene `q` string. Each
 * iteration captures up to 10 new brands until counts drop below MIN or
 * the budget is exhausted.
 *
 * Endpoint: https://search.openfoodfacts.org/search  (POST)
 *
 * Usage
 * -----
 *   node scripts/build-brands-off.js                  # defaults: min=5, iterations=200
 *   node scripts/build-brands-off.js --min=10 --iterations=100
 *   node scripts/build-brands-off.js --limit=2000     # cap final list
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, '..', 'src', 'data', 'brands.generated.js')

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = new Map(
    process.argv.slice(2).map((a) => {
        const [k, v] = a.replace(/^--/, '').split('=')
        return [k, v ?? 'true']
    })
)
const MIN = parseInt(args.get('min') ?? '5', 10)
const MAX_ITERS = parseInt(args.get('iterations') ?? '200', 10)
const LIMIT = parseInt(args.get('limit') ?? '100000', 10)
const SEARCH_URL = 'https://search.openfoodfacts.org/search'
const USER_AGENT = 'Liebensmittel-App/brand-catalogue-builder'

// ─── Fetch one facet page with a running exclude list ────────────────────────
async function fetchFacet(excludeKeys) {
    const exclude = excludeKeys.length
        ? ` AND NOT brands_tags:(${excludeKeys.map((k) => `"${k}"`).join(' OR ')})`
        : ''
    const q = `countries_tags:"en:germany"${exclude}`

    const resp = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': USER_AGENT,
        },
        body: JSON.stringify({
            q,
            page_size: 1,
            facets: ['brands_tags'],
        }),
    })
    if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${(await resp.text()).slice(0, 200)}`)
    }
    const json = await resp.json()
    const items = json.facets?.brands_tags?.items ?? []
    return items.filter((i) => i.key !== '--other--')
}

// ─── Main loop ──────────────────────────────────────────────────────────────
console.log(`Harvesting DE brands from OFF search (min=${MIN}, max iterations=${MAX_ITERS})`)

const seen = new Map() // key → count
let iter = 0
let belowMinHits = 0

while (iter < MAX_ITERS) {
    iter++
    const excludeKeys = [...seen.keys()]
    let items
    try {
        items = await fetchFacet(excludeKeys)
    } catch (err) {
        console.warn(`  iter ${iter}: ${err.message} — retrying in 3s`)
        await new Promise((r) => setTimeout(r, 3000))
        continue
    }

    if (!items.length) {
        console.log(`  iter ${iter}: no more brands, stopping`)
        break
    }

    const topCount = items[0].count
    let added = 0
    for (const it of items) {
        if (!seen.has(it.key)) {
            seen.set(it.key, it.count)
            added++
        }
    }

    if (iter % 10 === 0 || iter === 1) {
        console.log(`  iter ${iter}: +${added} brands (top=${items[0].key}@${topCount}), total=${seen.size}`)
    }

    if (topCount < MIN) {
        belowMinHits++
        if (belowMinHits >= 2) {
            console.log(`  top count ${topCount} < min ${MIN} — stopping`)
            break
        }
    } else {
        belowMinHits = 0
    }

    if (seen.size >= LIMIT) {
        console.log(`  reached --limit=${LIMIT} — stopping`)
        break
    }
}

console.log(`Collected ${seen.size} brand tags in ${iter} iterations`)

// ─── Normalise ───────────────────────────────────────────────────────────────
/**
 * Turn an OFF brand tag (e.g. "dr-oetker", "gut-gunstig", "k-classic")
 * into a human-readable display name. Overrides live in brands.curated.js.
 */
function humanise(key) {
    return key
        .split('-')
        .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
        .join(' ')
        .replace(/\b(gmbh|ag|kg|co|se)\b/gi, (m) => m.toUpperCase())
}

const kept = [...seen.entries()]
    .filter(([, count]) => count >= MIN)
    .sort((a, b) => b[1] - a[1])
    .slice(0, LIMIT)
    .map(([key, count]) => ({
        id: key,
        name: humanise(key),
        off_tag: key,
        country: 'DE',
        product_count_de: count,
    }))

// ─── Emit module ────────────────────────────────────────────────────────────
const header = `/**
 * AUTO-GENERATED FILE — do not hand-edit.
 *
 * Regenerate with:  node scripts/build-brands-off.js
 *
 * Source: Open Food Facts search-a-licious API, products with
 *   countries_tags:"en:germany". Brand names are humanised from the OFF
 *   slug (e.g. "dr-oetker" → "Dr Oetker"); override via brands.curated.js.
 *
 * Filter: product_count_de >= ${MIN}
 * Entries: ${kept.length}
 * Generated: ${new Date().toISOString()}
 */

export const BRANDS_GENERATED = [
`

const body = kept
    .map((e) => {
        const parts = [
            `id: ${JSON.stringify(e.id)}`,
            `name: ${JSON.stringify(e.name)}`,
            `off_tag: ${JSON.stringify(e.off_tag)}`,
            `product_count_de: ${e.product_count_de}`,
        ]
        return `    { ${parts.join(', ')} },`
    })
    .join('\n')

writeFileSync(OUT_PATH, header + body + '\n]\n')
console.log(`✓ wrote ${kept.length} brands to src/data/brands.generated.js`)
