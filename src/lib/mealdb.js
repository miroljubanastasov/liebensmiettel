const API_KEY = '777b3d24ca8546c58d4ad98634783e8b'
const BASE = 'https://api.spoonacular.com'

async function fetchJson(url) {
    const sep = url.includes('?') ? '&' : '?'
    const res = await fetch(`${url}${sep}apiKey=${API_KEY}`)
    if (!res.ok) throw new Error(`Spoonacular ${res.status}`)
    return res.json()
}

/**
 * Find recipes that maximize use of given ingredients.
 * Returns array with usedIngredients, missedIngredients, etc.
 */
export async function findByIngredients(ingredients, number = 12) {
    const csv = ingredients.join(',')
    return fetchJson(
        `${BASE}/recipes/findByIngredients?ingredients=${encodeURIComponent(csv)}&number=${number}&ranking=1&ignorePantry=true`
    )
}

/** Search recipes by query string */
export async function searchRecipes(query, number = 12) {
    const data = await fetchJson(
        `${BASE}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${number}&addRecipeInformation=true`
    )
    return data.results ?? []
}

/** Get a random recipe */
export async function getRandomRecipe() {
    const data = await fetchJson(`${BASE}/recipes/random?number=1`)
    return data.recipes?.[0] ?? null
}

/** Get full recipe info by ID */
export async function getRecipeInfo(id) {
    return fetchJson(`${BASE}/recipes/${id}/information`)
}

/** Get recipe summary (HTML) by ID */
export async function getRecipeSummary(id) {
    return fetchJson(`${BASE}/recipes/${id}/summary`)
}

/** Build Spoonacular CDN image URL for an ingredient */
export function ingredientImageUrl(imageName) {
    if (!imageName) return ''
    return `https://img.spoonacular.com/ingredients_100x100/${imageName}`
}

/** Build recipe image URL at a given size */
export function recipeImageUrl(id, size = '312x231') {
    return `https://img.spoonacular.com/recipes/${id}-${size}.jpg`
}
