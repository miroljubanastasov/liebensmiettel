/**
 * Maps German product names / keywords to English ingredient terms
 * that TheMealDB understands.
 *
 * Primary source: SUBCATEGORIES registry (ingredientEN field).
 * Product-level overrides handle cases where a specific product differs
 * from its subcategory's generic ingredient (e.g. "Lachsfilet" → "salmon"
 * while subcategory "Frischer Fisch" → "fish").
 *
 * `translateToIngredient()` scans the product name for the first match.
 */

import SUBCATEGORIES from '../data/subcategories.js'
import PRODUCT_CATALOGUE from '../data/productCatalogue.js'

// ─── Product-level overrides (keyword → English) ─────────────────────────────
// These take priority over subcategory-level translations.
const PRODUCT_OVERRIDES = [
    // Dairy specifics
    ['frischkäse', 'cream cheese'],
    ['mozzarella', 'mozzarella'],
    ['parmesan', 'parmesan'],
    ['mascarpone', 'mascarpone'],
    ['ricotta', 'ricotta'],
    ['feta', 'feta'],

    // Fruits & Veg specifics
    ['karotten', 'carrots'],
    ['möhren', 'carrots'],
    ['spinat', 'spinach'],
    ['zitronen', 'lemon'],
    ['limetten', 'lime'],
    ['brokkoli', 'broccoli'],
    ['erdbeeren', 'strawberries'],
    ['heidelbeeren', 'blueberries'],
    ['himbeeren', 'raspberries'],
    ['tomaten', 'tomatoes'],
    ['paprika', 'pepper'],
    ['avocado', 'avocado'],
    ['äpfel', 'apples'],
    ['birnen', 'pears'],
    ['bananen', 'banana'],
    ['kartoffel', 'potato'],
    ['süßkartoffel', 'sweet potato'],
    ['zwiebel', 'onion'],
    ['knoblauch', 'garlic'],
    ['gurke', 'cucumber'],
    ['zucchini', 'zucchini'],
    ['mais', 'corn'],
    ['erbsen', 'peas'],
    ['bohnen', 'beans'],
    ['linsen', 'lentils'],
    ['kichererbsen', 'chickpeas'],
    ['champignon', 'mushrooms'],
    ['pilze', 'mushrooms'],
    ['ingwer', 'ginger'],

    // Meat & Fish specifics
    ['rindersteak', 'beef'],
    ['rindfleisch', 'beef'],
    ['rinder', 'beef'],
    ['hackfleisch', 'mince'],
    ['hähnchen', 'chicken'],
    ['huhn', 'chicken'],
    ['pute', 'turkey'],
    ['schwein', 'pork'],
    ['lamm', 'lamb'],
    ['garnelen', 'prawns'],
    ['lachs', 'salmon'],
    ['thunfisch', 'tuna'],
    ['sardinen', 'sardines'],
    ['kabeljau', 'cod'],
    ['forelle', 'trout'],
    ['fisch', 'fish'],
    ['schinken', 'ham'],
    ['salami', 'salami'],
    ['wurst', 'sausage'],
    ['speck', 'bacon'],

    // Grains & Baking specifics
    ['haferflocken', 'oats'],
    ['reis', 'rice'],
    ['couscous', 'couscous'],
    ['quinoa', 'quinoa'],
    ['bulgur', 'bulgur'],
    ['mehl', 'flour'],
    ['nudel', 'pasta'],
    ['spaghetti', 'spaghetti'],
    ['penne', 'penne'],
    ['brot', 'bread'],
    ['toast', 'bread'],
    ['backpulver', 'baking powder'],

    // Condiments & pantry specifics
    ['olivenöl', 'olive oil'],
    ['öl', 'oil'],
    ['essig', 'vinegar'],
    ['balsamico', 'balsamic vinegar'],
    ['ketchup', 'ketchup'],
    ['senf', 'mustard'],
    ['sojasauce', 'soy sauce'],
    ['tamari', 'soy sauce'],
    ['worcestershire', 'worcestershire sauce'],
    ['sriracha', 'hot sauce'],
    ['mayonnaise', 'mayonnaise'],
    ['honig', 'honey'],
    ['zucker', 'sugar'],
    ['salz', 'salt'],
    ['pfeffer', 'pepper'],
    ['basilikum', 'basil'],
    ['petersilie', 'parsley'],
    ['koriander', 'coriander'],
    ['rosmarin', 'rosemary'],
    ['thymian', 'thyme'],
    ['oregano', 'oregano'],
    ['zimt', 'cinnamon'],
    ['kurkuma', 'turmeric'],
    ['kreuzkümmel', 'cumin'],

    // Snacks & other specifics
    ['schokolade', 'chocolate'],
    ['erdnussbutter', 'peanut butter'],
    ['cashew', 'cashew nuts'],
    ['nuss', 'nuts'],
    ['mandel', 'almonds'],
    ['kokosnuss', 'coconut'],
    ['popcorn', 'popcorn'],

    // Canned / Ready specifics
    ['tomatensuppe', 'tomato soup'],
    ['pizza', 'pizza'],
    ['lasagne', 'lasagne'],
    ['curry', 'curry'],
    ['suppe', 'soup'],
    ['kidney', 'kidney beans'],
    ['edamame', 'edamame'],
    ['tofu', 'tofu'],
    ['tempeh', 'tempeh'],
]

// ─── Build subcategory-derived keyword map ───────────────────────────────────
// For each subcategory with an ingredientEN, create a keyword from the
// subcategory's German name (lowercased) → its English ingredient.
const SUBCATEGORY_KEYWORDS = []
for (const sub of SUBCATEGORIES) {
    if (!sub.ingredientEN) continue
    // Extract simple keyword from subcategory name
    // e.g. "Milch" → "milch", "Käse — Schnitt- & Hartkäse" → "käse"
    const nameLower = sub.name.toLowerCase()
    // Use the first word as keyword (handles compound names like "Käse — Weichkäse")
    const firstWord = nameLower.split(/[\s—\-&]/)[0].trim()
    if (firstWord.length >= 3) {
        SUBCATEGORY_KEYWORDS.push([firstWord, sub.ingredientEN])
    }
}

// Combined map: overrides first (higher priority), then subcategory-derived
const DE_TO_EN = [...PRODUCT_OVERRIDES, ...SUBCATEGORY_KEYWORDS]

/**
 * Translate a German product name to an English ingredient for MealDB lookup.
 * Returns null if no mapping is found.
 */
export function translateToIngredient(name) {
    const lower = name.toLowerCase()
    for (const [de, en] of DE_TO_EN) {
        if (lower.includes(de)) return en
    }
    return null
}

/**
 * Given an array of German product names, return unique English ingredient terms.
 */
export function translatePantryNames(names) {
    const seen = new Set()
    const result = []
    for (const name of names) {
        const en = translateToIngredient(name)
        if (en && !seen.has(en)) {
            seen.add(en)
            result.push(en)
        }
    }
    return result
}
