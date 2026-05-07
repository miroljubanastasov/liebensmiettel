/**
 * Store Chains catalogue — German retail chains.
 *
 * Source of truth for the `store_chains` table in Supabase. The JS list
 * lives here so it can be iterated in scripts (seed generator, receipt
 * parser alias lookup) without a DB round-trip.
 *
 * Shape:
 *   id           slug — matches store_chains.id in Supabase
 *   name         official display name
 *   aliases      variants & OCR forms used to resolve `chain_id` from free text
 *   logo_url     Wikimedia thumbnail or null
 *   color        brand hex (used in UI chips)
 *   country      ISO code, default 'DE'
 *   kind         supermarket | discounter | bio | drugstore | cash_carry |
 *                hypermarket | convenience
 *   defunct      true if the chain has been wound down (kept for history)
 */

export const STORE_CHAINS = [
    // ─── Full-range supermarkets ──────────────────────────────────────────
    {
        id: 'rewe',
        name: 'REWE',
        aliases: ['rewe', 'rewe markt', 'rewe city', 'rewe center', 'rewe to go'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Logo_REWE.svg&w=200',
        color: '#cc071e',
        country: 'DE',
        kind: 'supermarket',
    },
    {
        id: 'edeka',
        name: 'EDEKA',
        aliases: ['edeka', 'e center', 'e-center', 'edeka center', 'nahkauf', 'edeka neukauf'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Edeka_Logo_Aktuell.svg&w=200',
        color: '#fff200',
        country: 'DE',
        kind: 'supermarket',
    },
    {
        id: 'kaufland',
        name: 'Kaufland',
        aliases: ['kaufland'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Kaufland_201x_logo.svg&w=200',
        color: '#e10019',
        country: 'DE',
        kind: 'hypermarket',
    },
    {
        id: 'real',
        name: 'real',
        aliases: ['real', 'real sb warenhaus'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Real_Logo_Clean.svg&w=200',
        color: '#e30613',
        country: 'DE',
        kind: 'hypermarket',
        defunct: true,
    },
    {
        id: 'globus',
        name: 'Globus',
        aliases: ['globus', 'globus sb warenhaus'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Globus_SB-Warenhaus_logo.svg&w=200',
        color: '#004b87',
        country: 'DE',
        kind: 'hypermarket',
    },
    {
        id: 'marktkauf',
        name: 'Marktkauf',
        aliases: ['marktkauf'],
        logo_url: null,
        color: '#e30613',
        country: 'DE',
        kind: 'hypermarket',
    },
    {
        id: 'hit',
        name: 'HIT',
        aliases: ['hit', 'hit markt'],
        logo_url: null,
        color: '#d40000',
        country: 'DE',
        kind: 'supermarket',
    },
    {
        id: 'tegut',
        name: 'tegut…',
        aliases: ['tegut', 'tegut...', 'tegut…'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Tegut..._logo_and_claim.svg&w=200',
        color: '#e3000f',
        country: 'DE',
        kind: 'supermarket',
    },
    {
        id: 'famila',
        name: 'famila',
        aliases: ['famila', 'familia'],
        logo_url: null,
        color: '#e2001a',
        country: 'DE',
        kind: 'supermarket',
    },
    {
        id: 'combi',
        name: 'Combi',
        aliases: ['combi', 'combi verbrauchermarkt'],
        logo_url: null,
        color: '#e2001a',
        country: 'DE',
        kind: 'supermarket',
    },
    {
        id: 'wasgau',
        name: 'Wasgau',
        aliases: ['wasgau'],
        logo_url: null,
        color: '#d30013',
        country: 'DE',
        kind: 'supermarket',
    },
    {
        id: 'citti',
        name: 'CITTI',
        aliases: ['citti', 'citti markt'],
        logo_url: null,
        color: '#e30613',
        country: 'DE',
        kind: 'hypermarket',
    },
    {
        id: 'v-markt',
        name: 'V-Markt',
        aliases: ['v-markt', 'v markt', 'vmarkt'],
        logo_url: null,
        color: '#e30613',
        country: 'DE',
        kind: 'hypermarket',
    },
    {
        id: 'feneberg',
        name: 'Feneberg',
        aliases: ['feneberg'],
        logo_url: null,
        color: '#e30613',
        country: 'DE',
        kind: 'supermarket',
    },

    // ─── Discounters ──────────────────────────────────────────────────────
    {
        id: 'lidl',
        name: 'Lidl',
        aliases: ['lidl'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Lidl-Logo.svg&w=200',
        color: '#0050aa',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'aldi-sued',
        name: 'ALDI SÜD',
        aliases: ['aldi süd', 'aldi sued', 'aldi s', 'aldisued'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Aldi_S%C3%BCd_2017_logo.svg&w=200',
        color: '#00005f',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'aldi-nord',
        name: 'ALDI Nord',
        aliases: ['aldi nord', 'aldi n', 'aldinord'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Aldi_Nord_201x_logo.svg&w=200',
        color: '#0e3386',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'aldi',
        name: 'ALDI',
        aliases: ['aldi'],
        logo_url: null,
        color: '#00005f',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'penny',
        name: 'Penny',
        aliases: ['penny', 'penny markt'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Penny-Logo.svg&w=200',
        color: '#cd1719',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'netto',
        name: 'Netto Marken-Discount',
        aliases: ['netto', 'netto marken-discount', 'netto marken discount', 'netto md'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Netto_logo.svg&w=200',
        color: '#ffe500',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'netto-dansk',
        name: 'Netto (Dansk)',
        aliases: ['netto dansk', 'netto scottie', 'netto mit hund'],
        logo_url: null,
        color: '#ffd500',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'norma',
        name: 'Norma',
        aliases: ['norma'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Norma_Logo.svg&w=200',
        color: '#ee7f00',
        country: 'DE',
        kind: 'discounter',
    },
    {
        id: 'mix-markt',
        name: 'Mix Markt',
        aliases: ['mix markt', 'mixmarkt'],
        logo_url: null,
        color: '#d40000',
        country: 'DE',
        kind: 'discounter',
    },

    // ─── Bio / organic ────────────────────────────────────────────────────
    {
        id: 'alnatura',
        name: 'Alnatura',
        aliases: ['alnatura', 'alnatura super natur markt'],
        logo_url: null,
        color: '#00a651',
        country: 'DE',
        kind: 'bio',
    },
    {
        id: 'denns',
        name: "Denn's Biomarkt",
        aliases: ['denns', "denn's", 'denns biomarkt', "denn's biomarkt"],
        logo_url: null,
        color: '#f29400',
        country: 'DE',
        kind: 'bio',
    },
    {
        id: 'bio-company',
        name: 'Bio Company',
        aliases: ['bio company', 'biocompany'],
        logo_url: null,
        color: '#009640',
        country: 'DE',
        kind: 'bio',
    },
    {
        id: 'basic',
        name: 'Basic',
        aliases: ['basic', 'basic bio'],
        logo_url: null,
        color: '#76b82a',
        country: 'DE',
        kind: 'bio',
    },
    {
        id: 'ebl-naturkost',
        name: 'ebl-naturkost',
        aliases: ['ebl', 'ebl naturkost', 'ebl-naturkost'],
        logo_url: null,
        color: '#76b82a',
        country: 'DE',
        kind: 'bio',
    },

    // ─── Drugstores (sell groceries / drinks / baby food) ─────────────────
    {
        id: 'dm',
        name: 'dm-drogerie markt',
        aliases: ['dm', 'dm drogerie', 'dm-drogerie', 'dm-drogerie markt'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Dm_Logo.svg&w=200',
        color: '#00703c',
        country: 'DE',
        kind: 'drugstore',
    },
    {
        id: 'rossmann',
        name: 'Rossmann',
        aliases: ['rossmann'],
        logo_url: 'https://commons.wikimedia.org/w/thumb.php?f=Rossmann_Logo.svg&w=200',
        color: '#e2001a',
        country: 'DE',
        kind: 'drugstore',
    },
    {
        id: 'budni',
        name: 'Budnikowsky',
        aliases: ['budni', 'budnikowsky'],
        logo_url: null,
        color: '#ec6608',
        country: 'DE',
        kind: 'drugstore',
    },
    {
        id: 'mueller',
        name: 'Müller',
        aliases: ['müller', 'mueller', 'müller drogerie'],
        logo_url: null,
        color: '#e2001a',
        country: 'DE',
        kind: 'drugstore',
    },

    // ─── Cash & carry / wholesale ─────────────────────────────────────────
    {
        id: 'metro',
        name: 'Metro',
        aliases: ['metro', 'metro c+c', 'metro cash carry'],
        logo_url: null,
        color: '#003d7a',
        country: 'DE',
        kind: 'cash_carry',
    },
    {
        id: 'selgros',
        name: 'Selgros',
        aliases: ['selgros', 'selgros c+c'],
        logo_url: null,
        color: '#004b87',
        country: 'DE',
        kind: 'cash_carry',
    },
    {
        id: 'handelshof',
        name: 'Handelshof',
        aliases: ['handelshof'],
        logo_url: null,
        color: '#004b87',
        country: 'DE',
        kind: 'cash_carry',
    },

    // ─── Convenience / sub-brands ─────────────────────────────────────────
    {
        id: 'trinkgut',
        name: 'trinkgut',
        aliases: ['trinkgut'],
        logo_url: null,
        color: '#0050aa',
        country: 'DE',
        kind: 'convenience',
    },
    {
        id: 'getraenke-hoffmann',
        name: 'Getränke Hoffmann',
        aliases: ['getränke hoffmann', 'getraenke hoffmann', 'hoffmann'],
        logo_url: null,
        color: '#e30613',
        country: 'DE',
        kind: 'convenience',
    },
]

/**
 * Build an index from normalized alias → chain id for O(1) lookup.
 * Safe to call at module load time.
 */
export const STORE_CHAIN_ALIAS_INDEX = (() => {
    const idx = new Map()
    for (const c of STORE_CHAINS) {
        const keys = new Set([c.id, c.name, ...(c.aliases || [])])
        for (const key of keys) {
            const norm = normalizeChainKey(key)
            if (norm) idx.set(norm, c.id)
        }
    }
    return idx
})()

/**
 * Normalize a chain name/alias for lookup:
 *  - lowercase
 *  - umlaut expansion
 *  - strip punctuation and collapse whitespace
 */
export function normalizeChainKey(str) {
    if (!str) return ''
    return String(str)
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ')
}

export function getStoreChain(id) {
    return STORE_CHAINS.find((c) => c.id === id) || null
}
