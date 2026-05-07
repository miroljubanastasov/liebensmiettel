/**
 * useRecentEntries — returns distinct recent names/brands/locations/units
 * from the user's product_entries history.
 *
 * Used to power cross-field autocomplete in ManualAddDialog so we can
 * suggest from "what you typed before" rather than only the static catalogue.
 *
 * One fetch per dialog-open is plenty; we trim to the N most-recent rows
 * and deduplicate client-side.
 */

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

const FETCH_LIMIT = 500

export function useRecentEntries({ enabled = true } = {}) {
    const user = useAuthStore((s) => s.user)
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!enabled) return
        let cancelled = false
        setLoading(true)
        let query = supabase
            .from('product_entries')
            .select('name, brand, category, subcategory, unit, location, ean, store_id')
            .order('created_at', { ascending: false })
            .limit(FETCH_LIMIT)
        if (user) query = query.eq('user_id', user.id)
        query.then(({ data }) => {
            if (cancelled) return
            setRows(Array.isArray(data) ? data : [])
            setLoading(false)
        })
        return () => { cancelled = true }
    }, [user, enabled])

    return { entries: rows, loading }
}

/**
 * Returns distinct non-empty recent names, optionally filtered by category,
 * ordered by most-frequently-used first, then most-recent. Each entry
 * includes enough context to auto-fill related fields on selection.
 *
 * `entries` is expected to be sorted recency-first (newest → oldest), as
 * produced by `useRecentEntries`. The first time we see a key is therefore
 * also the most-recent occurrence — we capture that row plus a running
 * count, then sort by [count desc, recency asc].
 */
export function pickRecentNames(entries, { category } = {}) {
    const map = new Map()
    entries.forEach((row, idx) => {
        if (!row?.name) return
        if (category && row.category && row.category !== category) return
        const key = row.name.trim().toLowerCase()
        if (!key) return
        const existing = map.get(key)
        if (existing) {
            existing.count += 1
        } else {
            map.set(key, { row, firstIndex: idx, count: 1 })
        }
    })
    return [...map.values()]
        .sort((a, b) => b.count - a.count || a.firstIndex - b.firstIndex)
        .map((e) => e.row)
}

/** Distinct recent brand names, most-common first then freshest. */
export function pickRecentBrands(entries) {
    const map = new Map()
    entries.forEach((row, idx) => {
        const b = row?.brand?.trim()
        if (!b) return
        const key = b.toLowerCase()
        const existing = map.get(key)
        if (existing) {
            existing.count += 1
        } else {
            map.set(key, { value: b, firstIndex: idx, count: 1 })
        }
    })
    return [...map.values()]
        .sort((a, b) => b.count - a.count || a.firstIndex - b.firstIndex)
        .map((e) => e.value)
}

/**
 * Recent store_ids ordered by usage frequency (most common first) then
 * recency. Returns an array of UUIDs; resolve to store objects at the
 * call site.
 */
export function pickRecentStoreIds(entries) {
    const map = new Map()
    entries.forEach((row, idx) => {
        const id = row?.store_id
        if (!id) return
        const existing = map.get(id)
        if (existing) {
            existing.count += 1
        } else {
            map.set(id, { id, firstIndex: idx, count: 1 })
        }
    })
    return [...map.values()]
        .sort((a, b) => b.count - a.count || a.firstIndex - b.firstIndex)
        .map((e) => e.id)
}
