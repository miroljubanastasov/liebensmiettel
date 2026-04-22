/**
 * Creates a fresh purchase folder structure for a given date.
 *
 * Usage:
 *   node scripts/new-purchase.js            ← uses today's date
 *   node scripts/new-purchase.js 2026-04-15 ← specific date
 *
 * Creates:
 *   purchases/YYYY-MM-DD/
 *     receipt/receipt.json   ← template matching receiptParser output
 *     barcodes/              ← drop barcode images here
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const dateArg = process.argv[2]
const date = dateArg ?? new Date().toISOString().slice(0, 10)

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Error: date must be in YYYY-MM-DD format')
    console.error('Usage: node scripts/new-purchase.js [YYYY-MM-DD]')
    process.exit(1)
}

const purchaseDir = join(ROOT, 'purchases', date)

if (existsSync(purchaseDir)) {
    console.log(`Already exists: purchases/${date}/`)
    process.exit(0)
}

mkdirSync(join(purchaseDir, 'receipt'), { recursive: true })
mkdirSync(join(purchaseDir, 'barcodes'), { recursive: true })

const template = {
    store_name: '',
    store_address: '',
    store_city: '',
    purchase_date: date,
    purchase_time: '',
    total_amount: null,
    items: [],
    raw_text: '',
}

writeFileSync(
    join(purchaseDir, 'receipt', 'receipt.json'),
    JSON.stringify(template, null, 2) + '\n'
)

console.log(`Created: purchases/${date}/`)
console.log(`  receipt/receipt.json   ← fill with parsed receipt data`)
console.log(`  barcodes/              ← drop barcode images here`)
