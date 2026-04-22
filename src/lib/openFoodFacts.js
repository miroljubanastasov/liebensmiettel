/**
 * Open Food Facts API helper
 * All fields are nullable — OFF coverage varies by product.
 */
import { supabase } from './supabase'
import { classifyProduct } from '../utils/classify'

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/product'

/** Columns stored in the products table (must match the DB schema). */
const DB_FIELDS = [
    'ean', 'name', 'brand', 'quantity', 'image_url',
    'categories', 'labels', 'allergens', 'ingredients',
    'nutriscore', 'ecoscore', 'nova_group',
    'energy_kcal', 'fat_g', 'saturated_fat_g', 'carbs_g',
    'sugars_g', 'fiber_g', 'protein_g', 'salt_g',
    'origin', 'serving_size', 'off_complete',
    'category', 'subcategory',
]

/**
 * Pick only the fields that go into the `products` table.
 */
function toDbRow(product) {
    const row = {}
    for (const key of DB_FIELDS) {
        if (key in product) row[key] = product[key]
    }
    return row
}

/**
 * Upsert a product into the global products table.
 * - New EAN → insert
 * - Existing EAN → update only if any column changed
 */
export async function upsertProduct(product) {
    if (!product?.ean) return

    // Auto-classify from OFF taxonomy tags
    if (!product.category && product.categories?.length) {
        const classified = classifyProduct({
            name: product.name || '',
            brand: product.brand || '',
            categories: product.categories,
        })
        product.category = classified.category
        product.subcategory = classified.subcategory || null
    }

    const row = toDbRow(product)
    row.updated_at = new Date().toISOString()

    try {
        const { error } = await supabase
            .from('products')
            .upsert(row, { onConflict: 'ean' })

        if (error) {
            console.error('[upsertProduct] Supabase error:', error.message, error)
        }
    } catch (err) {
        console.error('[upsertProduct] unexpected error:', err)
    }
}

export async function lookupEAN(ean) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
        const res = await fetch(`${OFF_BASE}/${ean}.json`, { signal: controller.signal })
        clearTimeout(timeout)
        if (!res.ok) return null

        const data = await res.json()
        if (data.status !== 1) return null

        const p = data.product
        const n = p.nutriments ?? {}

        return {
            ean,
            // ── Identity ────────────────────────────────────────────────────────
            name: p.product_name || p.product_name_en || p.product_name_de || null,
            brand: p.brands || null,
            quantity: p.quantity || null,
            serving_size: p.serving_size || null,
            origin: p.origins || null,

            // ── Images ──────────────────────────────────────────────────────────
            image_url: p.image_front_url || null,
            image_ingredients_url: p.image_ingredients_url || null,
            image_nutrition_url: p.image_nutrition_url || null,

            // ── Classification ──────────────────────────────────────────────────
            categories: p.categories_tags || [],
            labels: p.labels_tags || [],       // en:organic, en:vegan, etc.
            allergens: p.allergens_tags || [],    // en:gluten, en:milk, etc.

            // ── Scores ──────────────────────────────────────────────────────────
            nutriscore: p.nutriscore_grade || null,   // a–e
            ecoscore: p.ecoscore_grade || null,     // a–e
            nova_group: p.nova_group || null,          // 1–4

            // ── Nutrients per 100 g ─────────────────────────────────────────────
            energy_kcal: n['energy-kcal_100g'] ?? null,
            fat_g: n.fat_100g ?? null,
            saturated_fat_g: n['saturated-fat_100g'] ?? null,
            carbs_g: n.carbohydrates_100g ?? null,
            sugars_g: n.sugars_100g ?? null,
            fiber_g: n.fiber_100g ?? null,
            protein_g: n.proteins_100g ?? null,
            salt_g: n.salt_100g ?? null,

            // ── Ingredients ─────────────────────────────────────────────────────
            ingredients: p.ingredients_text || null,

            off_complete: !!(p.product_name && p.nutriscore_grade && p.nutriments),
        }
    } catch (err) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
            console.warn('[lookupEAN] Request timed out for', ean)
        }
        return null
    }
}
