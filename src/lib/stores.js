/**
 * Stores + store chain directory helpers.
 */
import { supabase } from './supabase'
import {
    STORE_CHAINS,
    STORE_CHAIN_ALIAS_INDEX,
    normalizeChainKey,
    getStoreChain,
} from '../data/storeChains.js'

/**
 * Hydrate a raw `stores` row with `chain_data` so the UI can render a logo
 * even when the DB join missed (legacy `chain_id=null`, hosted project not
 * seeded, OCR'd name that bypassed alias lookup at insert time).
 *
 * Resolution order:
 *   1. Existing chain_data from the DB join (preferred)
 *   2. JS catalogue keyed on chain_id
 *   3. JS alias lookup against the legacy `chain` text column
 *   4. JS alias lookup against the store name itself
 */
function hydrateStoreRow(row) {
    if (!row) return row
    if (row.chain_data) return row
    let resolved = null
    if (row.chain_id) resolved = getStoreChain(row.chain_id)
    if (!resolved && row.chain) {
        const id = findChainByName(row.chain)
        if (id) resolved = getStoreChain(id)
    }
    if (!resolved && row.name) {
        const id = findChainByName(row.name)
        if (id) resolved = getStoreChain(id)
    }
    if (!resolved) return row
    return {
        ...row,
        chain_id: row.chain_id ?? resolved.id,
        chain_data: {
            id: resolved.id,
            name: resolved.name,
            logo_url: resolved.logo_url ?? null,
            color: resolved.color ?? null,
        },
    }
}

/**
 * Fetch all stores (with optional chain data) for the store picker.
 * Sorted by chain, then name. Each row is hydrated client-side so logos
 * show up even when the DB-side chain link is missing.
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
    return (data ?? []).map(hydrateStoreRow)
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
 * Find-or-create a store, normalizing to one canonical row per chain.
 *
 * Behaviour:
 *  - If the caller doesn't pass `chain_id`, we resolve it from `name` via
 *    `findChainByName()` (so receipt OCR + manual "Lidl Mitte" both land on
 *    the same chain).
 *  - When a chain resolves, we **store the canonical chain name** (e.g.
 *    "Lidl") and drop address/city. This collapses "Lidl Mitte", "Lidl
 *    Center" etc. into a single row, which is the strategy for now —
 *    address is not in focus and the picker dedupes by chain anyway.
 *  - When no chain resolves (truly custom store, e.g. a small local shop),
 *    we keep the user-typed name verbatim and the (name, address) unique
 *    constraint still allows multiple rows if needed.
 *  - On hosted projects without a seeded `store_chains` table we retry the
 *    insert without the FK so the entry can still be saved.
 *
 * Returns the row (with hydrated `chain_data` when applicable) or null.
 */
export async function upsertStore({ name, address = null, city = null, chain_id = null }) {
    if (!name?.trim()) return null

    // 1. Resolve chain when caller didn't pass one.
    let resolvedChainId = chain_id
    if (!resolvedChainId) resolvedChainId = findChainByName(name)

    // 2. Normalize: when we know the chain, use the canonical name and drop
    //    address — we want one row per chain, not per location.
    let cleanName = name.trim()
    let cleanAddress = address
    let cleanCity = city
    if (resolvedChainId) {
        const chain = getStoreChain(resolvedChainId)
        if (chain?.name) cleanName = chain.name
        cleanAddress = null
        cleanCity = null
    }

    // 3. Find existing row. With chain set, match on chain_id (primary
    //    dedup key). Without, fall back to the legacy name match.
    if (resolvedChainId) {
        const { data: existing } = await supabase
            .from('stores')
            .select(`
                id, name, chain, chain_id, address, city,
                chain_data:store_chains ( id, name, logo_url, color )
            `)
            .eq('chain_id', resolvedChainId)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle()
        if (existing) return hydrateStoreRow(existing)
    } else {
        const { data: existing } = await supabase
            .from('stores')
            .select(`
                id, name, chain, chain_id, address, city,
                chain_data:store_chains ( id, name, logo_url, color )
            `)
            .eq('name', cleanName)
            .maybeSingle()
        if (existing) return hydrateStoreRow(existing)
    }

    // 4. Insert. Retry without chain_id if the hosted project hasn't seeded
    //    the `store_chains` table yet (FK violation).
    const insert = (chainIdValue) => supabase
        .from('stores')
        .insert({ name: cleanName, address: cleanAddress, city: cleanCity, chain_id: chainIdValue })
        .select(`
            id, name, chain, chain_id, address, city,
            chain_data:store_chains ( id, name, logo_url, color )
        `)
        .single()

    let { data, error } = await insert(resolvedChainId)

    if (error && resolvedChainId && /foreign key|store_chains_pkey|chain_id_fkey/i.test(error.message)) {
        console.warn('[upsertStore] chain_id FK failed, retrying without chain:', error.message)
        const retry = await insert(null)
        data = retry.data
        error = retry.error
    }

    if (error) {
        console.error('[upsertStore]', error.message)
        return null
    }
    return hydrateStoreRow(data)
}
