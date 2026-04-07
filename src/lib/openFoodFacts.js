/**
 * Open Food Facts API helper
 * All fields are nullable — see tier breakdown in project notes.
 */
const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/product'

export async function lookupEAN(ean) {
  const res = await fetch(`${OFF_BASE}/${ean}.json`)
  if (!res.ok) return null

  const data = await res.json()
  if (data.status !== 1) return null

  const p = data.product
  return {
    ean,
    name: p.product_name || null,
    brand: p.brands || null,
    quantity: p.quantity || null,
    image_url: p.image_front_url || null,
    categories: p.categories_tags || [],
    labels: p.labels_tags || [],
    ingredients: p.ingredients_text || null,
    nutriscore: p.nutriscore_grade || null,
    ecoscore: p.ecoscore_grade || null,
    nova_group: p.nova_group || null,
    energy_kcal: p.nutriments?.['energy-kcal_100g'] ?? null,
    fat_g: p.nutriments?.fat_100g ?? null,
    carbs_g: p.nutriments?.carbohydrates_100g ?? null,
    protein_g: p.nutriments?.proteins_100g ?? null,
    off_complete: !!(p.product_name && p.nutriscore_grade && p.nutriments),
  }
}
