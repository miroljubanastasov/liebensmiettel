/**
 * Typical shelf-life table — coarse defaults used to suggest an expiry date
 * when the user hasn't read one off the packaging.
 *
 * Values are in *days after purchase*.
 *
 * Lookup order in `getShelfLifeDays()`:
 *   1. subcategory override for the chosen location
 *   2. subcategory fallback (any-location default)
 *   3. category override for the location
 *   4. category fallback
 *   5. null (no suggestion)
 *
 * These are conservative "store-bought, unopened" estimates — good enough
 * to seed the expiry picker; the user can always overwrite.
 */

// ── Category-level defaults ────────────────────────────────────────────────
export const CATEGORY_SHELF_LIFE = {
    'Dairy & Eggs': { fridge: 10, freezer: 90, pantry: 14 },
    'Fruits & Veg': { fridge: 7, freezer: 180, pantry: 7 },
    'Meat & Fish': { fridge: 2, freezer: 120, pantry: 365 }, // pantry = canned/dry
    'Drinks': { fridge: 30, freezer: 180, pantry: 365 },
    'Bread & Grains': { fridge: 14, freezer: 90, pantry: 180 },
    'Snacks & Sweets': { fridge: 60, freezer: 180, pantry: 180 },
    'Frozen': { fridge: 3, freezer: 270, pantry: null },
    'Ready Meals': { fridge: 5, freezer: 90, pantry: 540 },
    'Condiments': { fridge: 180, freezer: 365, pantry: 540 },
    'Baby Food': { fridge: 3, freezer: 90, pantry: 365 },
    'Other': { fridge: 14, freezer: 180, pantry: 180 },
}

// ── Subcategory overrides (matched by SUBCATEGORIES.name) ─────────────────
export const SUBCATEGORY_SHELF_LIFE = {
    // Dairy
    'Milch': { fridge: 7, pantry: 90 /* H-milk */ },
    'Joghurt': { fridge: 14, freezer: 30 },
    'Quark': { fridge: 14 },
    'Käse — Schnitt- & Hartkäse': { fridge: 30 },
    'Käse — Weichkäse': { fridge: 10 },
    'Käse — Frischkäse & Aufstrich': { fridge: 14 },
    'Käse — Italienisch': { fridge: 10 },
    'Butter & Margarine': { fridge: 60, freezer: 270 },
    'Sahne & Crème': { fridge: 10 },
    'Eier': { fridge: 28, pantry: 21 },
    'Milchdesserts': { fridge: 14 },
    'Fermentierte Milch': { fridge: 14 },

    // Fruits & Veg
    'Frisches Obst — Beeren': { fridge: 4 },
    'Frisches Obst — Kernobst': { fridge: 21, pantry: 10 },
    'Frisches Obst — Steinobst': { fridge: 5 },
    'Frisches Obst — Bananen & Tropisch': { pantry: 5 },
    'Frisches Obst — Zitrusfrüchte': { fridge: 21, pantry: 10 },
    'Gemüse — Blattsalate & Grün': { fridge: 5 },
    'Gemüse — Wurzelgemüse': { fridge: 30, pantry: 21 },
    'Gemüse — Tomaten & Paprika': { fridge: 7, pantry: 5 },
    'Gemüse — Zwiebeln & Knoblauch': { pantry: 60, fridge: 30 },
    'Gemüse — Kohl': { fridge: 14 },
    'Pilze': { fridge: 5 },
    'Frische Kräuter': { fridge: 5 },
    'Trockenfrüchte': { pantry: 365 },
    'Nüsse & Kerne': { pantry: 180, fridge: 365 },
    'Tofu & Soja': { fridge: 10 },
    'Hülsenfrüchte (trocken & Dose)': { pantry: 720 },
    'Gemüsekonserven & Glas': { pantry: 540 },
    'Obstkonserven': { pantry: 540 },

    // Meat & Fish
    'Geflügel': { fridge: 2, freezer: 180 },
    'Rindfleisch': { fridge: 3, freezer: 270 },
    'Schweinefleisch': { fridge: 3, freezer: 180 },
    'Lamm': { fridge: 3, freezer: 270 },
    'Kalb & Wild': { fridge: 3, freezer: 270 },
    'Wurst & Würstchen': { fridge: 7, freezer: 90 },
    'Aufschnitt & Wurstwaren': { fridge: 5, freezer: 60 },
    'Frischer Fisch': { fridge: 1, freezer: 120 },
    'Meeresfrüchte': { fridge: 1, freezer: 90 },
    'Fisch aus der Dose / geräuchert': { fridge: 14, pantry: 730 },
    'Vegane Fleischalternativen': { fridge: 14, freezer: 180 },

    // Drinks
    'Wasser': { pantry: 365 },
    'Saft': { pantry: 365, fridge: 7 /* opened */ },
    'Schorle & Limonaden': { pantry: 270 },
    'Smoothies': { fridge: 7 },
    'Kaffee': { pantry: 365 },
    'Tee': { pantry: 720 },
    'Pflanzenmilch': { pantry: 180, fridge: 7 /* opened */ },
    'Bier': { pantry: 180 },
    'Wein & Sekt': { pantry: 1095 },
    'Spirituosen': { pantry: 3650 },

    // Bread & Grains
    'Brot': { pantry: 5, freezer: 90 },
    'Brötchen & Kleingebäck': { pantry: 3, freezer: 60 },
    'Fladenbrot, Wraps & Spezialbrote': { pantry: 10, fridge: 21 },
    'Feingebäck & Blätterteig': { fridge: 14, freezer: 90 },
    'Nudeln': { pantry: 720 },
    'Asiatische Nudeln': { pantry: 720 },
    'Reis': { pantry: 1095 },
    'Andere Getreide': { pantry: 720 },
    'Frühstückscerealien': { pantry: 365 },
    'Mehl': { pantry: 365 },
    'Cracker & Knäckebrot': { pantry: 180 },

    // Snacks & Sweets
    'Schokolade': { pantry: 365 },
    'Süßigkeiten': { pantry: 365 },
    'Salzige Snacks': { pantry: 180 },
    'Kekse & Gebäck': { pantry: 270 },
    'Kuchen & Gebäck': { fridge: 4, freezer: 60 },
    'Riegel': { pantry: 270 },
    'Aufstriche (süß)': { pantry: 365 },
    'Desserts (gekühlt / ungekühlt)': { fridge: 14 },
    'Eis': { freezer: 270 },

    // Frozen — all TK stays in freezer mostly
    'TK-Gemüse': { freezer: 365 },
    'TK-Obst': { freezer: 365 },
    'TK-Kartoffelprodukte': { freezer: 270 },
    'TK-Fertiggerichte': { freezer: 180 },
    'TK-Fleischprodukte': { freezer: 180 },
    'TK-Fisch': { freezer: 180 },
    'TK-Snacks & Vorspeisen': { freezer: 270 },
    'TK-Backwaren': { freezer: 180 },
    'TK-Kräuter': { freezer: 365 },

    // Ready meals & Condiments
    'Suppen': { pantry: 540, fridge: 4 },
    'Instantgerichte': { pantry: 365 },
    'Nudelsoßen (Glas)': { pantry: 540, fridge: 7 },
    'Fertiggerichte (Dose / Glas)': { pantry: 540 },
    'Dips & Aufstriche (herzhaft)': { fridge: 14 },
    'Fertigsalate & Deli (gekühlt)': { fridge: 4 },
    'Kochsets & Würzpasten': { pantry: 540 },
    'Tomatenprodukte': { pantry: 540 },

    'Speiseöle': { pantry: 540 },
    'Essig': { pantry: 1095 },
    'Tischsoßen': { pantry: 540, fridge: 180 },
    'Asiatische Soßen & Pasten': { pantry: 540, fridge: 180 },
    'Salatdressing': { pantry: 365, fridge: 30 },
    'Gewürze (getrocknet)': { pantry: 1095 },
    'Zucker & Süßungsmittel': { pantry: 1095 },
    'Marmelade & Aufstrich': { pantry: 540, fridge: 60 },
    'Brühe, Fond & Kochhilfen': { pantry: 540 },
    'Backzutaten': { pantry: 365 },
    'Eingelegtes & Konserven': { pantry: 720, fridge: 60 },

    // Baby food
    'Baby-Milchnahrung': { pantry: 540, fridge: 1 /* reconstituted */ },
}

/**
 * Best-guess shelf life in days for a product.
 * @param {object} opts
 * @param {string} [opts.category]
 * @param {string} [opts.subcategory]   matches SUBCATEGORIES.name
 * @param {'fridge'|'freezer'|'pantry'} [opts.location]
 * @returns {number|null} days — or null when no suggestion is available
 */
export function getShelfLifeDays({ category, subcategory, location } = {}) {
    const sub = subcategory && SUBCATEGORY_SHELF_LIFE[subcategory]
    if (sub) {
        if (location && sub[location] != null) return sub[location]
        // subcategory fallback — prefer the explicit location tier if it matches
        // the typical one, else first defined value
        const firstValue = Object.values(sub).find((v) => v != null)
        if (firstValue != null && !location) return firstValue
    }
    const cat = category && CATEGORY_SHELF_LIFE[category]
    if (cat) {
        if (location && cat[location] != null) return cat[location]
        const firstValue = Object.values(cat).find((v) => v != null)
        if (firstValue != null) return firstValue
    }
    return null
}

/**
 * Compute an ISO date string (YYYY-MM-DD) N days from today.
 */
export function todayPlusDays(days) {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
}

/**
 * Convenience: full ISO expiry suggestion for the given product/location.
 * Returns null when no shelf-life data is available.
 */
export function suggestExpiryDate(opts) {
    const days = getShelfLifeDays(opts)
    return days == null ? null : todayPlusDays(days)
}
