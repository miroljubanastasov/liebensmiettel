/**
 * Stores + store chain directory helpers.
 */
import { supabase } from './supabase'
import {
    STORE_CHAINS,
    STORE_CHAIN_ALIAS_INDEX,
    normalizeChainKey,
} from '../data/storeChains.js'

/**
 * Fetch all stores (with optional chain data) for the store picker.
 * Sorted by chain, then name.
 */
export async function listStores() {
    const { data, error } = await supabase
        .from('stores')
        .select(`
            id, name, chain, chain_id, address, city,
            chain_data:store_chains ( id, name, logo_url, color )
        `)
        .order('chain', { ascending: true, nullsFirst: false })
        .order('name', { ascending: true })

    if (error) {
        console.error('[listStores]', error.message)
        return []
    }
    return data ?? []
}

/**
 * Fetch the fixed chain catalogue. Falls back to the bundled JS list
 * when Supabase returns no rows (useful during dev before `supabase db reset`
 * has seeded the table).
 */
export async function listStoreChains() {
    const { data, error } = await supabase
        .from('store_chains')
        .select('id, name, logo_url, color')
        .order('name')

    if (error) {
        console.warn('[listStoreChains] DB unavailable, using JS fallback:', error.message)
        return STORE_CHAINS.map(({ id, name, logo_url, color }) => ({ id, name, logo_url, color }))
    }
    if (!data?.length) {
        return STORE_CHAINS.map(({ id, name, logo_url, color }) => ({ id, name, logo_url, color }))
    }
    return data
}

/**
 * Resolve a free-form store name (e.g. OCR'd from a receipt header, or
 * typed by the user) to a canonical `store_chains.id`. Returns null if
 * nothing plausible matches.
 *
 * Strategy: exact alias lookup → substring scan over normalized aliases.
 */
export function findChainByName(raw) {
    const key = normalizeChainKey(raw)
    if (!key) return null

    // 1. Exact alias hit
    const direct = STORE_CHAIN_ALIAS_INDEX.get(key)
    if (direct) return direct

    // 2. Substring scan — the raw name contains a known alias as a token.
    //    Longer aliases win (avoids 'aldi' swallowing 'aldi sued').
    const tokens = key.split(' ')
    let best = null
    let bestLen = 0
    for (const [aliasKey, id] of STORE_CHAIN_ALIAS_INDEX) {
        const aliasTokens = aliasKey.split(' ')
        if (aliasTokens.length > tokens.length) continue
        // check if aliasTokens appears as a contiguous run in tokens
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
    return best
}

/**
 * Find-or-create a store by name (+ optional address).
 * Returns { id, ... } or null.
 */
export async function upsertStore({ name, address = null, city = null, chain_id = null }) {
    if (!name?.trim()) return null
    const cleanName = name.trim()

    // Try to find an existing match (name + address combination)
    const { data: existing } = await supabase
        .from('stores')
        .select('id, name, chain, chain_id, address, city')
        .eq('name', cleanName)
        .maybeSingle()
    if (existing) return existing

    const { data, error } = await supabase
        .from('stores')
        .insert({ name: cleanName, address, city, chain_id })
        .select('id, name, chain, chain_id, address, city')
        .single()
    if (error) {
        console.error('[upsertStore]', error.message)
        return null
    }
    return data
}
