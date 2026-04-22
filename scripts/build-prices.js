/**
 * Match barcode products with receipt line items to build a product price table.
 *
 * Reads:
 *   purchases/YYYY-MM-DD/barcodes/products.json  (EAN + OFF product data)
 *   purchases/YYYY-MM-DD/receipt/receipt.json     (parsed receipt items)
 *
 * Uses the app's fuzzy matcher (src/utils/receiptMatch.js) to link
 * scanned products with receipt line items.
 *
 * Writes:
 *   purchases/YYYY-MM-DD/prices.json
 *
 * Schema follows Supabase `price_observations` table:
 *   ean, product_name, brand, quantity_text, store_name, store_city,
 *   price, unit_price, receipt_name, match_score, observed_at
 *
 * Usage:
 *   node scripts/build-prices.js            ← today's folder
 *   node scripts/build-prices.js 2026-04-11 ← specific date
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { matchScore } from '../src/utils/receiptMatch.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Argument handling ────────────────────────────────────────────────────────

const dateArg = process.argv[2]
const date = dateArg ?? new Date().toISOString().slice(0, 10)

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Error: date must be in YYYY-MM-DD format')
    console.error('Usage: node scripts/build-prices.js [YYYY-MM-DD]')
    process.exit(1)
}

const purchaseDir = join(ROOT, 'purchases', date)
const productsPath = join(purchaseDir, 'barcodes', 'products.json')
const receiptPath = join(purchaseDir, 'receipt', 'receipt.json')

if (!existsSync(productsPath)) {
    console.error(`Not found: purchases/${date}/barcodes/products.json`)
    console.error('Run: npm run purchase:barcodes ' + date)
    process.exit(1)
}
if (!existsSync(receiptPath)) {
    console.error(`Not found: purchases/${date}/receipt/receipt.json`)
    console.error('Run: npm run purchase:scan ' + date)
    process.exit(1)
}

// ── Load data ────────────────────────────────────────────────────────────────

const productsData = JSON.parse(readFileSync(productsPath, 'utf8'))
const receiptData = JSON.parse(readFileSync(receiptPath, 'utf8'))

const products = productsData.products.filter((p) => p.ean)
const receiptItems = receiptData.items

console.log(`\nProducts: ${products.length} (with EAN)`)
console.log(`Receipt items: ${receiptItems.length}`)

// ── Match products to receipt items ──────────────────────────────────────────

const MATCH_THRESHOLD = 0.3
const prices = []
const unmatched = []
const usedReceiptIndices = new Set()

for (const product of products) {
    // Score against all receipt items
    const scored = receiptItems
        .map((item, idx) => ({ item, idx, score: matchScore(product, item) }))
        .filter(({ score }) => score >= MATCH_THRESHOLD)
        .sort((a, b) => b.score - a.score)

    // Pick the best unused match
    const best = scored.find(({ idx }) => !usedReceiptIndices.has(idx))

    if (best) {
        usedReceiptIndices.add(best.idx)
        const item = best.item

        // Per-item price (handles multi-buy: "5,79 x 2 = 11.58")
        const itemPrice = item.unit_price || item.total_price

        // Calculate unit price per 100g/100ml if quantity_text is available
        let unitPricePer100 = null
        if (product.quantity) {
            const qtyMatch = product.quantity.match(/([\d.,]+)\s*(g|ml|kg|l)\b/i)
            if (qtyMatch) {
                const amount = parseFloat(qtyMatch[1].replace(',', '.'))
                const unit = qtyMatch[2].toLowerCase()
                const amountInBase = (unit === 'kg' || unit === 'l') ? amount * 1000 : amount
                if (amountInBase > 0) {
                    unitPricePer100 = Math.round((itemPrice / amountInBase) * 100 * 100) / 100
                }
            }
        }

        prices.push({
            ean: product.ean,
            product_name: product.name || item.name,
            brand: product.brand || null,
            quantity_text: product.quantity || null,
            store_name: receiptData.store_name,
            store_city: receiptData.store_city,
            price: itemPrice,
            unit_price: unitPricePer100,
            receipt_name: item.name,
            match_score: Math.round(best.score * 100) / 100,
            observed_at: receiptData.purchase_date,
        })
    } else {
        unmatched.push({
            ean: product.ean,
            product_name: product.name,
            brand: product.brand || null,
            reason: product.name ? 'no_receipt_match' : 'no_off_data',
        })
    }
}

// ── Also list receipt items that had no barcode match ────────────────────────

const unmatchedReceipt = receiptItems
    .filter((_, idx) => !usedReceiptIndices.has(idx))
    .map((item) => ({
        receipt_name: item.name,
        price: item.total_price,
        quantity: item.quantity,
        unit: item.unit,
    }))

// ── Write output ─────────────────────────────────────────────────────────────

const output = {
    purchase_date: date,
    store_name: receiptData.store_name,
    store_city: receiptData.store_city,
    generated_at: new Date().toISOString(),
    prices,
    unmatched_products: unmatched,
    unmatched_receipt_items: unmatchedReceipt,
}

const outPath = join(purchaseDir, 'prices.json')
writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n')

// ── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(70)}`)
console.log('  EAN            Product                     Price   Per 100   Match')
console.log('─'.repeat(70))

for (const p of prices) {
    const ean = p.ean.padEnd(14)
    const name = (p.product_name || '?').slice(0, 25).padEnd(25)
    const price = (p.price.toFixed(2) + '€').padStart(7)
    const up = p.unit_price != null ? (p.unit_price.toFixed(2) + '€').padStart(7) : '    -- '
    const score = (p.match_score * 100).toFixed(0).padStart(3) + '%'
    console.log(`  ${ean} ${name} ${price} ${up}   ${score}`)
}

if (unmatched.length > 0) {
    console.log(`\nUnmatched products (${unmatched.length}):`)
    for (const u of unmatched) {
        console.log(`  ${u.ean.padEnd(14)} ${u.product_name ?? '(no OFF data)'} — ${u.reason}`)
    }
}

if (unmatchedReceipt.length > 0) {
    console.log(`\nReceipt items without barcode (${unmatchedReceipt.length}):`)
    for (const r of unmatchedReceipt) {
        console.log(`  ${r.receipt_name.padEnd(30)} ${r.price.toFixed(2)}€`)
    }
}

console.log(`\n${'─'.repeat(70)}`)
console.log(`Matched:      ${prices.length}`)
console.log(`No match:     ${unmatched.length} products, ${unmatchedReceipt.length} receipt items`)
console.log(`\nWritten: purchases/${date}/prices.json`)
