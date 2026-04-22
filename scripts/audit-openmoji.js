#!/usr/bin/env node
/**
 * OpenMoji audit — searches OpenMoji's annotation database and validates that
 * every icon referenced from our catalogues (categories, subcategories,
 * PRODUCT_EMOJI_OVERRIDES, PRODUCT_ICON_OVERRIDES) exists in the black SVG set.
 *
 * Usage:
 *   node scripts/audit-openmoji.js               # validate coverage
 *   node scripts/audit-openmoji.js search apple  # search OpenMoji for "apple"
 *
 * For missing icons, it prints suggestions by fuzzy-matching the subcategory
 * name against OpenMoji annotations — useful for picking a better `icon`
 * override when the default emoji has a weak OpenMoji black variant.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

// ─── Paths ──────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '..', 'src')

// ─── OpenMoji version & endpoints ───────────────────────────────────────────
const VERSION = '15.1.0'
const META_URL = `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@${VERSION}/data/openmoji.json`

// ─── Bring in our taxonomy via dynamic ESM import ───────────────────────────
async function loadTaxonomy() {
    const [subModule, iconModule] = await Promise.all([
        import(pathToFileURL(resolve(SRC, 'data', 'subcategories.js')).href),
        import(pathToFileURL(resolve(SRC, 'data', 'productIcons.js')).href),
    ])
    return {
        SUBCATEGORIES: subModule.default,
        CATEGORY_EMOJI: subModule.CATEGORY_EMOJI,
        CATEGORY_ICONS: subModule.CATEGORY_ICONS,
        PRODUCT_EMOJI_OVERRIDES: iconModule.PRODUCT_EMOJI_OVERRIDES,
        PRODUCT_ICON_OVERRIDES: iconModule.PRODUCT_ICON_OVERRIDES,
    }
}

// ─── OpenMoji metadata loader (with tiny disk cache) ────────────────────────
const CACHE_PATH = resolve(__dirname, '.openmoji-cache.json')

async function loadOpenMojiMeta() {
    try {
        const cached = await readFile(CACHE_PATH, 'utf8')
        const parsed = JSON.parse(cached)
        if (parsed.version === VERSION && Array.isArray(parsed.data)) {
            console.log(`✓ loaded ${parsed.data.length} OpenMoji entries from cache`)
            return parsed.data
        }
    } catch { /* no cache */ }

    console.log(`↓ fetching OpenMoji ${VERSION} metadata …`)
    const res = await fetch(META_URL)
    if (!res.ok) throw new Error(`OpenMoji fetch failed: ${res.status}`)
    const data = await res.json()

    const { writeFile } = await import('node:fs/promises')
    await writeFile(CACHE_PATH, JSON.stringify({ version: VERSION, data }))
    console.log(`✓ fetched & cached ${data.length} OpenMoji entries`)
    return data
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function emojiToHex(emoji) {
    if (!emoji) return ''
    const out = []
    for (const ch of emoji) {
        const cp = ch.codePointAt(0)
        if (cp === 0xfe0f) continue
        out.push(cp.toString(16).toUpperCase())
    }
    return out.join('-')
}

function indexOpenMoji(meta) {
    const byHex = new Map()
    for (const e of meta) byHex.set(e.hexcode.toUpperCase(), e)
    return byHex
}

/** Fuzzy score a query against an annotation: how many query tokens match. */
function annotationScore(query, entry) {
    const q = query.toLowerCase()
    const ann = (entry.annotation || '').toLowerCase()
    const tags = (entry.tags || '').toLowerCase()
    const blob = `${ann} ${tags}`
    if (blob.includes(q)) return 2
    const qTokens = q.split(/\W+/).filter(Boolean)
    let hit = 0
    for (const t of qTokens) if (t.length > 2 && blob.includes(t)) hit++
    return hit / Math.max(qTokens.length, 1)
}

function searchOpenMoji(meta, query, limit = 8) {
    return meta
        .map(e => ({ e, s: annotationScore(query, e) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, limit)
        .map(x => ({ hex: x.e.hexcode, annotation: x.e.annotation, emoji: x.e.emoji, group: x.e.group }))
}

// ─── Reports ────────────────────────────────────────────────────────────────
function report(title, rows) {
    console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 60 - title.length))}`)
    if (!rows.length) { console.log('  (none)'); return }
    for (const r of rows) console.log('  ' + r)
}

async function audit() {
    const [{ SUBCATEGORIES, CATEGORY_EMOJI, CATEGORY_ICONS, PRODUCT_EMOJI_OVERRIDES, PRODUCT_ICON_OVERRIDES }, meta]
        = await Promise.all([loadTaxonomy(), loadOpenMojiMeta()])

    const byHex = indexOpenMoji(meta)
    const missing = { category: [], subcategory: [], product: [] }
    const suggestions = []

    // Categories
    for (const [cat, hex] of Object.entries(CATEGORY_ICONS)) {
        if (!byHex.has(hex.toUpperCase())) {
            missing.category.push(`${cat.padEnd(20)}  ${CATEGORY_EMOJI[cat]}  hex=${hex}`)
        }
    }

    // Subcategories
    for (const sub of SUBCATEGORIES) {
        const hex = (sub.icon || emojiToHex(sub.emoji)).toUpperCase()
        if (!byHex.has(hex)) {
            missing.subcategory.push(`${sub.name.padEnd(48)}  ${sub.emoji}  hex=${hex}`)
            const sugs = searchOpenMoji(meta, sub.ingredientEN || sub.name, 3)
            if (sugs.length) suggestions.push({ name: sub.name, sugs })
        }
    }

    // Product overrides
    for (const [name, emoji] of Object.entries(PRODUCT_EMOJI_OVERRIDES || {})) {
        const hex = (PRODUCT_ICON_OVERRIDES?.[name] || emojiToHex(emoji)).toUpperCase()
        if (!byHex.has(hex)) {
            missing.product.push(`${name.padEnd(48)}  ${emoji}  hex=${hex}`)
        }
    }

    console.log(`\n═══ OpenMoji ${VERSION} audit ═══`)
    console.log(`Total OpenMoji entries: ${meta.length}`)
    console.log(`Categories checked:     ${Object.keys(CATEGORY_ICONS).length}`)
    console.log(`Subcategories checked:  ${SUBCATEGORIES.length}`)
    console.log(`Product overrides:      ${Object.keys(PRODUCT_EMOJI_OVERRIDES).length}`)

    report('missing category icons', missing.category)
    report('missing subcategory icons', missing.subcategory)
    report('missing product-override icons', missing.product)

    if (suggestions.length) {
        console.log(`\n── suggestions for missing subcategories ──`)
        for (const { name, sugs } of suggestions) {
            console.log(`  ${name}`)
            for (const s of sugs) {
                console.log(`    • ${s.emoji}  ${s.hex.padEnd(20)}  ${s.annotation}`)
            }
        }
    }

    const ok = missing.category.length + missing.subcategory.length + missing.product.length === 0
    console.log(`\n${ok ? '✓ all icons resolve to OpenMoji entries' : '✗ missing entries above'}`)
    process.exitCode = ok ? 0 : 1
}

async function search(query) {
    const meta = await loadOpenMojiMeta()
    const hits = searchOpenMoji(meta, query, 20)
    console.log(`\n"${query}" → ${hits.length} matches:`)
    for (const h of hits) {
        console.log(`  ${h.emoji}  ${h.hex.padEnd(20)}  [${h.group}]  ${h.annotation}`)
    }
}

// ─── Entrypoint ─────────────────────────────────────────────────────────────
const [, , cmd, ...rest] = process.argv
if (cmd === 'search') {
    if (!rest.length) {
        console.error('Usage: node scripts/audit-openmoji.js search <query>')
        process.exit(2)
    }
    await search(rest.join(' '))
} else {
    await audit()
}
