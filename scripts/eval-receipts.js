/**
 * Dev harness: OCR + parse every receipt in purchases/Reciepts/ and write
 * per-image raw text + parsed JSON for iteration.
 *
 * Not used by the app. Only for tuning OCR + parser offline.
 *
 *   node scripts/eval-receipts.js
 *
 * Preprocessing mirrors the browser canvas pipeline in src/lib/receiptParser.js
 * (grayscale -> contrast stretch -> resize <=1.5 MP / <=1400 px -> JPEG 0.85)
 * using `sharp` so Node-side tuning stays representative of the web app.
 */

import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import Tesseract from 'tesseract.js'

import { parseReceiptText } from '../src/lib/receiptParser.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'purchases', 'Reciepts')
const OUT_DIR = join(SRC_DIR, '_out')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.bmp'])

// ── Preprocessing (mirror of browser canvas pipeline) ───────────────────────

// Larger target width helps Tesseract (it likes ~300 DPI equivalent, which
// for a typical receipt means ≥1800 px wide). We cap by pixel budget to
// keep memory sane on mobile browsers.
const MAX_PIXELS = 3_000_000
const MIN_W = 1800

async function preprocess(inputPath, outputPath) {
    const img = sharp(inputPath).rotate() // honor EXIF orientation
    const meta = await img.metadata()

    // Only upscale (never shrink below source); cap by pixel budget.
    let targetW = Math.max(meta.width, MIN_W)
    let w = targetW
    let h = Math.round((targetW / meta.width) * meta.height)
    if (w * h > MAX_PIXELS) {
        const s = Math.sqrt(MAX_PIXELS / (w * h))
        w = Math.round(w * s)
        h = Math.round(h * s)
    }

    await img
        .resize({ width: w, height: h, fit: 'fill' })
        .greyscale()
        .normalise()
        .sharpen({ sigma: 0.5 })
        .jpeg({ quality: 90 })
        .toFile(outputPath)
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!existsSync(SRC_DIR)) {
    console.error(`Folder not found: ${SRC_DIR}`)
    process.exit(1)
}
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const images = readdirSync(SRC_DIR)
    .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .sort()

if (!images.length) {
    console.error('No images found.')
    process.exit(1)
}

console.log(`Processing ${images.length} receipt(s)...\n`)

const worker = await Tesseract.createWorker('deu+eng', Tesseract.OEM.DEFAULT)
await worker.setParameters({
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
    preserve_interword_spaces: '1',
})

const summary = []

for (const file of images) {
    const stem = basename(file, extname(file))
    const src = join(SRC_DIR, file)
    const pre = join(OUT_DIR, `${stem}.pre.jpg`)
    const rawOut = join(OUT_DIR, `${stem}.raw.txt`)
    const jsonOut = join(OUT_DIR, `${stem}.parsed.json`)

    process.stdout.write(`> ${file} ... `)

    await preprocess(src, pre)
    const { data } = await worker.recognize(pre)
    const parsed = parseReceiptText(data.text)

    writeFileSync(rawOut, data.text)
    writeFileSync(jsonOut, JSON.stringify(parsed, null, 2) + '\n')

    summary.push({
        file,
        store: parsed.store_name,
        date: parsed.purchase_date,
        time: parsed.purchase_time,
        total: parsed.total_amount,
        items: parsed.items.length,
        items_sum: +parsed.items.reduce((s, i) => s + (i.total_price || 0), 0).toFixed(2),
    })

    console.log('done')
}

await worker.terminate()

writeFileSync(
    join(OUT_DIR, '_summary.json'),
    JSON.stringify(summary, null, 2) + '\n'
)

console.log('\n-- Summary --')
for (const r of summary) {
    const match = r.total != null && Math.abs(r.total - r.items_sum) < 0.02 ? 'OK' : 'XX'
    console.log(
        `${match} ${r.file}\n` +
        `    store=${r.store ?? '-'}  date=${r.date ?? '-'}  time=${r.time ?? '-'}\n` +
        `    total=${r.total ?? '-'}  items=${r.items}  items_sum=${r.items_sum}`
    )
}
console.log(`\nOutputs: ${OUT_DIR}`)
