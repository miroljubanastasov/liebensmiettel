/**
 * Receipt OCR + parsing via Tesseract.js
 *
 * Pipeline:
 *  1. Preprocess image (grayscale, contrast, binarize)
 *  2. Run OCR on the receipt image → raw text
 *  3. Parse store header (name, address, city)
 *  4. Extract date / time
 *  5. Extract line items (product name, quantity, price)
 *  6. Extract total amount
 */
import Tesseract from 'tesseract.js'

// ── Image preprocessing ─────────────────────────────────────────────────────

/**
 * Preprocess receipt image for better OCR accuracy.
 * - Scales up small images
 * - Converts to grayscale
 * - Boosts contrast
 * - Binarizes (black/white threshold)
 */
function preprocessImage(image) {
    if (!(image instanceof Blob)) return Promise.resolve(image)

    return new Promise((resolve) => {
        const img = new Image()
        const url = URL.createObjectURL(image)

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas')
                // Mobile memory vs OCR quality trade-off. Tesseract reads
                // thermal-printed receipts much better at ≥1800 px wide;
                // below that, kerned characters (M/H, O/Q, rn/m) fuse.
                // 2.5 MP keeps RGBA buffer ≈ 10 MB — safe on mid-range
                // Android Chrome while the camera app is recently foregrounded.
                const MAX_PIXELS = 2_500_000
                const MIN_W = 1800
                const MAX_W = 2200
                const targetW = img.width < MIN_W ? MIN_W
                    : img.width > MAX_W ? MAX_W
                        : img.width
                const rawScale = targetW / img.width
                let w = Math.round(img.width * rawScale)
                let h = Math.round(img.height * rawScale)

                const pxScale = (w * h > MAX_PIXELS) ? Math.sqrt(MAX_PIXELS / (w * h)) : 1
                w = Math.round(w * pxScale)
                h = Math.round(h * pxScale)
                canvas.width = w
                canvas.height = h

                const ctx = canvas.getContext('2d', { willReadFrequently: false })
                ctx.drawImage(img, 0, 0, w, h)

                const imageData = ctx.getImageData(0, 0, w, h)
                const d = imageData.data
                const len = d.length

                // Grayscale + mild contrast stretch (single pass, minimal allocs)
                let minG = 255, maxG = 0
                for (let i = 0; i < len; i += 4) {
                    const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
                    d[i] = d[i + 1] = d[i + 2] = gray
                    if (gray < minG) minG = gray
                    if (gray > maxG) maxG = gray
                }
                const range = maxG - minG || 1
                for (let i = 0; i < len; i += 4) {
                    const stretched = Math.round(((d[i] - minG) / range) * 255)
                    d[i] = d[i + 1] = d[i + 2] = stretched
                }

                ctx.putImageData(imageData, 0, 0)
                // JPEG is ~5× smaller than PNG → less memory passed to worker.
                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(url)
                    // Hint canvas can be GC'd
                    canvas.width = 0
                    canvas.height = 0
                    resolve(blob || image)
                }, 'image/jpeg', 0.85)
            } catch {
                URL.revokeObjectURL(url)
                resolve(image)
            }
        }
        img.onerror = () => { URL.revokeObjectURL(url); resolve(image) }
        img.src = url
    })
}

// ── OCR ──────────────────────────────────────────────────────────────────────

// Lazily-initialised persistent worker — avoids downloading the model per receipt.
let _worker = null
let _workerReady = null

async function getWorker() {
    if (_workerReady) return _workerReady

    _workerReady = (async () => {
        const worker = await Tesseract.createWorker('deu+eng', Tesseract.OEM.DEFAULT)
        await worker.setParameters({
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
            preserve_interword_spaces: '1',
        })
        _worker = worker
        return worker
    })()

    return _workerReady
}

/**
 * Pre-load the OCR worker. Call this when an OCR flow is about to start
 * (e.g. user opens the receipt dialog) so the model download/parse doesn't
 * compete with the memory spike from processing a just-captured photo.
 */
export function prewarmOcr() {
    getWorker().catch(() => { /* ignore; will retry on real use */ })
}

/**
 * Run Tesseract OCR on an image (File, Blob, or URL).
 * Preprocesses the image first for better accuracy.
 * Reuses a persistent worker across calls.
 */
export async function ocrImage(image, onProgress) {
    const processed = await preprocessImage(image)
    const worker = await getWorker()

    // Attach logger for this run if needed
    if (onProgress) {
        worker.logger = (m) => {
            if (m.status === 'recognizing text') onProgress(m.progress)
        }
    }

    const { data } = await worker.recognize(processed)

    // Detach logger after run
    worker.logger = undefined

    return data.text
}

// ── Parsing helpers ──────────────────────────────────────────────────────────

/**
 * Known German supermarket/discounter chains.
 * Used to identify the store from the receipt header.
 */
const KNOWN_STORES = [
    'REWE', 'EDEKA', 'ALDI', 'LIDL', 'PENNY', 'NETTO', 'KAUFLAND',
    'NORMA', 'REAL', 'ROSSMANN', 'DM', 'MÜLLER', 'TEGUT', 'GLOBUS',
    'FAMILA', 'COMBI', 'HIT', 'SPAR', 'COOP', 'MIGROS', 'DENNER',
    'HOFER', 'BILLA', 'MERKUR', 'INTERSPAR', 'METRO',
]

// OCR-mangled variants of store identifiers that can appear anywhere
// in the body (e.g. serial numbers, app footers). Matched with word-ish
// boundaries to avoid picking up "Netto" from a tax table.
const STORE_SIGNATURES = [
    // LIDL: brand spellings, OCR variants, LDL serial prefix, and the
    // characteristic "3509 NNNNNN/NN" store/Bon serial at the footer.
    { name: 'LIDL', re: /\b(?:LIDL|LDL|Lidl|Lid[l\]])\b|\bL\$DE\b|\bLDL-\d|\b3509\s+\d{5,6}\/\d{2}\b|\bDE814429027\b/i },
    { name: 'REWE', re: /\bREWE\b/i },
    { name: 'EDEKA', re: /\bEDEKA\b/i },
    { name: 'ALDI', re: /\bALDI\b/i },
    { name: 'PENNY', re: /\bPENNY\b/i },
    { name: 'KAUFLAND', re: /\bKAUFLAND\b/i },
    { name: 'ROSSMANN', re: /\bRoss[mn]ann\b|Dirk\s+Ross[mn]ann|\bDrogeriemarkt\b/i },
    { name: 'DM', re: /\bdm-drogerie\b|\bdm\s+Markt\b/i },
]

/**
 * Try to find the store name from the first few lines of the receipt.
 * Strategy:
 *  1. Match known chains in the header only (avoids "NETTO" in tax table).
 *  2. Match OCR-tolerant signatures anywhere in the receipt.
 *  3. Fall back to the first plausible header line.
 */
function parseStoreName(lines) {
    const header = lines.slice(0, 10).join(' ')
    const headerUpper = header.toUpperCase()
    const fullText = lines.join(' ')

    // 1. OCR-tolerant signatures first — these distinguish stores even when
    //    the chain name word clashes with a tax column (e.g. Rossmann's
    //    "Netto" column would otherwise match the NETTO chain).
    for (const sig of STORE_SIGNATURES) {
        if (sig.re.test(fullText)) return sig.name
    }

    // 2. Header-restricted exact match against known chains, with word
    //    boundaries so \"Netto\" (tax) doesn't collide with NETTO (chain).
    for (const store of KNOWN_STORES) {
        const re = new RegExp(`\\b${store}\\b`)
        if (re.test(headerUpper)) return store
    }

    // 3. Fallback: first plausible header line
    for (const line of lines.slice(0, 5)) {
        const trimmed = line.trim()
        if (trimmed.length < 3) continue
        if (/^\d/.test(trimmed)) continue
        // Reject symbol/dash-only lines (incl. em-dash, en-dash, box drawing)
        if (/^[\s\-–—=*_.:|·•]+$/.test(trimmed)) continue
        return trimmed
    }
    return null
}

/**
 * Try to extract a store address from the header lines.
 * Returns { street, city } separately.
 */
function parseStoreAddress(lines) {
    const headerLines = lines.slice(0, 10)
    // Street: word(s) ending in common German street suffixes + optional house number
    const streetPattern = /([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß .-]*(?:str(?:\.|aße|asse)|weg|platz|gasse|allee|ring|damm|straße)\s*\d*\w?)/i
    // PLZ + city: 5 digits (NOT part of a longer number / EAN) + 1-2 German
    // city-name-looking words. Reject lines that are clearly item lines.
    const plzPattern = /(?<!\d)(\d{5})\s+([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß.-]{2,}(?:\s+[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß.-]+)?)(?!\d)/
    // Tokens that indicate this is an item line, not an address
    const itemLineRe = /\b(?:GP|ART|PLU|POS|EAN)\b/i

    let street = null
    let city = null

    for (const line of headerLines) {
        if (itemLineRe.test(line)) continue
        // Reject lines that contain a 12+ digit run — that's a barcode, not an address.
        if (/\d{12,}/.test(line)) continue
        if (!street) {
            const sm = line.match(streetPattern)
            if (sm) street = sm[1].replace(/\s{2,}.*$/, '').trim()
        }
        if (!city) {
            const cm = line.match(plzPattern)
            if (cm) city = `${cm[1]} ${cm[2]}`.replace(/\s{2,}.*$/, '').trim()
        }
    }

    const address = [street, city].filter(Boolean).join(', ') || null
    return { address, street, city }
}

/**
 * Extract purchase date and time.
 * Common formats on German receipts:
 *   08.04.2026  14:32          (space separated)
 *   08.04.2026 14:32:01        (with seconds)
 *   08/04/2026                 (slash separated)
 *   Datum: 08.04.2026          (labeled)
 *   Uhrzeit: 14:32             (labeled)
 *   14.32 Uhr                  (dot as time separator)
 *   08.04.2026/14:32           (slash joined)
 *
 * OCR recovery:
 *   - Date may be split across lines after "Datum:" label
 *   - Year "2026" may be mangled to "°026" (OCR reads "2" as "°")
 *   - Minutes may be invalid (e.g. "11:89:47") — fall back to seconds
 */
function parseDateTime(text) {
    let date = null
    let time = null

    // ── Date ────────────────────────────────────────────────────────────

    // (1) Scan for DD.MM.YYYY or DD/MM/YYYY anywhere in text
    const dateRe = /(\d{2})[./](\d{2})[./](\d{4})/g
    let dm
    while ((dm = dateRe.exec(text)) !== null) {
        const day = parseInt(dm[1], 10)
        const month = parseInt(dm[2], 10)
        const year = parseInt(dm[3], 10)
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2000 && year <= 2100) {
            date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            break
        }
    }

    // (1b) ISO format YYYY-MM-DD (common in TSE/terminal timestamps)
    if (!date) {
        const isoRe = /(\d{4})-(\d{2})-(\d{2})/g
        let im
        while ((im = isoRe.exec(text)) !== null) {
            const year = parseInt(im[1], 10)
            const month = parseInt(im[2], 10)
            const day = parseInt(im[3], 10)
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2000 && year <= 2100) {
                date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                break
            }
        }
    }

    // (1c) DD.MM.YY with 2-digit year (e.g. "11.04.26")
    if (!date) {
        const shortYearRe = /(\d{2})[./](\d{2})[./](\d{2})(?!\d)/g
        let sm
        while ((sm = shortYearRe.exec(text)) !== null) {
            const day = parseInt(sm[1], 10)
            const month = parseInt(sm[2], 10)
            const year = 2000 + parseInt(sm[3], 10)
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020 && year <= 2050) {
                date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                break
            }
        }
    }

    // (2) Datum label + DD.MM.YYYY across newlines (OCR splits date across lines)
    if (!date) {
        const datumRe = /Datum[:\s]*[\s\S]{0,150}?(\d{1,2})[.\s]+(\d{1,2})[.\s]+(\d{4})/i
        const dm2 = text.match(datumRe)
        if (dm2) {
            const day = parseInt(dm2[1], 10)
            const month = parseInt(dm2[2], 10)
            const year = parseInt(dm2[3], 10)
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2000 && year <= 2100) {
                date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            }
        }
    }

    // (3) OCR recovery: find DD. near Datum + year from "°0XX" pattern
    // OCR commonly mangles "2" → "°", so "2026" appears as "°026"
    if (!date) {
        const footerIdx = text.search(/Datum|Uhrzeit/i)
        if (footerIdx >= 0) {
            const footer = text.slice(footerIdx, footerIdx + 500)

            // Try to recover year from "°0XX" → 20XX
            const mangledYearRe = /[°][0O](\d{2})/
            const ym = footer.match(mangledYearRe)
            const recoveredYear = ym ? 2000 + parseInt(ym[1], 10) : null

            if (recoveredYear && recoveredYear >= 2020 && recoveredYear <= 2050) {
                // Find a plausible DD. in the Datum area (before Uhrzeit)
                const datumEnd = footer.search(/Uhrzeit/i)
                const datumChunk = datumEnd > 0 ? footer.slice(0, datumEnd) : footer.slice(0, 200)
                const dayRe = /\b(\d{2})\./
                const dm3 = datumChunk.match(dayRe)
                if (dm3) {
                    const day = parseInt(dm3[1], 10)
                    if (day >= 1 && day <= 31) {
                        // Month is mangled — use current month (receipt likely recent)
                        const month = new Date().getMonth() + 1
                        date = `${recoveredYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    }
                }
            }
        }
    }

    // ── Time ────────────────────────────────────────────────────────────

    // (1) Look near "Uhrzeit" label first
    const uhrzeitRe = /Uhrzeit[:\s]*(\d{1,2})[:.]([\d]{2})(?:[:.]([\d]{2}))?/i
    const um = text.match(uhrzeitRe)
    if (um) {
        const h = parseInt(um[1], 10)
        const m = parseInt(um[2], 10)
        const s = um[3] ? parseInt(um[3], 10) : null
        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        } else if (h >= 0 && h <= 23 && s !== null && s >= 0 && s <= 59) {
            // OCR corrupted minutes (e.g. 89) but seconds are valid (e.g. 47)
            // Use HH:SS as best-effort time
            time = `${String(h).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        }
    }

    // (2) Fallback: general HH:MM scan — skip prices and invalid values
    if (!time) {
        const timeRe = /(?:^|[^0-9,.])(\d{1,2}):(\d{2})(?::(\d{2}))?(?=[^0-9]|$)/gm
        let tm
        while ((tm = timeRe.exec(text)) !== null) {
            const h = parseInt(tm[1], 10)
            const m = parseInt(tm[2], 10)
            const s = tm[3] ? parseInt(tm[3], 10) : 0
            if (h >= 5 && h <= 23 && m >= 0 && m <= 59 && s >= 0 && s <= 59) {
                time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
                break
            }
        }
    }

    return { date, time }
}

/**
 * Parse line items from the receipt body.
 *
 * Key design: does NOT anchor to end of line ($). Instead, finds a price
 * (digits + comma/dot + 2 decimals) followed by a tax marker, then
 * IGNORES any trailing OCR noise from adjacent columns/barcodes.
 *
 * Also merges weight sub-lines like "1,960 kg x 2,79 EUR/kg" into
 * the preceding item.
 *
 * Returns array of { line_text, name, quantity, unit_price, total_price }
 */
function parseLineItems(lines) {
    const items = []

    // Find price + tax marker anywhere on the line (not anchored to $).
    // Price pattern: normal "5,47", missing comma "547", or extra decimal "2,712"
    const P = '\\d+[.,]\\d{2,3}|\\d{3,}'
    // Single-decimal price (e.g. OCR dropped a digit: "2,9" instead of "2,99").
    // Only accepted when immediately followed by a tax marker.
    const P1 = '\\d+[.,]\\d'
    const M = '[A-Ba-b*0-9]'  // Tax marker: A, B, or digit (LIDL uses 4 etc.)
    const priceRe = new RegExp(`^(.+?)\\s+(${P})\\s+(${M})(?:\\s|$)`)
    const priceLooseRe = new RegExp(`^(.+?)\\s+(${P})\\s+(${M})\\s`)
    const price1DecRe = new RegExp(`^(.+?)\\s+(${P1})\\s+(${M})(?:\\s|$)`)

    // Two prices: "name  unit_price  total_price  marker"
    const twoPriceRe = new RegExp(`^(.+?)\\s+(${P})\\s+(${P})\\s+(${M})(?:\\s|$)`)

    // Compact: price (2 decimals) immediately followed by single marker digit, no space
    // Common on LIDL receipts: "3,794" → price "3,79" + marker "4"
    // Tolerate trailing OCR noise (dash, dot, pipe) after the marker.
    const compactPriceRe = /^(.+?)\s+(\d+[.,]\d{2})([0-9])\s*[-.\s|]*$/

    // Inline qty with NO tax marker (receipts sometimes omit it on mixed-VAT lines):
    // "Taschentuecherbox 0,95x 2 1,98"
    const inlineQtyNoMarkerRe = new RegExp(
        `^(.+?)\\s+(\\d+[.,]\\d{2,3})\\s*[xX×*%]+\\s*(\\d+)\\s+(\\d+[.,]\\d{2})\\s*$`
    )

    // Inline quantity on same line: "name  unit_price x qty  total_price  marker"
    // E.g. "Lachsfilet 5,79x 2 11.58 A" or "Brot Fladen 0.89x 2 1,784"
    const inlineQtyRe = new RegExp(
        `^(.+?)\\s+(${P})\\s*[xX×*%]+\\s*(\\d+)\\s+(${P})\\s+(${M})(?:\\s|$)`
    )
    const inlineQtyCompactRe = /^(.+?)\s+(\d+[.,]\d{2,3})\s*[xX×*%]+\s*(\d+)\s+(\d+[.,]\d{2})([0-9])\s*$/

    // Inline qty with no-separator total+marker fused together (OCR drops comma):
    // "Lachefilet nit Haut 5,79x 2 11584" → unit 5,79, qty 2, total 115.84 or 11.58
    // We split the trailing run as (total)(marker) where total = qty * unit_price.
    const inlineQtyNoSepRe = /^(.+?)\s+(\d+[.,]\d{2,3})\s*[xX×*%]+\s*(\d+)\s+(\d{4,})\s*$/

    // Weight sub-line: "1,960 kg x 2,79 EUR/kg" or "Handeingabe E-Bon 0,537 kg"
    // Allow optional spaces in OCR'd numbers like "0, 196"
    const weightSubRe = /^(\d+[.,]\s?\d+)\s*kg\s*[x×*]\s*(\d+[.,]\s?\d+)\s*EUR\/kg/i
    const handSubRe = /Handeingabe|E-Bon/i

    // Quantity sub-line: "2 Stk x 1,29" or "3 x 0,99" on its own line
    const qtySubRe = /^\s*(\d+)\s*(?:ST[Kk]?|Stück)?\s*[xX×*@]\s*(\d+[.,]\d{2})\s*$/i

    // Quantity patterns
    const qtyPrefixRe = /^(\d+)\s*[xX*×]\s*/
    const qtyStRe = /(\d+)\s*(?:ST|Stk?|stk?)\s*[xX*×@]\s*(\d+[.,]\d{2})/i

    // Skip lines matching these patterns (payment, tax, totals, terminal info,
    // and discount lines that should not be treated as items). Anchored at ^
    // so the line must START with the keyword.
    const skipRe = /^(SUMME|TOTAL|GESAMT|GESAMTBETRAG|GESA[MN]TBETRAG|ZU ZAHLEN|2U ZAHLEN|BETRAG|BAR|KARTE|KARTENZAHLUNG|EC[- ]?CASH|VISA|MASTER|GEGEBEN|ZURÜCK|RÜCKGELD|MWST|UST|STEUER|ZWISCHENSUMME|WECHSELGELD|BON|BELEG|TRACE|TERMINAL|KUNDEN|TRANSAKTION|GIROCARD|CONTACTLESS|UID|SE\s|GEG\.|NETTO|BRUTTO|PREISVORTEIL|RABATT|PFAND)\b/i

    // Contains-anywhere skip: catches OCR'd totals/tax tables that don't start
    // with the keyword, e.g. "Gesanter Preisvorteil 1,50" or
    // "B= 7,0% 12,58 0,88 13,46".
    const skipContainsRe = /\b(Preisvorteil|Gesa[mn]tbetrag|Gesa[mn]ter|Zwischensumme|MwSt|UID\s*Nr|UST[-\s]?ID|TSE[-\s]|Seriennr|Steuerreferenz|Signatur|Bon-?Nr|Trace-?Nr|Terminal-?ID|Beleg-?Nr|Kasse:?|Kundenbeleg|Kreditkarte|EC[-\s]?Cash|Mastercard|Girocard|Kartenzahlung|Barzahlung|R[üi]{1,2}ckgeld|Wechselgeld|Swe\s+ER|Se\s+EUR|Summe\s+EUR)\b/i

    // Tax-table rows have pattern: label + 3 prices (Netto Steuer Brutto).
    // Match any line with 3+ 2-decimal prices as a tax table to reject.
    const taxRowRe = /^[A-Za-z=\s%,0-9]+?\s\d+[.,]\d{2}\s+\d+[.,]\d{2}\s+\d+[.,]\d{2}\s*$/

    // VAT-group rows: start with a single letter (A/B) followed by digits or %,
    // which is the column header for Rossmann / REWE tax summaries. Even when
    // OCR mangles them to 1–2 prices, they're still not product lines.
    // Examples: "A 8:  3,78  an  4,50", "B 7%  12,58  0,88  13,46".
    const vatRowRe = /^[A-Z](?:\s*\d|\s*=|\s+[\d:]){0,3}\s+\d/

    // Lines containing EUR amounts that are totals/payments (not product lines)
    const eurTotalRe = /\bEUR\s+\d+[.,]\d{2}/i

    // EAN-13 (or 12-14 digit) barcode prefix — Rossmann and other drug stores
    // print the product barcode at the start of each item line. It must be
    // stripped from the NAME but captured separately so it can be recorded.
    // Tolerant to leading OCR noise: quotes, punctuation, spaces.
    const eanPrefixRe = /^[\s"'`«»*·•\-–—_.:|]*(\d{12,14})\s+/
    // Fallback: EAN anywhere early in the line (first 4 chars) even without
    // a following space — catches OCR that fuses EAN with next token.
    const eanAnywhereRe = /(?<!\d)(\d{13})(?!\d)/
    // Common article-group codes printed after the EAN (short uppercase token).
    const articleCodeRe = /^[\s"'`«»*·•\-–—_.:|]*(?:GP|G\.P|ART|ART\.?|PLU|POS)\s+/i

    // State: the EAN observed on the current line (attached to the item
    // pushed from this line).
    let currentEan = null

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i].trim()
        if (!rawLine || rawLine.length < 4) continue
        if (/^[-=*_.:\s|]+$/.test(rawLine)) continue

        // Reject tax-table rows early (3+ prices on the line).
        if (taxRowRe.test(rawLine)) continue
        // Reject VAT-group rows (A 8:, B 7%, etc.) even with OCR damage.
        if (vatRowRe.test(rawLine)) continue
        // Reject lines containing clear non-item tokens anywhere.
        if (skipContainsRe.test(rawLine)) continue

        // Normalize: strip leading EAN barcode + article-group code so the
        // matchers below see a clean "name ... price marker" line. The
        // original text is preserved in line_text for debugging, and the
        // EAN is captured so it can be attached to the resulting item.
        const eanMatch = rawLine.match(eanPrefixRe)
        currentEan = eanMatch ? eanMatch[1] : null
        let trimmed = rawLine.replace(eanPrefixRe, '').replace(articleCodeRe, '')

        // Check if this is a weight/quantity sub-line for the previous item
        const wm = trimmed.match(weightSubRe)
        if (wm && items.length > 0) {
            const prevItem = items[items.length - 1]
            const weight = parseGermanNumber(wm[1])
            const pricePerKg = parseGermanNumber(wm[2])
            if (weight && pricePerKg) {
                prevItem.quantity = weight
                prevItem.unit = 'kg'
                prevItem.unit_price = round2(pricePerKg)
                prevItem.line_text += '\n' + rawLine
            }
            continue
        }
        if (handSubRe.test(trimmed)) {
            // Handeingabe sub-line — attach to previous item
            if (items.length > 0) {
                const kgMatch = trimmed.match(/(\d+[.,]\s?\d+)\s*kg/i)
                if (kgMatch) {
                    const prevItem = items[items.length - 1]
                    const weight = parseGermanNumber(kgMatch[1])
                    if (weight) {
                        prevItem.quantity = weight
                        prevItem.unit = 'kg'
                        prevItem.unit_price = round2(prevItem.total_price / weight)
                        prevItem.line_text += '\n' + rawLine
                    }
                }
            }
            continue
        }

        // Quantity sub-line: "2 Stk x 1,29" or "3 x 0,99" on a line by itself
        const qsm = trimmed.match(qtySubRe)
        if (qsm && items.length > 0) {
            const prevItem = items[items.length - 1]
            const qty = parseInt(qsm[1], 10)
            const uPrice = parseGermanNumber(qsm[2])
            if (qty > 0 && uPrice) {
                prevItem.quantity = qty
                prevItem.unit_price = round2(uPrice)
                prevItem.line_text += '\n' + rawLine
            }
            continue
        }

        // Skip lines with EUR totals ("Se EUR 52,45" / "Geg. Mastercard EUR 52,45")
        if (eurTotalRe.test(trimmed)) continue

        let rawName, quantity = 1, unitPrice, totalPrice

        // Inline qty with fused no-separator total (e.g. "5,79x 2 11584")
        const iqmNs = trimmed.match(inlineQtyNoSepRe)
        if (iqmNs) {
            const name = iqmNs[1].trim()
                .replace(/^\d+\s+/, '').replace(/[\s.*_|,-]+$/, '').trim()
            const uPrice = parsePrice(iqmNs[2])
            const qty = parseInt(iqmNs[3], 10)
            const run = iqmNs[4]
            const expected = uPrice * qty
            // Try both splits: (run as cents of price+marker) vs (no marker)
            // Prefer the one closest to unit_price * qty.
            const candWithMarker = parsePrice(run.slice(0, -1)) // drop last digit (marker)
            const candNoMarker = parsePrice(run)
            const diffMarker = Math.abs((candWithMarker ?? 0) - expected)
            const diffNoMarker = Math.abs((candNoMarker ?? 0) - expected)
            const tPrice = diffMarker <= diffNoMarker ? candWithMarker : candNoMarker
            if (name.length >= 2 && tPrice && !skipRe.test(name)) {
                items.push({
                    line_text: rawLine,
                    ean: currentEan,
                    name,
                    quantity: qty,
                    unit: 'pc',
                    unit_price: round2(uPrice),
                    total_price: round2(tPrice),
                })
                continue
            }
        }

        // Try inline quantity first: "name  unit_price x qty  total_price  marker"
        const iqm = trimmed.match(inlineQtyRe)
            || trimmed.match(inlineQtyCompactRe)
            || trimmed.match(inlineQtyNoMarkerRe)
        if (iqm) {
            rawName = iqm[1].trim()
            unitPrice = parsePrice(iqm[2])
            quantity = parseInt(iqm[3], 10)
            totalPrice = parsePrice(iqm[4])
            if (rawName && rawName.length >= 2 && totalPrice > 0 && !skipRe.test(rawName)) {
                const name = rawName
                    .replace(/^\d+\s+/, '').replace(/[\s.*_|,-]+$/, '').trim()
                if (name.length >= 2) {
                    items.push({
                        line_text: rawLine,
                        ean: currentEan,
                        name,
                        quantity,
                        unit: 'pc',
                        unit_price: round2(unitPrice),
                        total_price: round2(totalPrice),
                    })
                    continue
                }
            }
        }

        // Try two-price pattern first: name  unit_price  total_price  marker
        const m2 = trimmed.match(twoPriceRe)
        if (m2) {
            rawName = m2[1].trim()
            unitPrice = parsePrice(m2[2])
            totalPrice = parsePrice(m2[3])
            if (unitPrice && totalPrice && unitPrice <= totalPrice) {
                quantity = Math.round(totalPrice / unitPrice)
                if (quantity < 1) quantity = 1
            }
        } else {
            // Single price + tax marker (incl. compact price+marker with no space,
            // and 1-decimal OCR'd prices when followed by a marker).
            let m = trimmed.match(priceRe)
                || trimmed.match(priceLooseRe)
                || trimmed.match(compactPriceRe)
                || trimmed.match(price1DecRe)

            // Last resort: name + trailing 2-decimal price, no tax marker.
            // Only when the line has exactly ONE price (rejects tax-table rows
            // like "Gesamtbetrag 28,43 2,54 30,97" and "B= 7,0% 12,58 0,88 13,46").
            if (!m) {
                const priceCount = (trimmed.match(/\d+[.,]\d{2}/g) || []).length
                if (priceCount === 1) {
                    // Require the line to start with a letter so we don't
                    // grab numeric footer lines (terminal IDs, timestamps).
                    m = trimmed.match(/^([A-Za-zÄÖÜäöüß].+?)\s+(\d+[.,]\d{2})\s*$/)
                }
            }

            if (!m) continue
            rawName = m[1].trim()
            totalPrice = parsePrice(m[2])
            unitPrice = totalPrice
        }

        if (!rawName || rawName.length < 2) continue
        if (totalPrice == null || totalPrice <= 0) continue
        if (/^[-=*_|]+$/.test(rawName)) continue

        let name = rawName

        // Skip payment / tax / total lines
        if (skipRe.test(name)) continue

        // Check for "2 ST x 0,99" pattern inside the name
        const stMatch = name.match(qtyStRe)
        if (stMatch) {
            quantity = parseInt(stMatch[1], 10)
            unitPrice = parseGermanNumber(stMatch[2])
            name = name.replace(qtyStRe, '').trim()
        } else {
            // Check for "2x " or "2* " prefix
            const qm = name.match(qtyPrefixRe)
            if (qm) {
                quantity = parseInt(qm[1], 10)
                name = name.replace(qtyPrefixRe, '').trim()
                unitPrice = round2(totalPrice / quantity)
            }
        }

        // Remove leading item number (e.g. "1 VOLLMILCH")
        name = name.replace(/^\d+\s+/, '').trim()
        // Remove trailing OCR artifacts (dots, dashes, underscores, pipes)
        name = name.replace(/[\s.*_|,-]+$/, '').trim()

        // Safety net: EAN leaked into the name (leading quote/punct prevented
        // the prefix match). Extract it and clean up the article-code token.
        if (!currentEan) {
            const m = name.match(eanAnywhereRe)
            if (m) {
                currentEan = m[1]
                name = name.replace(m[0], '').replace(articleCodeRe, '').trim()
                name = name.replace(/^[\s"'`«»*·•\-–—_.:|]+/, '').trim()
            }
        } else {
            // Strip any accidental EAN re-occurrence in the cleaned name
            name = name.replace(currentEan, '').trim()
            name = name.replace(articleCodeRe, '').trim()
        }

        if (name.length < 2) continue

        items.push({
            line_text: rawLine,
            ean: currentEan,
            name,
            quantity,
            unit: 'pc',
            unit_price: round2(unitPrice),
            total_price: round2(totalPrice),
        })
    }

    return items
}

/**
 * Extract total amount from the receipt.
 *
 * Strategy: collect ALL total candidates from every keyword match
 * (Summe / Gesamtbetrag / Total / zu zahlen / Betrag / Geg. …). For each
 * line, take the LAST price — German tax summary rows look like
 * "Gesamtbetrag 12,58 0,88 13,46" where Brutto is last.
 *
 * Then resolve via majority vote: the real total usually appears 2+ times
 * on a receipt (Summe, Total, Betrag, tax Brutto column), while any OCR-
 * damaged variant (e.g. "2u zahlen 09,74") appears only once. Ties broken
 * by keyword priority.
 */
function parseTotal(text, itemsSum = null) {
    const lines = text.split('\n')
    const priceG = /-?\d+[.,]\d{2}/g

    const keywords = [
        { re: /\bGesa[mn]t[bß]etrag\b/i, prio: 5 },
        { re: /\b(?:zu|2u)\s+zahlen\b/i, prio: 5 },
        { re: /^\s*SUMME\b/i, prio: 4 },
        { re: /^\s*Summe\b/i, prio: 4 },
        { re: /\bTOTAL\b/i, prio: 4 },
        { re: /\bGESAMT\b/i, prio: 3 },
        { re: /^\s*Se\s+EUR\b/i, prio: 3 },
        { re: /\bSwe\s+ER\b/i, prio: 3 },
        { re: /^\s*Betrag\s+EUR\b/i, prio: 2 },
        { re: /^\s*Betrag\b/i, prio: 2 },
        { re: /\bGeg\.?\s+\w+\s+EUR\b/i, prio: 1 },
    ]

    // Collect all candidates: { value -> { prio, count } }
    const candidates = new Map()

    for (const raw of lines) {
        const line = raw.trim()
        if (!line) continue

        let matched = null
        for (const kw of keywords) {
            if (kw.re.test(line)) {
                if (!matched || kw.prio > matched.prio) matched = kw
            }
        }
        if (!matched) continue

        const prices = line.match(priceG)
        if (!prices || !prices.length) continue
        const value = parseGermanNumber(prices[prices.length - 1])
        if (value == null || value <= 0) continue

        const prev = candidates.get(value)
        if (prev) {
            prev.count++
            if (matched.prio > prev.prio) prev.prio = matched.prio
        } else {
            candidates.set(value, { prio: matched.prio, count: 1 })
        }
    }

    if (!candidates.size) return null

    // If we have an itemsSum hint, STRONGLY prefer the candidate closest to it
    // (within 15% tolerance). This rescues cases like OCR reading
    // "2u zahlen 09,74" where the true total (89,74) appears under Summe.
    if (itemsSum != null && itemsSum > 0) {
        let closest = null
        for (const [value, meta] of candidates) {
            const diff = Math.abs(value - itemsSum)
            const rel = diff / itemsSum
            if (rel <= 0.15) {
                if (!closest || diff < closest.diff) {
                    closest = { value, diff, ...meta }
                }
            }
        }
        if (closest) return closest.value
    }

    // Otherwise: highest count, then highest priority, then largest value.
    let best = null
    for (const [value, meta] of candidates) {
        if (
            !best ||
            meta.count > best.count ||
            (meta.count === best.count && meta.prio > best.prio) ||
            (meta.count === best.count && meta.prio === best.prio && value > best.value)
        ) {
            best = { value, ...meta }
        }
    }
    return best.value
}

// ── Utilities ────────────────────────────────────────────────────────────────

/** Convert German number format "1.234,56" or "1,99" to a JS number. Tolerates OCR spaces. */
function parseGermanNumber(str) {
    if (!str) return null
    const clean = str.replace(/\s/g, '')
    // Dot without comma: a single dot followed by 1-3 digits is a decimal separator,
    // not a German thousands separator. E.g. "2.79" → 2.79, "0.432" → 0.432
    if (!clean.includes(',') && /^\d*\.\d{1,3}$/.test(clean)) {
        return parseFloat(clean)
    }
    return parseFloat(clean.replace(/\./g, '').replace(',', '.'))
}

/**
 * Parse a price string that may have OCR errors:
 * - Normal: "5,47" or "13,99"
 * - Missing separator: "547" → 5.47 (OCR dropped comma)
 * - Extra decimal: "2,712" → 2.71 (OCR noise)
 */
function parsePrice(str) {
    if (!str) return null
    const clean = str.replace(/\s/g, '')
    if (/[.,]/.test(clean)) {
        // Dot without comma: single dot + 1-3 trailing digits → decimal separator
        // Handles OCR using "." instead of "," (e.g. "2.79", "11.58", "0.432")
        if (!clean.includes(',') && /^\d+\.\d{1,3}$/.test(clean)) {
            return Math.round(parseFloat(clean) * 100) / 100
        }
        const n = parseFloat(clean.replace(/\./g, '').replace(',', '.'))
        return Math.round(n * 100) / 100
    }
    // No separator → last 2 digits are cents
    if (clean.length >= 3) {
        return parseFloat(clean.slice(0, -2) + '.' + clean.slice(-2))
    }
    return parseFloat(clean) || null
}

function round2(n) {
    return Math.round(n * 100) / 100
}

// ── Main entry point ─────────────────────────────────────────────────────────

/**
 * Full pipeline: OCR → parse.
 * @param {File|Blob|string} image - receipt image
 * @param {function} onProgress - optional OCR progress callback (0..1)
 * @returns parsed receipt object
 */
export async function processReceipt(image, onProgress) {
    const rawText = await ocrImage(image, onProgress)
    return parseReceiptText(rawText)
}

/**
 * Parse already-OCR'd text into a structured receipt.
 */
export function parseReceiptText(rawText) {
    // Normalize currency symbols glued to prices (e.g. "€0,99" → "0,99")
    // and common OCR variants, so line-item regex that expects a space
    // between name and price still matches.
    const normalized = rawText
        .replace(/€\s*(\d)/g, ' $1')
        .replace(/EUR\s*(\d+[.,]\d{2})/g, '$1')

    const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean)
    const { date, time } = parseDateTime(rawText)
    const { address, city } = parseStoreAddress(lines)
    const items = parseLineItems(lines)
    const itemsSum = items.reduce((s, i) => s + (i.total_price || 0), 0)
    const total = parseTotal(rawText, itemsSum)

    // Sanity pass: if an item total exceeds the receipt total, it's almost
    // certainly an OCR error (e.g. "66,29" read for "6,29"). Try dropping
    // the leading digit of the price; if the result is plausible (> 0 and
    // <= receipt total), use it.
    if (total != null && total > 0) {
        for (const it of items) {
            if (it.total_price > total + 0.01) {
                const str = String(Math.round(it.total_price * 100))
                if (str.length > 1) {
                    const fixed = parseInt(str.slice(1), 10) / 100
                    if (fixed > 0 && fixed <= total) {
                        it.total_price = round2(fixed)
                        it.unit_price = round2(fixed / (it.quantity || 1))
                    }
                }
            }
        }
    }

    return {
        store_name: parseStoreName(lines),
        store_address: address,
        store_city: city,
        purchase_date: date,
        purchase_time: time,
        total_amount: total,
        items,
        warnings: validateParseResult({ total, items }),
        raw_text: rawText,
    }
}

/**
 * Self-review the parsed output and flag suspicious results so downstream
 * code (or a human) can act on them. Keep this conservative — false alarms
 * erode trust. Examples of what we catch:
 *   - total missing
 *   - items_sum drifts more than 2% (or 1 EUR) from total
 *   - item name still contains an EAN-shaped digit run (parse leak)
 *   - unit_price * quantity ≠ total_price (pricing math broken)
 *   - item name is suspiciously short or all punctuation
 *   - item price > receipt total (obvious OCR scale error)
 */
function validateParseResult({ total, items }) {
    const warnings = []
    const itemsSum = items.reduce((s, i) => s + (i.total_price || 0), 0)

    if (total == null) {
        warnings.push({ code: 'TOTAL_MISSING', message: 'Could not detect total amount.' })
    } else {
        const diff = Math.abs(itemsSum - total)
        const rel = total > 0 ? diff / total : 1
        if (diff > 1 && rel > 0.02) {
            warnings.push({
                code: 'SUM_MISMATCH',
                message: `Items sum (${itemsSum.toFixed(2)}) differs from total (${total.toFixed(2)}) by ${diff.toFixed(2)}.`,
                items_sum: round2(itemsSum),
                total,
            })
        }
    }

    if (!items.length) {
        warnings.push({ code: 'NO_ITEMS', message: 'No line items detected.' })
    }

    const eanInName = /(?<!\d)\d{8,}(?!\d)/
    items.forEach((it, idx) => {
        if (eanInName.test(it.name)) {
            warnings.push({
                code: 'EAN_IN_NAME',
                index: idx,
                name: it.name,
                message: 'Long digit run in item name — likely a barcode/code leaked into the name.',
            })
        }
        if (total != null && it.total_price > total + 0.01) {
            warnings.push({
                code: 'ITEM_EXCEEDS_TOTAL',
                index: idx,
                name: it.name,
                total_price: it.total_price,
                message: 'Item price exceeds receipt total — likely OCR digit scaling error.',
            })
        }
        if (it.quantity > 1 && Math.abs(it.unit_price * it.quantity - it.total_price) > 0.02) {
            warnings.push({
                code: 'PRICE_MATH',
                index: idx,
                name: it.name,
                message: `unit_price × quantity (${(it.unit_price * it.quantity).toFixed(2)}) ≠ total_price (${it.total_price.toFixed(2)}).`,
            })
        }
        const alpha = (it.name.match(/[A-Za-zÄÖÜäöüß]/g) || []).length
        if (alpha < 3) {
            warnings.push({
                code: 'SHORT_NAME',
                index: idx,
                name: it.name,
                message: 'Item name has <3 letters — likely garbage.',
            })
        }
    })

    return warnings
}
