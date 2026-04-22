/**
 * Decode barcode images, look up products on Open Food Facts, write products.json.
 *
 * Uses zbar.wasm (ZBar C library compiled to WebAssembly) + sharp for image
 * loading, then fetches product data from OFF using the same field mapping
 * as src/lib/openFoodFacts.js.
 *
 * Note: The in-app scanner still uses @zxing/library for live video.
 * ZBar is only used here for offline batch processing of barcode photos.
 *
 * Usage:
 *   node scripts/process-barcodes.js            ← today's folder
 *   node scripts/process-barcodes.js 2026-04-11 ← specific date
 *
 * Drop barcode images into:
 *   purchases/YYYY-MM-DD/barcodes/   (jpg, jpeg, png, webp, tiff, bmp)
 *
 * Writes output to:
 *   purchases/YYYY-MM-DD/barcodes/products.json
 */

import { readdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import sharp from 'sharp'

// zbar.wasm's emscripten loader uses fetch() for the .wasm file which fails
// in Node.js ESM. Patch globalThis.fetch to intercept the local wasm request
// and serve it from disk before importing the library.
const require_ = createRequire(import.meta.url)
const zbarWasmPath = join(dirname(require_.resolve('zbar.wasm')), 'zbar.wasm')
const originalFetch = globalThis.fetch
globalThis.fetch = function patchedFetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url ?? ''
    if (url.endsWith('zbar.wasm') || url.endsWith('zbar.wasm.bin')) {
        const wasmBuffer = readFileSync(zbarWasmPath)
        return Promise.resolve(new Response(wasmBuffer, {
            status: 200,
            headers: { 'Content-Type': 'application/wasm' },
        }))
    }
    return originalFetch.call(globalThis, input, init)
}

const { scanGrayBuffer } = await import('zbar.wasm')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Argument handling ────────────────────────────────────────────────────────

const dateArg = process.argv[2]
const date = dateArg ?? new Date().toISOString().slice(0, 10)

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Error: date must be in YYYY-MM-DD format')
    console.error('Usage: node scripts/process-barcodes.js [YYYY-MM-DD]')
    process.exit(1)
}

const barcodesDir = join(ROOT, 'purchases', date, 'barcodes')

if (!existsSync(barcodesDir)) {
    console.error(`Folder not found: purchases/${date}/barcodes/`)
    console.error(`Create it first: npm run purchase:new ${date}`)
    process.exit(1)
}

// ── Find images ──────────────────────────────────────────────────────────────

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.bmp'])

const images = readdirSync(barcodesDir)
    .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()) && !f.startsWith('.'))
    .sort()

if (images.length === 0) {
    console.error(`No images found in purchases/${date}/barcodes/`)
    console.error(`Supported formats: ${[...IMAGE_EXTS].join(', ')}`)
    process.exit(1)
}

console.log(`\nFound ${images.length} barcode image(s): ${images.join(', ')}`)

// ── Barcode decoding (ZBar via WASM) ─────────────────────────────────────────

/**
 * Decode barcodes from an image file using ZBar.
 * Returns the first EAN/UPC code found, or null.
 */
async function decodeBarcode(imagePath) {
    const { data, info } = await sharp(imagePath)
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true })

    // scanGrayBuffer accepts a raw grayscale buffer directly — no RGBA conversion needed
    const results = await scanGrayBuffer(data.buffer, info.width, info.height)

    // Filter for EAN/UPC barcodes — ignore QR codes and other types
    const eanResult = results.find((r) => {
        const t = r.typeName
        return t === 'ZBAR_EAN13' || t === 'ZBAR_EAN8' ||
            t === 'ZBAR_UPCA' || t === 'ZBAR_UPCE'
    })

    return eanResult ? eanResult.decode() : null
}

// ── Open Food Facts lookup ───────────────────────────────────────────────────

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/product'

/**
 * Fetch product info from OFF. Returns an object matching the Supabase
 * `products` table schema, or null if not found.
 * Same field mapping as src/lib/openFoodFacts.js → lookupEAN().
 */
async function lookupEAN(ean) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
        const res = await fetch(`${OFF_BASE}/${encodeURIComponent(ean)}.json`, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Liebensmittel-App/1.0 (barcode-scanner-script)' },
        })
        clearTimeout(timeout)
        if (!res.ok) return null

        const data = await res.json()
        if (data.status !== 1) return null

        const p = data.product
        const n = p.nutriments ?? {}

        return {
            ean,
            // ── Identity
            name: p.product_name || p.product_name_en || p.product_name_de || null,
            brand: p.brands || null,
            quantity: p.quantity || null,
            serving_size: p.serving_size || null,
            origin: p.origins || null,

            // ── Images
            image_url: p.image_front_url || null,
            image_ingredients_url: p.image_ingredients_url || null,
            image_nutrition_url: p.image_nutrition_url || null,

            // ── Classification
            categories: p.categories_tags || [],
            labels: p.labels_tags || [],
            allergens: p.allergens_tags || [],

            // ── Scores
            nutriscore: p.nutriscore_grade || null,
            ecoscore: p.ecoscore_grade || null,
            nova_group: p.nova_group || null,

            // ── Nutrients per 100 g
            energy_kcal: n['energy-kcal_100g'] ?? null,
            fat_g: n.fat_100g ?? null,
            saturated_fat_g: n['saturated-fat_100g'] ?? null,
            carbs_g: n.carbohydrates_100g ?? null,
            sugars_g: n.sugars_100g ?? null,
            fiber_g: n.fiber_100g ?? null,
            protein_g: n.proteins_100g ?? null,
            salt_g: n.salt_100g ?? null,

            // ── Ingredients
            ingredients: p.ingredients_text || null,

            // ── Completeness
            off_complete: !!(p.product_name && p.nutriscore_grade && p.nutriments),
        }
    } catch (err) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
            console.warn(`  ⚠ OFF request timed out for ${ean}`)
        } else {
            console.warn(`  ⚠ OFF request failed for ${ean}: ${err.message}`)
        }
        return null
    }
}

// ── Process all images ───────────────────────────────────────────────────────

const products = []
const failed = []

for (const imgFile of images) {
    const imgPath = join(barcodesDir, imgFile)
    process.stdout.write(`\n${imgFile}: decoding... `)

    const ean = await decodeBarcode(imgPath)

    if (!ean) {
        console.log('FAILED (no barcode detected)')
        failed.push({ file: imgFile, error: 'decode_failed' })
        continue
    }

    process.stdout.write(`EAN ${ean} → OFF lookup... `)

    const product = await lookupEAN(ean)

    if (product) {
        console.log(`${product.name ?? '(unnamed)'} [${product.brand ?? '?'}]`)
        products.push({ file: imgFile, ...product })
    } else {
        console.log('not found on OFF')
        products.push({ file: imgFile, ean, name: null, off_complete: false })
    }
}

// ── Write output ─────────────────────────────────────────────────────────────

const output = {
    purchase_date: date,
    scanned_at: new Date().toISOString(),
    products,
    failed,
}

const outPath = join(barcodesDir, 'products.json')
writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n')

console.log(`\n${'─'.repeat(50)}`)
console.log(`Products found:   ${products.filter((p) => p.name).length}`)
console.log(`EAN only (no OFF): ${products.filter((p) => !p.name && p.ean).length}`)
console.log(`Decode failed:     ${failed.length}`)
console.log(`\nWritten: purchases/${date}/barcodes/products.json`)
