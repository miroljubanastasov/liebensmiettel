/**
 * OCR receipt image(s) in a purchase folder and write receipt.json.
 *
 * Uses Tesseract.js (same language models as the app) directly on image
 * files, then feeds the raw text into the app's parseReceiptText parser.
 *
 * Usage:
 *   node scripts/process-receipt.js            ← today's folder
 *   node scripts/process-receipt.js 2026-04-11 ← specific date
 *
 * Drop receipt image(s) into:
 *   purchases/YYYY-MM-DD/receipt/   (jpg, jpeg, png, webp, tiff, bmp)
 *
 * Writes output to:
 *   purchases/YYYY-MM-DD/receipt/receipt.json
 */

import { readdirSync, writeFileSync, existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import Tesseract from 'tesseract.js'

// Import only the pure text-parsing function — no browser deps.
import { parseReceiptText } from '../src/lib/receiptParser.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Argument handling ────────────────────────────────────────────────────────

const dateArg = process.argv[2]
const date = dateArg ?? new Date().toISOString().slice(0, 10)

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Error: date must be in YYYY-MM-DD format')
    console.error('Usage: node scripts/process-receipt.js [YYYY-MM-DD]')
    process.exit(1)
}

const receiptDir = join(ROOT, 'purchases', date, 'receipt')

if (!existsSync(receiptDir)) {
    console.error(`Folder not found: purchases/${date}/receipt/`)
    console.error(`Create it first: npm run purchase:new ${date}`)
    process.exit(1)
}

// ── Find images ──────────────────────────────────────────────────────────────

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.bmp'])

const images = readdirSync(receiptDir)
    .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .sort() // alphabetical → natural order for multi-part receipts

if (images.length === 0) {
    console.error(`No images found in purchases/${date}/receipt/`)
    console.error(`Supported formats: ${[...IMAGE_EXTS].join(', ')}`)
    process.exit(1)
}

console.log(`\nFound ${images.length} image(s): ${images.join(', ')}`)

// ── OCR ──────────────────────────────────────────────────────────────────────

// Reuse a single persistent worker across all images (avoids re-loading models)
const worker = await Tesseract.createWorker('deu+eng', Tesseract.OEM.DEFAULT)
await worker.setParameters({
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
    preserve_interword_spaces: '1',
})

const rawParts = []

for (const imgFile of images) {
    const imgPath = join(receiptDir, imgFile)
    process.stdout.write(`OCR: ${imgFile} ... `)

    worker.logger = (m) => {
        if (m.status === 'recognizing text') {
            process.stdout.write(`\rOCR: ${imgFile} ... ${Math.round(m.progress * 100)}%  `)
        }
    }

    const { data } = await worker.recognize(imgPath)
    process.stdout.write(`\rOCR: ${imgFile} ... done        \n`)
    rawParts.push(data.text)
}

await worker.terminate()

// ── Parse ────────────────────────────────────────────────────────────────────

// Join pages with a newline — parseReceiptText handles multi-page text fine
const rawText = rawParts.join('\n')
const parsed = parseReceiptText(rawText)

// ── Write ────────────────────────────────────────────────────────────────────

const outPath = join(receiptDir, 'receipt.json')
writeFileSync(outPath, JSON.stringify(parsed, null, 2) + '\n')

console.log('\nResult:')
console.log(`  Store:  ${parsed.store_name ?? '(not detected)'}`)
console.log(`  Date:   ${parsed.purchase_date ?? '(not detected)'}`)
console.log(`  Time:   ${parsed.purchase_time ?? '(not detected)'}`)
console.log(`  Total:  ${parsed.total_amount != null ? parsed.total_amount + ' EUR' : '(not detected)'}`)
console.log(`  Items:  ${parsed.items.length}`)
console.log(`\nWritten: purchases/${date}/receipt/receipt.json`)
