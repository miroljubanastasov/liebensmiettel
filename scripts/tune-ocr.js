/**
 * A/B test preprocessing variants on one receipt and score OCR quality.
 * Throwaway script — used only for iterating on OCR params.
 *
 *   node scripts/tune-ocr.js <image> [variant1 variant2 ...]
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import Tesseract from 'tesseract.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'purchases', 'Reciepts', '_tune')

const input = process.argv[2] || './purchases/Reciepts/Receipt_2026-04-11_210112.jpg'
const stem = basename(input, extname(input))
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const variants = {
    baseline: (img, w, h) => img.resize({ width: w, height: h, fit: 'fill' })
        .greyscale().normalise().sharpen({ sigma: 0.5 }).jpeg({ quality: 90 }),

    // Larger: upscale to 1800 px regardless (Tesseract likes ~300 DPI input)
    large: (img, w, h) => img.resize({ width: Math.max(w, 1800), fit: 'fill' })
        .greyscale().normalise().sharpen({ sigma: 0.5 }).jpeg({ quality: 90 }),

    // Linear contrast + mild blur before sharpen (de-noise)
    blursharp: (img, w, h) => img.resize({ width: w, height: h, fit: 'fill' })
        .greyscale().normalise().blur(0.3).sharpen({ sigma: 1 }).jpeg({ quality: 90 }),

    // Gamma correction (brighten dark prints) + normalise
    gamma: (img, w, h) => img.resize({ width: w, height: h, fit: 'fill' })
        .greyscale().gamma(1.4).normalise().sharpen({ sigma: 0.5 }).jpeg({ quality: 90 }),

    // Upscale 2x the source width for thermal prints (common advice)
    upscale2x: (img, w, h, meta) => img.resize({ width: Math.round(meta.width * 2), fit: 'fill' })
        .greyscale().normalise().sharpen({ sigma: 0.5 }).jpeg({ quality: 92 }),
}

const toRun = process.argv.slice(3).length ? process.argv.slice(3) : Object.keys(variants)

const MAX_PIXELS = 1_500_000
const MAX_W = 1400
const MIN_W = 1200

async function sizing(meta) {
    let targetW = meta.width > MAX_W ? MAX_W : meta.width < MIN_W ? MIN_W : meta.width
    let w = targetW
    let h = Math.round((targetW / meta.width) * meta.height)
    if (w * h > MAX_PIXELS) {
        const s = Math.sqrt(MAX_PIXELS / (w * h))
        w = Math.round(w * s); h = Math.round(h * s)
    }
    return { w, h }
}

// Quality score: ratio of "real words" (letters ≥3) to tokens,
// and count of OCR garbage tokens (mixed letters+digits in unusual ways).
function score(text) {
    const tokens = text.split(/\s+/).filter(Boolean)
    let realWords = 0, garbage = 0, numericTokens = 0
    for (const t of tokens) {
        const letters = t.replace(/[^A-Za-zÄÖÜäöüß]/g, '').length
        const digits = t.replace(/[^0-9]/g, '').length
        const other = t.length - letters - digits
        if (letters >= 3 && digits === 0 && other <= 1) realWords++
        if (digits > 0 && letters > 0 && !/^\d+[.,]\d+$/.test(t)) garbage++
        if (digits > 0 && letters === 0) numericTokens++
    }
    return { tokens: tokens.length, realWords, garbage, numericTokens }
}

for (const name of toRun) {
    if (!variants[name]) { console.warn('unknown variant', name); continue }
    process.stdout.write(`[${name}] preprocess... `)
    const img = sharp(input).rotate()
    const meta = await img.metadata()
    const { w, h } = await sizing(meta)
    const prePath = join(OUT_DIR, `${stem}.${name}.jpg`)
    await variants[name](img, w, h, meta).toFile(prePath)

    process.stdout.write('ocr... ')
    const worker = await Tesseract.createWorker('deu+eng', Tesseract.OEM.DEFAULT)
    await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
        preserve_interword_spaces: '1',
    })
    const { data } = await worker.recognize(prePath)
    await worker.terminate()

    writeFileSync(join(OUT_DIR, `${stem}.${name}.txt`), data.text)
    const s = score(data.text)
    console.log(`tokens=${s.tokens} realWords=${s.realWords} garbage=${s.garbage}`)
}

console.log(`\nOutputs: ${OUT_DIR}`)
