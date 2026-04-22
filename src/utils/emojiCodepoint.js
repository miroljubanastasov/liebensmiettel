/**
 * OpenMoji codepoint & URL helpers — single source of truth for converting
 * between emoji characters and OpenMoji hex codes and for building asset URLs.
 *
 *   "🍎"      → "1F34E"
 *   "🫐"      → "1FAD0"
 *   "🏳️‍🌈"  → "1F3F3-200D-1F308"   (variation selector FE0F stripped)
 */

const OPENMOJI_VERSION = '15.1.0'
const OPENMOJI_BASE = `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@${OPENMOJI_VERSION}`

/** Convert an emoji character to an uppercase OpenMoji hex code. */
export function emojiToHex(emoji) {
    if (!emoji) return ''
    const out = []
    for (const ch of emoji) {
        const cp = ch.codePointAt(0)
        if (cp === 0xfe0f) continue // variation selector-16
        out.push(cp.toString(16).toUpperCase())
    }
    return out.join('-')
}

/**
 * Normalise any icon id (OpenMoji hex string *or* emoji char) into the
 * canonical uppercase hex form used for filenames.
 */
export function normaliseIcon(idOrEmoji) {
    if (!idOrEmoji) return ''
    if (/^[0-9A-Fa-f-]+$/.test(idOrEmoji)) return idOrEmoji.toUpperCase()
    return emojiToHex(idOrEmoji)
}

/**
 * Build an OpenMoji SVG URL.
 *
 * @param {string} idOrEmoji       OpenMoji hex code ("1F34E") or emoji char ("🍎")
 * @param {'black'|'color'} [variant='black']
 */
export function openMojiUrl(idOrEmoji, variant = 'black') {
    const hex = normaliseIcon(idOrEmoji)
    if (!hex) return ''
    return `${OPENMOJI_BASE}/${variant}/svg/${hex}.svg`
}

/** Monochrome outline (for themed avatars). */
export function openMojiBlackUrl(idOrEmoji) {
    return openMojiUrl(idOrEmoji, 'black')
}

/** Full-color variant (for illustration). */
export function openMojiColorUrl(idOrEmoji) {
    return openMojiUrl(idOrEmoji, 'color')
}

// Legacy alias so existing imports keep working.
export const emojiToCodepoint = emojiToHex
