import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { classifyProduct } from '../utils/classify'

/**
 * Reads and writes product_entries for a given status scope.
 * @param {'listed'|'in_pantry'} status
 */
export function useProductEntries(status) {
    const user = useAuthStore((s) => s.user)
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        let query = supabase
            .from('product_entries')
            .select(`
                *,
                store:stores (
                    id, name, chain, chain_id,
                    chain_data:store_chains ( id, name, logo_url, color )
                )
            `)
            .eq('status', status)
            .order('created_at', { ascending: false })

        if (user) {
            query = query.eq('user_id', user.id)
        }

        const { data, error: err } = await query
        if (err) {
            setError(err.message)
            setLoading(false)
            return
        }

        // Enrich entries that have an EAN with product data (labels + nutrition)
        const rows = data ?? []
        const eans = [...new Set(rows.map((r) => r.ean).filter(Boolean))]
        if (eans.length > 0) {
            const { data: prods } = await supabase
                .from('products')
                .select('ean, category, subcategory, nutriscore, ecoscore, nova_group, labels, allergens, energy_kcal, fat_g, saturated_fat_g, carbs_g, sugars_g, fiber_g, protein_g, salt_g')
                .in('ean', eans)
            if (prods) {
                const map = Object.fromEntries(prods.map((p) => [p.ean, p]))
                for (const row of rows) {
                    const prod = row.ean && map[row.ean]
                    if (prod) {
                        row.category = row.category ?? prod.category
                        row.subcategory = row.subcategory ?? prod.subcategory
                        row.nutriscore = row.nutriscore ?? prod.nutriscore
                        row.ecoscore = row.ecoscore ?? prod.ecoscore
                        row.nova_group = row.nova_group ?? prod.nova_group
                        row.labels = prod.labels
                        row.allergens = prod.allergens
                        row.nutrition = {
                            energy_kcal: prod.energy_kcal,
                            fat_g: prod.fat_g,
                            saturated_fat_g: prod.saturated_fat_g,
                            carbs_g: prod.carbs_g,
                            sugars_g: prod.sugars_g,
                            fiber_g: prod.fiber_g,
                            protein_g: prod.protein_g,
                            salt_g: prod.salt_g,
                        }
                    }
                }
            }
        }

        setEntries(rows)
        setLoading(false)
    }, [status, user])

    useEffect(() => { fetch() }, [fetch])

    /**
     * Add a new entry.
     * @param {object} fields — name, brand, category, quantity, unit,
     *                          location, expiry_date, notes, entry_source
     */
    const addEntry = useCallback(async (fields) => {
        // Classify if category or subcategory is missing
        if ((!fields.category || !fields.subcategory) && fields.name) {
            const classified = classifyProduct({
                name: fields.name,
                brand: fields.brand || '',
                categories: fields.categories || [],
            })
            if (!fields.category && classified.category) {
                fields = { ...fields, category: classified.category }
            }
            if (!fields.subcategory && classified.subcategory) {
                fields = { ...fields, subcategory: classified.subcategory }
            }
        }

        const now = new Date().toISOString()
        const row = {
            ...fields,
            status,
            user_id: user?.id ?? null,
            entry_source: fields.entry_source ?? 'manual',
            listed_at: status === 'listed' ? now : null,
            shelved_at: status === 'in_pantry' ? now : null,
        }

        const { data, error: err } = await supabase
            .from('product_entries')
            .insert(row)
            .select()
            .single()

        if (err) return { ok: false, error: err.message }

        // Enrich with product-level data (labels + nutrition) so the new row
        // shows up fully populated without waiting for a page refresh.
        let enriched = data
        if (data?.ean) {
            const { data: prod } = await supabase
                .from('products')
                .select('ean, category, subcategory, nutriscore, ecoscore, nova_group, labels, allergens, energy_kcal, fat_g, saturated_fat_g, carbs_g, sugars_g, fiber_g, protein_g, salt_g')
                .eq('ean', data.ean)
                .maybeSingle()
            if (prod) {
                enriched = {
                    ...data,
                    category: data.category ?? prod.category,
                    subcategory: data.subcategory ?? prod.subcategory,
                    nutriscore: data.nutriscore ?? prod.nutriscore,
                    ecoscore: data.ecoscore ?? prod.ecoscore,
                    nova_group: data.nova_group ?? prod.nova_group,
                    labels: prod.labels,
                    allergens: prod.allergens,
                    nutrition: {
                        energy_kcal: prod.energy_kcal,
                        fat_g: prod.fat_g,
                        saturated_fat_g: prod.saturated_fat_g,
                        carbs_g: prod.carbs_g,
                        sugars_g: prod.sugars_g,
                        fiber_g: prod.fiber_g,
                        protein_g: prod.protein_g,
                        salt_g: prod.salt_g,
                    },
                }
            }
        }

        setEntries((prev) => [enriched, ...prev])
        return { ok: true, data: enriched }
    }, [status, user])

    /**
     * Update arbitrary fields on an entry.
     */
    const updateEntry = useCallback(async (id, fields) => {
        const { error: err } = await supabase
            .from('product_entries')
            .update(fields)
            .eq('id', id)
        if (err) return false
        setEntries((prev) => prev.map((e) => e.id === id ? { ...e, ...fields } : e))
        return true
    }, [])

    /**
     * Hard-delete an entry (dispose).
     */
    const disposeEntry = useCallback(async (id) => {
        const { error: err } = await supabase
            .from('product_entries')
            .delete()
            .eq('id', id)
        if (err) return false
        setEntries((prev) => prev.filter((e) => e.id !== id))
        return true
    }, [])

    /**
     * Soft-remove: consumed (pantry) or unchecked delete (list).
     */
    const removeEntry = useCallback(async (id) => {
        if (status === 'in_pantry') {
            const { error: err } = await supabase
                .from('product_entries')
                .update({ status: 'consumed', consumed_at: new Date().toISOString() })
                .eq('id', id)
            if (err) return false
        } else {
            const { error: err } = await supabase
                .from('product_entries')
                .delete()
                .eq('id', id)
            if (err) return false
        }
        setEntries((prev) => prev.filter((e) => e.id !== id))
        return true
    }, [status])

    /**
     * Toggle checked state (grocery list items).
     */
    const toggleChecked = useCallback(async (id, checked) => {
        const { error: err } = await supabase
            .from('product_entries')
            .update({ checked })
            .eq('id', id)
        if (err) return false
        setEntries((prev) => prev.map((e) => e.id === id ? { ...e, checked } : e))
        return true
    }, [])

    /**
     * Local-only patch: merges fields into the in-memory entry without
     * writing to Supabase. Useful for hydrating related data (e.g. nested
     * store/chain_data) after a foreign-key update.
     */
    const patchEntry = useCallback((id, fields) => {
        setEntries((prev) => prev.map((e) => e.id === id ? { ...e, ...fields } : e))
    }, [])

    /**
     * Change an entry's status (e.g. 'listed' → 'in_pantry'). Updates
     * Supabase with the new status plus any extra fields, then removes
     * the row from local state since it no longer matches this hook's
     * status scope.
     */
    const moveEntry = useCallback(async (id, newStatus, extraFields = {}) => {
        const payload = { status: newStatus, ...extraFields }
        const { error: err } = await supabase
            .from('product_entries')
            .update(payload)
            .eq('id', id)
        if (err) return false
        setEntries((prev) => prev.filter((e) => e.id !== id))
        return true
    }, [])

    return { entries, loading, error, addEntry, updateEntry, removeEntry, disposeEntry, toggleChecked, patchEntry, moveEntry, refetch: fetch }
}
