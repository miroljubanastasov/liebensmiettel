/**
 * German-market food label definitions.
 *
 * Each label has:
 *   id      – internal key
 *   name    – German display name
 *   tags    – Open Food Facts label tags that map to this label
 *   icon    – SVG path data (24×24 viewBox)
 *   iconUrl – path to standalone SVG file (public/icons/labels/)
 *
 * The SVG paths are simplified, original representations — not
 * reproductions of copyrighted certification logos.
 */

const FOOD_LABELS = [
    // ─── Organic / Bio ─────────────────────────────────────────────────
    {
        id: 'eu-bio',
        name: 'EU-Bio',
        tags: ['en:organic', 'en:eu-organic', 'de:eu-bio', 'en:eu-agriculture'],
        icon: 'M17 8C8 10 6 14 6 18c0 0 3-2 7-3 4-1 5 1 5 1s1-2-1-8zm-5 4c-3 1-5 4-5 4s2 .5 5-.5 4-3 4-3-1-1.5-4-.5z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/eu-organic.135x90.svg',
    },
    {
        id: 'de-bio',
        name: 'Bio-Siegel',
        tags: ['de:bio', 'de:deutsches-bio-siegel', 'de:bio-siegel', 'en:de-oko-kontrollstelle'],
        icon: 'M12 2l9 5.2v9.6L12 22l-9-5.2V7.2L12 2zm0 3L6 8v8l6 3.5L18 16V8l-6-3zM10.5 10c0 1.4.6 2.6 1.5 3.3.9-.7 1.5-1.9 1.5-3.3 0-1-.7-1.7-1.5-1.7S10.5 9 10.5 10z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/de/labels/eg-oko-verordnung.110x90.svg',
    },
    {
        id: 'bioland',
        name: 'Bioland',
        tags: ['en:bioland', 'de:bioland'],
        icon: 'M12 6a6 6 0 100 12 6 6 0 000-12zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zM12 1v2.5m0 17V23m-9.5-11H5m14 0h2.5M4.9 4.9l1.8 1.8m10.6 10.6l1.8 1.8M4.9 19.1l1.8-1.8m10.6-10.6l1.8-1.8',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/de/labels/bioland.90x90.svg',
    },
    {
        id: 'demeter',
        name: 'Demeter',
        tags: ['en:demeter', 'de:demeter'],
        icon: 'M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 2c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 2c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/demeter.180x90.svg',
    },
    {
        id: 'naturland',
        name: 'Naturland',
        tags: ['en:naturland', 'de:naturland'],
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c1.85 0 3.55.63 4.9 1.69C15 7 13 9 13 12c-1-1-3-1-4 0v3c1 1 3 1 4 0 0 2 1 3.5 2.5 4.5-.76.32-1.6.5-2.5.5-4.42 0-8-3.58-8-8s3.58-8 8-8z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/de/labels/naturland.78x90.svg',
    },

    // ─── Diet / Lifestyle ──────────────────────────────────────────────
    {
        id: 'vegan',
        name: 'Vegan',
        tags: ['en:vegan', 'de:vegan', 'en:european-vegetarian-union-vegan', 'en:v-label-vegan'],
        icon: 'M4 5l6 14h4L20 5h-3l-5 11L7 5H4zm10 7c1-2 3-3 5-3 0 0-1 3-3 4s-3 0-3 0l1-1z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/v-label-vegan.68x90.svg',
    },
    {
        id: 'vegetarisch',
        name: 'Vegetarisch',
        tags: ['en:vegetarian', 'de:vegetarisch', 'en:european-vegetarian-union-vegetarian', 'en:v-label-vegetarian'],
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-3-13l3 8 3-8h2l-4 10h-2L7 7h2z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/v-label-vegetarian.76x90.svg',
    },
    {
        id: 'glutenfrei',
        name: 'Glutenfrei',
        tags: ['en:gluten-free', 'en:no-gluten', 'de:glutenfrei'],
        icon: 'M12 2v6c-1-1-3-1-4 0v3c1 1 3 1 4 0v3c-1-1-3-1-4 0v3c1 1 3 1 4 0v5h2v-5c1 1 3 1 4 0v-3c-1-1-3-1-4 0v-3c1 1 3 1 4 0V8c-1-1-3-1-4 0V2h-2zM2 4l20 17-1.2 1.4L.8 5.4 2 4z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/crossed-grain-trademark.90x90.svg',
    },
    {
        id: 'laktosefrei',
        name: 'Laktosefrei',
        tags: ['en:lactose-free', 'en:no-lactose', 'de:laktosefrei'],
        icon: 'M12 2c-1 3-3 5-4 7s-2 5 0 7c1 2 3 4 4 4s3-2 4-4c2-2 1-5 0-7s-3-4-4-7zm0 4c1 2 2 3 3 5s1 3 0 5-2 3-3 3-2-1-3-3 0-3 0-5 2-3 3-5zM3 3l18 18-1.4 1.4L1.6 4.4 3 3z',
    },
    {
        id: 'zuckerfrei',
        name: 'Zuckerfrei',
        tags: ['en:sugar-free', 'en:no-added-sugar', 'en:no-sugar', 'de:zuckerfrei', 'de:ohne-zuckerzusatz'],
        icon: 'M7 3h10c.6 0 1 .4 1 1v3l-3 4v5c0 1.7-1.3 3-3 3s-3-1.3-3-3v-5L6 7V4c0-.6.4-1 1-1zm1 2v2l3 4v5c0 .6.4 1 1 1s1-.4 1-1v-5l3-4V5H8zM2.5 2.1l19.4 19.4-1.4 1.4L1.1 3.5l1.4-1.4z',
    },

    // ─── Sustainability / Ethics ───────────────────────────────────────
    {
        id: 'fairtrade',
        name: 'Fairtrade',
        tags: ['en:fair-trade', 'en:fairtrade', 'en:fairtrade-international', 'en:max-havelaar'],
        icon: 'M12 2a2 2 0 100 4 2 2 0 000-4zm-6 8l3-2h6l3 2-1.5 1-1.5-1v3h-1V9h-2v5h-1V9h-2v3l-1.5 1L6 10zm3 6v4h2v-4h-2zm4 0v4h-2v-4h2z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/fairtrade-international.77x90.svg',
    },
    {
        id: 'rainforest-alliance',
        name: 'Rainforest Alliance',
        tags: ['en:rainforest-alliance', 'en:utz-certified', 'en:rainforest-alliance-certified'],
        icon: 'M12 4C9 4 7 6 7 9c-2 0-4 1-4 3s1 3 3 3v2c0 2 2 4 6 4s6-2 6-4v-2c2 0 3-1 3-3s-2-3-4-3c0-3-2-5-5-5zm-2 6a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/rainforest-alliance.90x90.svg',
    },
    {
        id: 'msc',
        name: 'MSC Fisch',
        tags: ['en:msc', 'en:marine-stewardship-council'],
        icon: 'M2 12c3-3 6-5 10-5 2 0 4 .5 5.5 1.5L19 7l2 2-4 4c.5 1.5.5 3-.5 4.5C13.5 20 10 18 7 15s-5-3-5-3zm10-2a2 2 0 100 4 2 2 0 000-4z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/sustainable-seafood-msc.126x90.svg',
    },
    {
        id: 'asc',
        name: 'ASC Zucht',
        tags: ['en:asc', 'en:aquaculture-stewardship-council'],
        icon: 'M2 12c3-3 6-5 10-5s7 2 10 5c-3 3-6 5-10 5s-7-2-10-5zm10-2a2 2 0 100 4 2 2 0 000-4zm-9 7c2 1 4 1 6 0s4-1 6 0 4 1 6 0v2c-2-1-4-1-6 0s-4 1-6 0-4-1-6 0v-2z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/responsible-aquaculture-asc.188x90.svg',
    },
    {
        id: 'ohne-gentechnik',
        name: 'Ohne Gentechnik',
        tags: ['en:no-gmos', 'en:without-genetic-engineering', 'de:ohne-gentechnik'],
        icon: 'M9 2v2c2 0 4 1 4 3H7v2h6c0 2-2 3-4 3v2c2 0 4 1 4 3H7v2h6c0 2-2 3-4 3v2h2v-2c2 0 4-1 4-3h-6c0-2 2-3 4-3v-2c-2 0-4-1-4-3h6c0-2-2-3-4-3V2H9zM3 3l18 18-1.4 1.4L1.6 4.4 3 3z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/de/labels/ohne-gentechnik.90x90.svg',
    },
    {
        id: 'palmoelfrei',
        name: 'Palmölfrei',
        tags: ['en:palm-oil-free', 'en:no-palm-oil', 'de:palmölfrei'],
        icon: 'M12 3c-2 2-2 4-1 5l-4-3c-1 2 0 4 2 5l-4-2c0 2 2 4 4 4h1l-2 9h3l1-5 1 5h3l-2-9h1c2 0 4-2 4-4l-4 2c2-1 3-3 2-5l-4 3c1-1 1-3-1-5zM3 3l18 18-1.4 1.4L1.6 4.4 3 3z',
    },

    // ─── Religious ─────────────────────────────────────────────────────
    {
        id: 'halal',
        name: 'Halal',
        tags: ['en:halal'],
        icon: 'M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 006-2 8 8 0 01-6 1A8 8 0 014 13a8 8 0 018-8 10 10 0 00-6-2 10 10 0 016-1z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/halal.90x90.svg',
    },
    {
        id: 'kosher',
        name: 'Koscher',
        tags: ['en:kosher'],
        icon: 'M12 2l3 5h6l-3 5 3 5h-6l-3 5-3-5H3l3-5-3-5h6l3-5zm0 4L10 10H6l2 2-2 2h4l2 4 2-4h4l-2-2 2-2h-4l-2-4z',
        imageUrl: 'https://static.openfoodfacts.org/images/lang/en/labels/orthodox-union-kosher.90x90.png',
    },

    // ─── Quality / Origin ──────────────────────────────────────────────
    {
        id: 'vollkorn',
        name: 'Vollkorn',
        tags: ['en:whole-grain', 'en:whole-wheat', 'de:vollkorn'],
        icon: 'M12 2c-.8 1.5-1.5 3.5-1.5 5.5s.7 4 1.5 5.5c.8-1.5 1.5-3.5 1.5-5.5S12.8 3.5 12 2zM8 8c-.8 1-1.5 2.5-1.5 4S7.2 14.5 8 15.5c.8-1 1.5-2.5 1.5-4S8.8 9 8 8zm8 0c-.8 1-1.5 2.5-1.5 4s.7 3 1.5 4c.8-1 1.5-2.5 1.5-4S16.8 9 16 8zM11 16v6h2v-6h-2z',
    },
    {
        id: 'regionalfenster',
        name: 'Regionalfenster',
        tags: ['en:regionalfenster', 'de:regionalfenster'],
        icon: 'M4 4h16v16H4V4zm2 2v5h5V6H6zm7 0v5h5V6h-5zM6 13v5h5v-5H6zm7 0v5h5v-5h-5z',
    },
    {
        id: 'geschuetzte-ursprungsbezeichnung',
        name: 'g.U. (Ursprung)',
        tags: ['en:pdo', 'en:protected-designation-of-origin', 'de:geschuetzte-ursprungsbezeichnung', 'en:aop'],
        icon: 'M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm0 2.18l6 2.25v4.57c0 4.5-2.88 8.7-6 9.88-3.12-1.18-6-5.38-6-9.88V6.43l6-2.25z',
    },
    {
        id: 'geschuetzte-geografische-angabe',
        name: 'g.g.A. (Geografie)',
        tags: ['en:pgi', 'en:protected-geographical-indication', 'de:geschuetzte-geografische-angabe', 'en:igp'],
        icon: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 3c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zm0 3a4 4 0 100 8 4 4 0 000-8z',
    },

    // ─── Animal Welfare ────────────────────────────────────────────────
    {
        id: 'tierwohl',
        name: 'Tierwohl',
        tags: ['en:initiative-tierwohl', 'de:initiative-tierwohl', 'de:tierwohl'],
        icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM10 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-2 4a1 1 0 100 2 1 1 0 000-2z',
    },
    {
        id: 'haltungsform',
        name: 'Haltungsform',
        tags: ['en:haltungsform', 'en:haltungsform-1', 'en:haltungsform-2', 'en:haltungsform-3', 'en:haltungsform-4', 'de:haltungsform'],
        icon: 'M4 21V10l8-7 8 7v11H4zm2-2h12V10.8L12 5.7 6 10.8V19zm2-6h3v5H8v-5zm5 0h3v5h-3v-5z',
    },
    {
        id: 'blauer-engel',
        name: 'Blauer Engel',
        tags: ['en:blauer-engel', 'en:blue-angel', 'de:blauer-engel'],
        icon: 'M12 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm-4 6c0 1 .7 2 1.7 2.3L8 16l-3 1 1 2 4-2 2 5 2-5 4 2 1-2-3-1-1.7-5.7c1-.3 1.7-1.3 1.7-2.3H8z',
    },
]

/**
 * Map an Open Food Facts tag (e.g. "en:organic") to a label definition.
 * Returns undefined if no match.
 */
export function findLabel(tag) {
    const t = tag.toLowerCase()
    return FOOD_LABELS.find((l) => l.tags.includes(t))
}

/**
 * Given an array of OFF label tags, return the matching label definitions
 * (de-duplicated by id).
 */
export function resolveLabels(tags) {
    if (!tags || !Array.isArray(tags)) return []
    const seen = new Set()
    const results = []
    for (const tag of tags) {
        const label = findLabel(tag)
        if (label && !seen.has(label.id)) {
            seen.add(label.id)
            results.push(label)
        }
    }
    return results
}

export default FOOD_LABELS
