/**
 * Fuzzy matching between OFF product names and receipt item names.
 *
 * Receipt names are abbreviated uppercased German (e.g. "HAEHN. SCHENKEL")
 * while OFF names are full form (e.g. "Hähnchenschenkel frisch").
 *
 * Strategy:
 *  1. Normalize both strings (lowercase, remove punctuation, split words)
 *  2. Check if words from receipt name appear in the OFF name or vice versa
 *  3. Score by fraction of matching words
 */

/**
 * Normalize a product name string for matching.
 * - Lowercase
 * - Replace German umlauts with expanded form (ä→ae, ö→oe, ü→ue, ß→ss)
 * - Remove punctuation
 * - Split into words
 */
function normalizeWords(str) {
    if (!str) return []
    return str
        .toLowerCase()
        // Standard umlaut expansion
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        // Common OCR umlaut manglings on German receipts
        .replace(/ii/g, 'ue')      // "wiirstchen" → "wuerstchen" (OCR reads ü as ii)
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 2)
}

/**
 * Check if word A is a prefix/substring of word B or vice versa.
 * Handles receipt abbreviations like "HAEHN" matching "haehnchen".
 * Also tolerates minor OCR errors via simple edit distance.
 */
function wordsMatch(a, b) {
    if (a === b) return true
    if (a.length >= 3 && b.startsWith(a)) return true
    if (b.length >= 3 && a.startsWith(b)) return true
    if (a.length >= 4 && b.includes(a)) return true
    if (b.length >= 4 && a.includes(b)) return true

    // Tolerate 1-2 char OCR errors for longer words (e.g. "wiirstchen" vs "wuerstschen")
    if (a.length >= 5 && b.length >= 5) {
        const maxDist = Math.min(a.length, b.length) >= 8 ? 2 : 1
        if (editDistance(a, b) <= maxDist) return true
    }

    return false
}

/**
 * Simple Levenshtein edit distance (bounded for performance).
 */
function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 3) return 99
    const m = a.length, n = b.length
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1))
    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        }
    }
    return dp[m][n]
}

/**
 * Score how well a scanned product (OFF) matches a receipt item.
 * Returns 0..1 where 1 = perfect match.
 *
 * @param {object} product - OFF product { name, brand, ean }
 * @param {object} receiptItem - parsed receipt item { name, line_text }
 * @returns {number} match score 0..1
 */
export function matchScore(product, receiptItem) {
    const prodWords = normalizeWords(`${product.name || ''} ${product.brand || ''}`)
    const rcptWords = normalizeWords(receiptItem.name || receiptItem.line_text || '')

    if (prodWords.length === 0 || rcptWords.length === 0) return 0

    // Count how many receipt words match a product word
    let rcptMatches = 0
    for (const rw of rcptWords) {
        if (prodWords.some((pw) => wordsMatch(rw, pw))) rcptMatches++
    }

    // Count how many product words match a receipt word
    let prodMatches = 0
    for (const pw of prodWords) {
        if (rcptWords.some((rw) => wordsMatch(pw, rw))) prodMatches++
    }

    // Symmetric score: average of both directions
    const rcptScore = rcptMatches / rcptWords.length
    const prodScore = prodMatches / prodWords.length
    return (rcptScore + prodScore) / 2
}

/**
 * Find best matching receipt items for a product.
 * Returns items sorted by score (descending), with score >= threshold.
 *
 * @param {object} product - OFF product
 * @param {Array} receiptItems - array of receipt item objects
 * @param {number} threshold - minimum score (default 0.3)
 * @returns {Array<{ item, score }>}
 */
export function findMatches(product, receiptItems, threshold = 0.3) {
    if (!product || !receiptItems?.length) return []

    return receiptItems
        .map((item) => ({ item, score: matchScore(product, item) }))
        .filter(({ score }) => score >= threshold)
        .sort((a, b) => b.score - a.score)
}
