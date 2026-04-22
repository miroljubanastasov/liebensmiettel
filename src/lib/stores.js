/**
 * Stores + store chain directory helpers.
 */
import { supabase } from './supabase'

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
 * Fetch the fixed chain catalogue.
 */
export async function listStoreChains() {
    const { data, error } = await supabase
        .from('store_chains')
        .select('id, name, logo_url, color')
        .order('name')

    if (error) {
        console.error('[listStoreChains]', error.message)
        return []
    }
    return data ?? []
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
