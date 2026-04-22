/**
 * Shared formatting helpers.
 */

/** Format a number as Euro price, e.g. "€12.50". Returns "—" for null/undefined. */
export function formatPrice(n) {
    if (n == null) return '—'
    return `€${Number(n).toFixed(2)}`
}

/** Format an ISO date string as de-DE locale date, e.g. "08.04.2026". Returns "—" for falsy. */
export function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('de-DE')
}
