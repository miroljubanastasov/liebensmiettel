/**
 * Small OCR helpers for photographing individual product facets:
 * expiry date, Nutri-Score grade, nutrition table, label keywords.
 *
 * All helpers re-use the Tesseract worker from receiptParser (deu+eng).
 * On failure they return null; callers should fall back to manual entry.
 */
import { ocrImage } from './receiptParser'

/**
 * Find an expiry / best-before date in a photo.
 * Recognises common formats: DD.MM.YYYY, DD/MM/YYYY, DD.MM.YY,
 * MHD/BBD prefixes, and ISO YYYY-MM-DD.
 * @returns {string|null} ISO date string YYYY-MM-DD
 */
export async function ocrExpiryDate(image) {
    const text = await ocrImage(image)
    if (!text) return null

    const patterns = [
        /(\d{2})[./-](\d{2})[./-](\d{4})/,       // DD.MM.YYYY
        /(\d{2})[./-](\d{2})[./-](\d{2})(?!\d)/, // DD.MM.YY
        /(\d{4})-(\d{2})-(\d{2})/,               // YYYY-MM-DD
    ]

    for (const re of patterns) {
        const m = text.match(re)
        if (!m) continue
        let y, mo, d
        if (re === patterns[2]) { [y, mo, d] = [m[1], m[2], m[3]] }
        else {
            d = m[1]; mo = m[2]
            y = m[3].length === 2 ? `20${m[3]}` : m[3]
        }
        const year = parseInt(y, 10)
        const month = parseInt(mo, 10)
        const day = parseInt(d, 10)
        if (month < 1 || month > 12 || day < 1 || day > 31) continue
        if (year < 2020 || year > 2060) continue
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }
    return null
}

/**
 * Detect a Nutri-Score grade (A-E) in a photo.
 * Looks for an isolated letter A/B/C/D/E near the word "Nutri".
 */
export async function ocrNutriScore(image) {
    const text = (await ocrImage(image))?.toUpperCase() ?? ''
    if (!text) return null

    // Explicit "NUTRI-SCORE A" / "NUTRISCORE B"
    const labeled = text.match(/NUTRI[\s-]*SCORE[\s:]*([A-E])\b/)
    if (labeled) return labeled[1].toLowerCase()

    // Any standalone A-E letter (on its own line, typical for score graphics)
    const standalone = text.split(/\n/).map(l => l.trim()).find(l => /^[A-E]$/.test(l))
    if (standalone) return standalone.toLowerCase()

    return null
}

/**
 * Parse a nutrition-facts table from a photo.
 * Returns per-100g values where detected. All fields nullable.
 */
export async function ocrNutritionFacts(image) {
    const raw = await ocrImage(image)
    if (!raw) return null

    const text = raw.replace(/,/g, '.')
    const num = (re) => {
        const m = text.match(re)
        if (!m) return null
        const v = parseFloat(m[1])
        return isFinite(v) ? v : null
    }

    const out = {
        energy_kcal: num(/(\d+(?:\.\d+)?)\s*k?cal/i),
        fat_g: num(/Fett[^0-9]*(\d+(?:\.\d+)?)\s*g/i),
        saturated_fat_g: num(/gesätt[^0-9]*(\d+(?:\.\d+)?)\s*g/i),
        carbs_g: num(/Kohlenhydrate[^0-9]*(\d+(?:\.\d+)?)\s*g/i),
        sugars_g: num(/Zucker[^0-9]*(\d+(?:\.\d+)?)\s*g/i),
        fiber_g: num(/Ballaststoffe[^0-9]*(\d+(?:\.\d+)?)\s*g/i),
        protein_g: num(/Eiweiß[^0-9]*(\d+(?:\.\d+)?)\s*g|Protein[^0-9]*(\d+(?:\.\d+)?)\s*g/i),
        salt_g: num(/Salz[^0-9]*(\d+(?:\.\d+)?)\s*g/i),
    }

    // Reject empty result
    return Object.values(out).some(v => v != null) ? out : null
}

/**
 * Detect common label keywords in a photo (vegan, bio, etc.).
 * Returns an array of label tag slugs, OFF-compatible.
 */
const LABEL_KEYWORDS = {
    'en:organic': /\bbio\b|\borganic\b|\böko\b/i,
    'en:vegan': /\bvegan\b/i,
    'en:vegetarian': /\bvegetarisch\b|\bvegetarian\b/i,
    'en:gluten-free': /\bglutenfrei\b|\bgluten[- ]free\b/i,
    'en:lactose-free': /\blaktosefrei\b|\blactose[- ]free\b/i,
    'en:fairtrade': /\bfair ?trade\b/i,
    'en:no-added-sugar': /\bohne zuckerzusatz\b|\bno added sugar\b/i,
}

export async function ocrLabels(image) {
    const text = await ocrImage(image)
    if (!text) return []
    const found = []
    for (const [tag, re] of Object.entries(LABEL_KEYWORDS)) {
        if (re.test(text)) found.push(tag)
    }
    return found
}
