/**
 * Subcategory Registry — single source of truth for the 3-level product taxonomy.
 *
 *  Level 1: Category      (e.g. "Dairy & Eggs")
 *  Level 2: Subcategory   (this file — e.g. "Milch", "Joghurt", "Reis")
 *  Level 3: Product       (PRODUCT_CATALOGUE entries)
 *
 * Each subcategory defines:
 *  - id            stable slug for DB storage & lookups
 *  - name          German display name (matches subcategory field in PRODUCT_CATALOGUE)
 *  - category      parent category
 *  - emoji         human-readable icon token (doubles as the default OpenMoji asset)
 *  - icon?         optional OpenMoji hex override (e.g. '1FAD0') when the emoji
 *                  maps to a weak glyph in OpenMoji's black set and we want a
 *                  specific alternative. Leave blank to derive from `emoji`.
 *  - ingredientEN  English term for TheMealDB recipe lookups
 */

import { normaliseIcon } from '../utils/emojiCodepoint.js'

const SUBCATEGORIES = [
    // ═════════════════════════════════════════════════════════════════════════
    // DAIRY & EGGS
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'milch', name: 'Milch', category: 'Dairy & Eggs', emoji: '🥛', ingredientEN: 'milk' },
    { id: 'joghurt', name: 'Joghurt', category: 'Dairy & Eggs', emoji: '🫙', ingredientEN: 'yoghurt' },
    { id: 'quark', name: 'Quark', category: 'Dairy & Eggs', emoji: '🫙', ingredientEN: 'quark' },
    { id: 'milchdesserts', name: 'Milchdesserts', category: 'Dairy & Eggs', emoji: '🍮', ingredientEN: 'pudding' },
    { id: 'fermentierte-milch', name: 'Fermentierte Milch', category: 'Dairy & Eggs', emoji: '🥛', ingredientEN: 'kefir' },
    { id: 'schnitt-hartkaese', name: 'Käse — Schnitt- & Hartkäse', category: 'Dairy & Eggs', emoji: '🧀', ingredientEN: 'cheese' },
    { id: 'weichkaese', name: 'Käse — Weichkäse', category: 'Dairy & Eggs', emoji: '🧀', ingredientEN: 'cheese' },
    { id: 'frischkaese', name: 'Käse — Frischkäse & Aufstrich', category: 'Dairy & Eggs', emoji: '🧀', ingredientEN: 'cream cheese' },
    { id: 'italienischer-kaese', name: 'Käse — Italienisch', category: 'Dairy & Eggs', emoji: '🧀', ingredientEN: 'mozzarella' },
    { id: 'kaese-sonstiges', name: 'Käse — Sonstiges', category: 'Dairy & Eggs', emoji: '🧀', ingredientEN: 'cheese' },
    { id: 'butter-margarine', name: 'Butter & Margarine', category: 'Dairy & Eggs', emoji: '🧈', ingredientEN: 'butter' },
    { id: 'sahne-creme', name: 'Sahne & Crème', category: 'Dairy & Eggs', emoji: '🥛', ingredientEN: 'cream' },
    { id: 'eier', name: 'Eier', category: 'Dairy & Eggs', emoji: '🥚', ingredientEN: 'eggs' },

    // ═════════════════════════════════════════════════════════════════════════
    // FRUITS & VEG
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'kernobst', name: 'Frisches Obst — Kernobst', category: 'Fruits & Veg', emoji: '🍎', ingredientEN: 'apples' },
    { id: 'zitrusfruechte', name: 'Frisches Obst — Zitrusfrüchte', category: 'Fruits & Veg', emoji: '🍊', ingredientEN: 'oranges' },
    { id: 'tropisches-obst', name: 'Frisches Obst — Bananen & Tropisch', category: 'Fruits & Veg', emoji: '🍌', ingredientEN: 'banana' },
    { id: 'beeren', name: 'Frisches Obst — Beeren', category: 'Fruits & Veg', emoji: '🍓', ingredientEN: 'berries' },
    { id: 'steinobst', name: 'Frisches Obst — Steinobst', category: 'Fruits & Veg', emoji: '🍑', ingredientEN: 'peaches' },
    { id: 'trauben-melonen', name: 'Frisches Obst — Trauben & Melonen', category: 'Fruits & Veg', emoji: '🍇', ingredientEN: 'grapes' },
    { id: 'obst-sonstiges', name: 'Frisches Obst — Sonstiges', category: 'Fruits & Veg', emoji: '🥝', ingredientEN: 'fruit' },
    { id: 'obstkonserven', name: 'Obstkonserven', category: 'Fruits & Veg', emoji: '🥫', ingredientEN: 'canned fruit' },
    { id: 'trockenfruechte', name: 'Trockenfrüchte', category: 'Fruits & Veg', emoji: '🫘', ingredientEN: 'dried fruit' },
    { id: 'wurzelgemuese', name: 'Gemüse — Wurzelgemüse', category: 'Fruits & Veg', emoji: '🥕', ingredientEN: 'carrots' },
    { id: 'zwiebeln-knoblauch', name: 'Gemüse — Zwiebeln & Knoblauch', category: 'Fruits & Veg', emoji: '🧅', ingredientEN: 'onion' },
    { id: 'tomaten-paprika', name: 'Gemüse — Tomaten & Paprika', category: 'Fruits & Veg', emoji: '🍅', ingredientEN: 'tomatoes' },
    { id: 'kuerbis-gurke', name: 'Gemüse — Kürbis & Gurke', category: 'Fruits & Veg', emoji: '🥒', ingredientEN: 'cucumber' },
    { id: 'kohl', name: 'Gemüse — Kohl', category: 'Fruits & Veg', emoji: '🥦', ingredientEN: 'broccoli' },
    { id: 'blattsalate', name: 'Gemüse — Blattsalate & Grün', category: 'Fruits & Veg', emoji: '🥬', ingredientEN: 'lettuce' },
    { id: 'staengel-stiele', name: 'Gemüse — Stängel & Stiele', category: 'Fruits & Veg', emoji: '🌿', ingredientEN: 'celery' },
    { id: 'huelsenfruechte-mais', name: 'Gemüse — Hülsenfrüchte & Mais', category: 'Fruits & Veg', emoji: '🌽', ingredientEN: 'corn' },
    { id: 'gemuese-sonstiges', name: 'Gemüse — Sonstiges', category: 'Fruits & Veg', emoji: '🥬', ingredientEN: 'vegetables' },
    { id: 'pilze', name: 'Pilze', category: 'Fruits & Veg', emoji: '🍄', ingredientEN: 'mushrooms' },
    { id: 'huelsenfruechte', name: 'Hülsenfrüchte (trocken & Dose)', category: 'Fruits & Veg', emoji: '🫘', ingredientEN: 'lentils' },
    { id: 'gemuesekonserven', name: 'Gemüsekonserven & Glas', category: 'Fruits & Veg', emoji: '🥫', ingredientEN: 'canned vegetables' },
    { id: 'frische-kraeuter', name: 'Frische Kräuter', category: 'Fruits & Veg', emoji: '🌿', ingredientEN: 'herbs' },
    { id: 'nuesse-kerne', name: 'Nüsse & Kerne', category: 'Fruits & Veg', emoji: '🥜', ingredientEN: 'nuts' },
    { id: 'tofu-soja', name: 'Tofu & Soja', category: 'Fruits & Veg', emoji: '🧊', ingredientEN: 'tofu' },

    // ═════════════════════════════════════════════════════════════════════════
    // MEAT & FISH
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'gefluegel', name: 'Geflügel', category: 'Meat & Fish', emoji: '🍗', ingredientEN: 'chicken' },
    { id: 'rindfleisch', name: 'Rindfleisch', category: 'Meat & Fish', emoji: '🥩', ingredientEN: 'beef' },
    { id: 'schweinefleisch', name: 'Schweinefleisch', category: 'Meat & Fish', emoji: '🥩', ingredientEN: 'pork' },
    { id: 'lamm', name: 'Lamm', category: 'Meat & Fish', emoji: '🍖', ingredientEN: 'lamb' },
    { id: 'kalb-wild', name: 'Kalb & Wild', category: 'Meat & Fish', emoji: '🍖', ingredientEN: 'veal' },
    { id: 'wurst-wuerstchen', name: 'Wurst & Würstchen', category: 'Meat & Fish', emoji: '🌭', ingredientEN: 'sausage' },
    { id: 'aufschnitt', name: 'Aufschnitt & Wurstwaren', category: 'Meat & Fish', emoji: '🥓', ingredientEN: 'ham' },
    { id: 'frischer-fisch', name: 'Frischer Fisch', category: 'Meat & Fish', emoji: '🐟', ingredientEN: 'fish' },
    { id: 'meeresfruechte', name: 'Meeresfrüchte', category: 'Meat & Fish', emoji: '🦐', ingredientEN: 'prawns' },
    { id: 'fisch-dose-gerauchert', name: 'Fisch aus der Dose / geräuchert', category: 'Meat & Fish', emoji: '🐟', ingredientEN: 'tuna' },
    { id: 'vegane-fleischalternativen', name: 'Vegane Fleischalternativen', category: 'Meat & Fish', emoji: '🌱', ingredientEN: 'plant-based meat' },

    // ═════════════════════════════════════════════════════════════════════════
    // DRINKS
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'wasser', name: 'Wasser', category: 'Drinks', emoji: '💧', ingredientEN: 'water' },
    { id: 'saft', name: 'Saft', category: 'Drinks', emoji: '🧃', ingredientEN: 'juice' },
    { id: 'schorle-limonaden', name: 'Schorle & Limonaden', category: 'Drinks', emoji: '🥤', ingredientEN: 'soda' },
    { id: 'smoothies', name: 'Smoothies', category: 'Drinks', emoji: '🥤', ingredientEN: 'smoothie' },
    { id: 'kaffee', name: 'Kaffee', category: 'Drinks', emoji: '☕', ingredientEN: 'coffee' },
    { id: 'tee', name: 'Tee', category: 'Drinks', emoji: '🍵', ingredientEN: 'tea' },
    { id: 'kakao-heissgetraenke', name: 'Kakao & Heißgetränke', category: 'Drinks', emoji: '☕', ingredientEN: 'cocoa' },
    { id: 'pflanzenmilch', name: 'Pflanzenmilch', category: 'Drinks', emoji: '🥛', ingredientEN: 'oat milk' },
    { id: 'bier', name: 'Bier', category: 'Drinks', emoji: '🍺', ingredientEN: 'beer' },
    { id: 'wein-sekt', name: 'Wein & Sekt', category: 'Drinks', emoji: '🍷', ingredientEN: 'wine' },
    { id: 'spirituosen', name: 'Spirituosen', category: 'Drinks', emoji: '🥃', ingredientEN: 'spirits' },
    { id: 'sonstige-getraenke', name: 'Sonstige Getränke', category: 'Drinks', emoji: '🥤', ingredientEN: 'drinks' },

    // ═════════════════════════════════════════════════════════════════════════
    // BREAD & GRAINS
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'brot', name: 'Brot', category: 'Bread & Grains', emoji: '🍞', ingredientEN: 'bread' },
    { id: 'broetchen', name: 'Brötchen & Kleingebäck', category: 'Bread & Grains', emoji: '🥖', ingredientEN: 'bread rolls' },
    { id: 'fladenbrot-wraps', name: 'Fladenbrot, Wraps & Spezialbrote', category: 'Bread & Grains', emoji: '🫓', ingredientEN: 'flatbread' },
    { id: 'feingebaeck', name: 'Feingebäck & Blätterteig', category: 'Bread & Grains', emoji: '🥐', ingredientEN: 'pastry' },
    { id: 'nudeln', name: 'Nudeln', category: 'Bread & Grains', emoji: '🍝', ingredientEN: 'pasta' },
    { id: 'asiatische-nudeln', name: 'Asiatische Nudeln', category: 'Bread & Grains', emoji: '🍜', ingredientEN: 'noodles' },
    { id: 'reis', name: 'Reis', category: 'Bread & Grains', emoji: '🍚', ingredientEN: 'rice' },
    { id: 'andere-getreide', name: 'Andere Getreide', category: 'Bread & Grains', emoji: '🌾', ingredientEN: 'grains' },
    { id: 'fruehstueckscerealien', name: 'Frühstückscerealien', category: 'Bread & Grains', emoji: '🥣', ingredientEN: 'cereal' },
    { id: 'mehl', name: 'Mehl', category: 'Bread & Grains', emoji: '🌾', ingredientEN: 'flour' },
    { id: 'cracker-knaeckebrot', name: 'Cracker & Knäckebrot', category: 'Bread & Grains', emoji: '🍘', ingredientEN: 'crackers' },

    // ═════════════════════════════════════════════════════════════════════════
    // SNACKS & SWEETS
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'schokolade', name: 'Schokolade', category: 'Snacks & Sweets', emoji: '🍫', ingredientEN: 'chocolate' },
    { id: 'suessigkeiten', name: 'Süßigkeiten', category: 'Snacks & Sweets', emoji: '🍬', ingredientEN: 'candy' },
    { id: 'salzige-snacks', name: 'Salzige Snacks', category: 'Snacks & Sweets', emoji: '🥨', ingredientEN: 'chips' },
    { id: 'kekse-gebaeck', name: 'Kekse & Gebäck', category: 'Snacks & Sweets', emoji: '🍪', ingredientEN: 'cookies' },
    { id: 'kuchen', name: 'Kuchen & Gebäck', category: 'Snacks & Sweets', emoji: '🍰', ingredientEN: 'cake' },
    { id: 'riegel', name: 'Riegel', category: 'Snacks & Sweets', emoji: '🍫', ingredientEN: 'cereal bar' },
    { id: 'aufstriche-suess', name: 'Aufstriche (süß)', category: 'Snacks & Sweets', emoji: '🍯', ingredientEN: 'spread' },
    { id: 'desserts', name: 'Desserts (gekühlt / ungekühlt)', category: 'Snacks & Sweets', emoji: '🍮', ingredientEN: 'dessert' },
    { id: 'eis', name: 'Eis', category: 'Snacks & Sweets', emoji: '🍨', ingredientEN: 'ice cream' },

    // ═════════════════════════════════════════════════════════════════════════
    // FROZEN
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'tk-gemuese', name: 'TK-Gemüse', category: 'Frozen', emoji: '🥦', ingredientEN: 'frozen vegetables' },
    { id: 'tk-obst', name: 'TK-Obst', category: 'Frozen', emoji: '🍓', ingredientEN: 'frozen fruit' },
    { id: 'tk-kartoffelprodukte', name: 'TK-Kartoffelprodukte', category: 'Frozen', emoji: '🍟', ingredientEN: 'frozen fries' },
    { id: 'tk-fertiggerichte', name: 'TK-Fertiggerichte', category: 'Frozen', emoji: '🍕', ingredientEN: 'frozen meals' },
    { id: 'tk-fleischprodukte', name: 'TK-Fleischprodukte', category: 'Frozen', emoji: '🥩', ingredientEN: 'frozen meat' },
    { id: 'tk-fisch', name: 'TK-Fisch', category: 'Frozen', emoji: '🐟', ingredientEN: 'frozen fish' },
    { id: 'tk-snacks', name: 'TK-Snacks & Vorspeisen', category: 'Frozen', emoji: '🥟', ingredientEN: 'frozen snacks' },
    { id: 'tk-backwaren', name: 'TK-Backwaren', category: 'Frozen', emoji: '🥐', ingredientEN: 'frozen bakery' },
    { id: 'tk-kraeuter', name: 'TK-Kräuter', category: 'Frozen', emoji: '🌿', ingredientEN: 'frozen herbs' },

    // ═════════════════════════════════════════════════════════════════════════
    // READY MEALS
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'suppen', name: 'Suppen', category: 'Ready Meals', emoji: '🍲', ingredientEN: 'soup' },
    { id: 'instantgerichte', name: 'Instantgerichte', category: 'Ready Meals', emoji: '🍜', ingredientEN: 'instant noodles' },
    { id: 'nudelsossen', name: 'Nudelsoßen (Glas)', category: 'Ready Meals', emoji: '🍝', ingredientEN: 'pasta sauce' },
    { id: 'fertiggerichte', name: 'Fertiggerichte (Dose / Glas)', category: 'Ready Meals', emoji: '🥫', ingredientEN: 'canned meals' },
    { id: 'dips-aufstriche', name: 'Dips & Aufstriche (herzhaft)', category: 'Ready Meals', emoji: '🫕', ingredientEN: 'hummus' },
    { id: 'fertigsalate-deli', name: 'Fertigsalate & Deli (gekühlt)', category: 'Ready Meals', emoji: '🥗', ingredientEN: 'salad' },
    { id: 'kochsets', name: 'Kochsets & Würzpasten', category: 'Ready Meals', emoji: '🍛', ingredientEN: 'curry paste' },
    { id: 'tomatenprodukte', name: 'Tomatenprodukte', category: 'Ready Meals', emoji: '🍅', ingredientEN: 'tomato paste' },

    // ═════════════════════════════════════════════════════════════════════════
    // CONDIMENTS
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'speiseoele', name: 'Speiseöle', category: 'Condiments', emoji: '🫒', ingredientEN: 'olive oil' },
    { id: 'essig', name: 'Essig', category: 'Condiments', emoji: '🫙', ingredientEN: 'vinegar' },
    { id: 'tischsossen', name: 'Tischsoßen', category: 'Condiments', emoji: '🥫', ingredientEN: 'ketchup' },
    { id: 'asiatische-sossen', name: 'Asiatische Soßen & Pasten', category: 'Condiments', emoji: '🥢', ingredientEN: 'soy sauce' },
    { id: 'salatdressing', name: 'Salatdressing', category: 'Condiments', emoji: '🥗', ingredientEN: 'dressing' },
    { id: 'gewuerze', name: 'Gewürze (getrocknet)', category: 'Condiments', emoji: '🧂', ingredientEN: 'spices' },
    { id: 'zucker-suessungsmittel', name: 'Zucker & Süßungsmittel', category: 'Condiments', emoji: '🍯', ingredientEN: 'sugar' },
    { id: 'marmelade-aufstrich', name: 'Marmelade & Aufstrich', category: 'Condiments', emoji: '🍓', ingredientEN: 'jam' },
    { id: 'bruehe-fond', name: 'Brühe, Fond & Kochhilfen', category: 'Condiments', emoji: '🍵', ingredientEN: 'broth' },
    { id: 'backzutaten', name: 'Backzutaten', category: 'Condiments', emoji: '🧁', ingredientEN: 'baking powder' },
    { id: 'eingelegtes', name: 'Eingelegtes & Konserven', category: 'Condiments', emoji: '🫙', ingredientEN: 'pickles' },

    // ═════════════════════════════════════════════════════════════════════════
    // BABY FOOD
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'baby-milch', name: 'Baby-Milchnahrung', category: 'Baby Food', emoji: '🍼', ingredientEN: 'infant formula' },
    { id: 'baby-brei', name: 'Baby-Brei', category: 'Baby Food', emoji: '🥣', ingredientEN: 'baby cereal' },
    { id: 'baby-glaeschen', name: 'Baby-Gläschen', category: 'Baby Food', emoji: '🍼', ingredientEN: 'baby food' },
    { id: 'baby-snacks', name: 'Baby-Snacks', category: 'Baby Food', emoji: '🍪', ingredientEN: 'baby snacks' },
    { id: 'baby-getraenke', name: 'Baby-Getränke & Sonstiges', category: 'Baby Food', emoji: '🍼', ingredientEN: 'baby drinks' },

    // ═════════════════════════════════════════════════════════════════════════
    // OTHER
    // ═════════════════════════════════════════════════════════════════════════
    { id: 'kueche', name: 'Küche', category: 'Other', emoji: '🧽', ingredientEN: null },
    { id: 'reinigung', name: 'Reinigung', category: 'Other', emoji: '🧹', ingredientEN: null },
    { id: 'waeschepflege', name: 'Wäschepflege', category: 'Other', emoji: '🧺', ingredientEN: null },
    { id: 'papierprodukte', name: 'Papierprodukte', category: 'Other', emoji: '🧻', ingredientEN: null },
    { id: 'koerperpflege', name: 'Körperpflege', category: 'Other', emoji: '🧴', ingredientEN: null },
    { id: 'damenhygiene', name: 'Damenhygiene', category: 'Other', emoji: '🩹', ingredientEN: null },
    { id: 'baby-kind', name: 'Baby & Kind', category: 'Other', emoji: '👶', ingredientEN: null },
    { id: 'gesundheit', name: 'Gesundheit & Nahrungsergänzung', category: 'Other', emoji: '💊', ingredientEN: null },
    { id: 'tierbedarf', name: 'Tierbedarf', category: 'Other', emoji: '🐾', ingredientEN: null },
    { id: 'haushalt-sonstiges', name: 'Haushalt Sonstiges', category: 'Other', emoji: '🔋', ingredientEN: null },
]

export default SUBCATEGORIES

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Map: subcategory name → subcategory object */
const BY_NAME = new Map(SUBCATEGORIES.map(s => [s.name, s]))

/** Map: subcategory id → subcategory object */
const BY_ID = new Map(SUBCATEGORIES.map(s => [s.id, s]))

/** Map: category → array of subcategories */
const BY_CATEGORY = new Map()
for (const s of SUBCATEGORIES) {
    if (!BY_CATEGORY.has(s.category)) BY_CATEGORY.set(s.category, [])
    BY_CATEGORY.get(s.category).push(s)
}

export function getSubcategoryByName(name) { return BY_NAME.get(name) || null }
export function getSubcategoryById(id) { return BY_ID.get(id) || null }
export function getSubcategoriesForCategory(category) { return BY_CATEGORY.get(category) || [] }

// ─── Category defaults ───────────────────────────────────────────────────────
// Human-readable emoji (for logs, DB columns, plain-text UI).
const CATEGORY_EMOJI = {
    'Dairy & Eggs': '🥛',
    'Fruits & Veg': '🥬',
    'Meat & Fish': '🥩',
    'Drinks': '🥤',
    'Bread & Grains': '🍞',
    'Snacks & Sweets': '🍬',
    'Frozen': '❄️',
    'Ready Meals': '🍽️',
    'Condiments': '🧂',
    'Baby Food': '🍼',
    'Other': '🛒',
}

// Optional OpenMoji hex overrides — use when the default emoji resolves to a
// poor glyph in OpenMoji's black set. Keys match CATEGORY_EMOJI keys.
const CATEGORY_ICON_OVERRIDES = {
    // 'Frozen': '2744',  // example override
}

/** OpenMoji hex code for each category. */
const CATEGORY_ICONS = Object.fromEntries(
    Object.entries(CATEGORY_EMOJI).map(([cat, emo]) => [
        cat,
        CATEGORY_ICON_OVERRIDES[cat] || normaliseIcon(emo),
    ]),
)

// ─── Public resolvers ────────────────────────────────────────────────────────

/** Emoji for a subcategory (falls back to category emoji, then 🛒). */
export function getSubcategoryEmoji(subcategoryName, category) {
    const sub = BY_NAME.get(subcategoryName)
    if (sub) return sub.emoji
    if (category) return CATEGORY_EMOJI[category] || '🛒'
    return '🛒'
}

/**
 * OpenMoji hex code for a subcategory. Resolution order:
 *   1. subcategory `icon` override
 *   2. subcategory `emoji` → hex
 *   3. category override
 *   4. category emoji → hex
 *   5. '1F6D2' (🛒)
 */
export function getSubcategoryIcon(subcategoryName, category) {
    const sub = BY_NAME.get(subcategoryName)
    if (sub) {
        if (sub.icon) return sub.icon.toUpperCase()
        const hex = normaliseIcon(sub.emoji)
        if (hex) return hex
    }
    if (category && CATEGORY_ICONS[category]) return CATEGORY_ICONS[category]
    return '1F6D2' // 🛒
}

/** OpenMoji hex code for a category. */
export function getCategoryIcon(category) {
    return CATEGORY_ICONS[category] || '1F6D2'
}

export { CATEGORY_EMOJI, CATEGORY_ICONS }
