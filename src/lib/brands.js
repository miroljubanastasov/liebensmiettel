/**
 * Brand lookup & suggestion helpers.
 *
 * Thin wrappers over src/data/brands.js — kept in /lib so the rest of the
 * app imports from a stable surface and the underlying data module can be
 * regenerated or moved to Supabase later.
 */

import {
    BRANDS,
    BRAND_ALIAS_INDEX,
    BRANDS_BY_RETAILER,
    normalizeBrandKey,
    getBrand,
} from '../data/brands.js'

export { BRANDS, getBrand }

/**
 * Resolve a free-form brand string (as typed, OCR'd, or received from OFF)
 * to a catalogue entry. Returns the full brand object or null.
 *
 * Strategy:
 *   1. Exact alias/name lookup via normalised index
 *   2. Substring token containment for multi-word brand names
 *   3. Bounded Levenshtein fuzzy fallback for OCR typos
 */
export function findBrand(raw) {
    const key = normalizeBrandKey(raw)
    if (!key) return null

    // 1. Direct alias hit
    const directId = BRAND_ALIAS_INDEX.get(key)
    if (directId) return getBrand(directId)

    // 2. Token-contiguous scan — find the longest alias that appears as a
    //    contiguous word run inside the input (handles "REWE Bio Hafer"
    //    → rewe-bio, not plain "rewe").
    const tokens = key.split(' ')
    let best = null
    let bestLen = 0
    for (const [aliasKey, id] of BRAND_ALIAS_INDEX) {
        const aliasTokens = aliasKey.split(' ')
        if (aliasTokens.length > tokens.length) continue
        for (let i = 0; i <= tokens.length - aliasTokens.length; i++) {
            let ok = true
            for (let j = 0; j < aliasTokens.length; j++) {
                if (tokens[i + j] !== aliasTokens[j]) { ok = false; break }
            }
            if (ok && aliasKey.length > bestLen) {
                best = id
                bestLen = aliasKey.length
            }
        }
    }
    if (best) return getBrand(best)

    // 3. Fuzzy — only attempted on single-token inputs ≥4 chars, Levenshtein ≤1.
    if (tokens.length === 1 && key.length >= 4) {
        for (const [aliasKey, id] of BRAND_ALIAS_INDEX) {
            if (!aliasKey.includes(' ') && Math.abs(aliasKey.length - key.length) <= 1) {
                if (editDistance1(aliasKey, key)) return getBrand(id)
            }
        }
    }

    return null
}

/** Fast boolean Levenshtein check: returns true iff distance ≤ 1. */
function editDistance1(a, b) {
    if (a === b) return true
    const la = a.length, lb = b.length
    if (Math.abs(la - lb) > 1) return false
    let i = 0, j = 0, edits = 0
    while (i < la && j < lb) {
        if (a[i] === b[j]) { i++; j++; continue }
        if (++edits > 1) return false
        if (la === lb) { i++; j++ }
        else if (la > lb) i++
        else j++
    }
    if (i < la || j < lb) edits++
    return edits <= 1
}

/**
 * All brands linked to a given retailer chain (private labels).
 * Sorted by product_count_de descending, then name.
 */
export function getPrivateLabelsFor(chainId) {
    const list = BRANDS_BY_RETAILER.get(chainId) ?? []
    return [...list].sort((a, b) =>
        (b.product_count_de ?? 0) - (a.product_count_de ?? 0)
        || a.name.localeCompare(b.name)
    )
}

/**
 * Top-N brands by German product count. Used for autocomplete seeding.
 */
export function listTopBrands(limit = 200) {
    return [...BRANDS]
        .filter((b) => (b.product_count_de ?? 0) > 0)
        .sort((a, b) => (b.product_count_de ?? 0) - (a.product_count_de ?? 0))
        .slice(0, limit)
}
