/**
 * Brands catalogue — merged view of OFF-generated + curated entries.
 *
 * Curated entries shadow generated entries with the same `id`.
 * Exports BRANDS plus lookup indexes used by src/lib/brands.js.
 */

import { BRANDS_GENERATED } from './brands.generated.js'
import { BRANDS_CURATED } from './brands.curated.js'

/**
 * Normalise a raw brand name for alias lookup:
 *  - lowercase
 *  - umlaut expansion (ä→ae …)
 *  - strip diacritics and punctuation
 *  - collapse whitespace
 * Kept here (not imported) so this module stays dependency-free.
 */
export function normalizeBrandKey(str) {
    if (!str) return ''
    return String(str)
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ')
}

// ─── Merge generated + curated ──────────────────────────────────────────────
const byId = new Map()
for (const b of BRANDS_GENERATED) byId.set(b.id, { ...b })
for (const c of BRANDS_CURATED) {
    const prev = byId.get(c.id)
    byId.set(c.id, prev ? { ...prev, ...c } : { ...c })
}

export const BRANDS = [...byId.values()]

// ─── Alias index: normalized key → brand id ─────────────────────────────────
export const BRAND_ALIAS_INDEX = (() => {
    const idx = new Map()
    for (const b of BRANDS) {
        const keys = new Set([b.id, b.name, ...(b.aliases || [])])
        for (const key of keys) {
            const norm = normalizeBrandKey(key)
            if (norm && !idx.has(norm)) idx.set(norm, b.id)
        }
    }
    return idx
})()

// ─── Retailer private-label index ───────────────────────────────────────────
export const BRANDS_BY_RETAILER = (() => {
    const m = new Map()
    for (const b of BRANDS) {
        if (!b.retailer_chain_id) continue
        if (!m.has(b.retailer_chain_id)) m.set(b.retailer_chain_id, [])
        m.get(b.retailer_chain_id).push(b)
    }
    return m
})()

export function getBrand(id) {
    return byId.get(id) || null
}
