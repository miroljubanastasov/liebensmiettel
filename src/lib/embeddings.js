/**
 * Embedding-based product classification using multi-level anchors.
 *
 * Architecture:
 *   - ~120 subcategory anchor embeddings (rich multi-product descriptions)
 *   - ~1.3k generic product anchor embeddings (name + aliases + subcat context)
 *   - Runtime: lazily loads the ML model, embeds user input with "query: " prefix,
 *     cosine similarity against BOTH tiers → returns the best-scoring anchor
 *     with its level info so callers can pick the deepest confident match.
 *   - Falls back gracefully if model not yet loaded (returns null)
 *
 * The model handles German, French, English, Spanish, etc. natively.
 */

let _extractor = null
let _catalogue = null
let _loading = false
let _modelReady = false

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function loadCatalogue() {
    if (_catalogue) return _catalogue
    try {
        const resp = await fetch('/data/subcategory-embeddings.json')
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        _catalogue = await resp.json()
        const subN = _catalogue.subcategoryCount ?? '?'
        const genN = _catalogue.genericCount ?? '?'
        console.log(`[embeddings] Loaded ${_catalogue.count} anchors (${subN} subcategory + ${genN} generic, ${_catalogue.dim}d)`)
        return _catalogue
    } catch (err) {
        console.warn('[embeddings] Failed to load embeddings:', err.message)
        return null
    }
}

async function loadModel() {
    if (_extractor) return _extractor
    if (_loading) return null
    _loading = true
    try {
        const { pipeline } = await import('@huggingface/transformers')
        console.log('[embeddings] Loading multilingual-e5-small model...')
        _extractor = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
            dtype: 'q8',
        })
        _modelReady = true
        console.log('[embeddings] Model loaded successfully')
        return _extractor
    } catch (err) {
        console.warn('[embeddings] Failed to load model:', err.message)
        return null
    } finally {
        _loading = false
    }
}

async function embed(text) {
    const extractor = _extractor || await loadModel()
    if (!extractor) return null
    const output = await extractor(`query: ${text}`, { pooling: 'mean', normalize: true })
    return output.tolist()[0]
}

// ── Public API ───────────────────────────────────────────────────────────────

export function isModelReady() {
    return _modelReady
}

export async function warmup() {
    await Promise.all([loadCatalogue(), loadModel()])
}

/**
 * Find the best matching anchors for a user input string across both levels.
 *
 * @param {string} input — user-typed product name (any language)
 * @param {object} [options]
 * @param {number} [options.topN=5]
 * @param {number} [options.threshold=0.5]
 * @param {'any'|'subcategory'|'generic'} [options.level='any']
 * @returns {Promise<Array<{ level, category, subcategory, genericId?, genericName?, score }> | null>}
 */
export async function semanticMatch(input, { topN = 5, threshold = 0.5, level = 'any' } = {}) {
    if (!input || typeof input !== 'string') return null

    const catalogue = _catalogue || await loadCatalogue()
    if (!catalogue) return null

    const inputVec = await embed(input)
    if (!inputVec) return null

    const scored = []
    for (const entry of catalogue.entries) {
        // Legacy entries without `level` default to subcategory
        const entryLevel = entry.level || 'subcategory'
        if (level !== 'any' && entryLevel !== level) continue

        const sim = cosineSimilarity(inputVec, entry.vec)
        if (sim >= threshold) {
            const row = {
                level: entryLevel,
                category: entry.category,
                subcategory: entry.subcategory,
                score: Math.round(sim * 1000) / 1000,
            }
            if (entryLevel === 'generic') {
                row.genericId = entry.genericId
                row.genericName = entry.genericName
            }
            scored.push(row)
        }
    }

    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, topN)
}

/**
 * Find the single best match across both levels (or null).
 *
 * Strategy: run the full cross-level search, then prefer a generic match
 * when it scores within `preferGenericWithin` of the top subcategory score —
 * this way we get the deeper (more specific) answer when it's close enough.
 *
 * @param {string} input
 * @param {number} [threshold=0.6]
 * @returns {Promise<{ level, category, subcategory, genericId?, genericName?, score } | null>}
 */
export async function semanticBestMatch(input, threshold = 0.6) {
    const results = await semanticMatch(input, { topN: 10, threshold })
    if (!results || results.length === 0) return null

    const top = results[0]
    if (top.level === 'generic') return top

    // Top is a subcategory — check if a close-by generic is in the same subcat
    const PREFER_GENERIC_WITHIN = 0.05
    const closeGeneric = results.find(
        r => r.level === 'generic'
            && r.subcategory === top.subcategory
            && (top.score - r.score) <= PREFER_GENERIC_WITHIN,
    )
    return closeGeneric || top
}
