/**
 * Curated brand overlay — hand-maintained corrections and retailer private
 * labels that shadow the OFF-generated list (matched by `id`).
 *
 * Use this file to:
 *  1. Register retailer private labels with a `retailer_chain_id` that
 *     matches `storeChains.js` (enables private-label filtering, receipt
 *     attribution, and "show me Lidl's own brands" queries).
 *  2. Fix names that the slug-humaniser mangles (e.g. "Dr Oetker" → "Dr. Oetker").
 *  3. Add aliases for fuzzy / OCR matching (e.g. "Gut & Günstig" for "gut-gunstig").
 *  4. Attach `logo_url`s that we host or have verified.
 *
 * Fields (all optional except `id`):
 *   id                  OFF slug — must match brands.generated.js to override
 *   name                Display name (preferred form with correct casing/punctuation)
 *   aliases             Extra strings used by findBrand() alias lookup
 *   retailer_chain_id   Slug from storeChains.js if this is a private label
 *   logo_url            Absolute URL, or null
 *   verified            true = hand-reviewed; false = placeholder
 *   notes               Free-form comment (not exported to the DB)
 */

export const BRANDS_CURATED = [
    // ─── REWE Group private labels ────────────────────────────────────────
    { id: 'ja', name: 'ja!', aliases: ['ja!', 'ja'], retailer_chain_id: 'rewe', verified: true },
    { id: 'rewe-beste-wahl', name: 'REWE Beste Wahl', retailer_chain_id: 'rewe', verified: true },
    { id: 'rewe-bio', name: 'REWE Bio', retailer_chain_id: 'rewe', verified: true },
    { id: 'rewe-feine-welt', name: 'REWE Feine Welt', retailer_chain_id: 'rewe', verified: true },
    { id: 'rewe-frei-von', name: 'REWE frei von', retailer_chain_id: 'rewe', verified: true },
    { id: 'rewe-regional', name: 'REWE Regional', retailer_chain_id: 'rewe', verified: true },
    { id: 'penny', name: 'Penny', retailer_chain_id: 'penny', verified: true },
    { id: 'penny-naturgut', name: 'Naturgut (Penny)', aliases: ['naturgut'], retailer_chain_id: 'penny', verified: true },
    { id: 'san-fabio', name: 'San Fabio', retailer_chain_id: 'penny', verified: true },
    { id: 'mibell', name: 'Mibell', retailer_chain_id: 'penny', verified: true },

    // ─── EDEKA Group private labels ──────────────────────────────────────
    {
        id: 'gut-gunstig',
        name: 'Gut & Günstig',
        aliases: ['gut & günstig', 'gut und günstig', 'gut und guenstig', 'gut&günstig', 'g&g', 'gut u günstig', 'gut u guenstig'],
        retailer_chain_id: 'edeka',
        verified: true,
    },
    { id: 'edeka', name: 'EDEKA', retailer_chain_id: 'edeka', verified: true },
    { id: 'edeka-bio', name: 'EDEKA Bio', retailer_chain_id: 'edeka', verified: true },
    { id: 'edeka-selection', name: 'EDEKA Selection', retailer_chain_id: 'edeka', verified: true },
    { id: 'bio-wertkost', name: 'Bio Wertkost', retailer_chain_id: 'edeka', verified: true },
    { id: 'rio-grande', name: 'Rio Grande', retailer_chain_id: 'edeka', verified: true },
    { id: 'elkos', name: 'Elkos', retailer_chain_id: 'edeka', verified: true },

    // ─── Schwarz Gruppe (Lidl + Kaufland) ────────────────────────────────
    { id: 'lidl', name: 'Lidl', retailer_chain_id: 'lidl', verified: true },
    { id: 'milbona', name: 'Milbona', retailer_chain_id: 'lidl', verified: true },
    { id: 'vemondo', name: 'Vemondo', retailer_chain_id: 'lidl', verified: true },
    { id: 'dulano', name: 'Dulano', retailer_chain_id: 'lidl', verified: true },
    { id: 'pilos', name: 'Pilos', retailer_chain_id: 'lidl', verified: true },
    { id: 'chef-select', name: 'Chef Select', retailer_chain_id: 'lidl', verified: true },
    { id: 'combino', name: 'Combino', retailer_chain_id: 'lidl', verified: true },
    { id: 'freeway', name: 'Freeway', retailer_chain_id: 'lidl', verified: true },
    { id: 'saskia', name: 'Saskia', retailer_chain_id: 'lidl', verified: true },
    { id: 'cien', name: 'Cien', retailer_chain_id: 'lidl', verified: true },

    { id: 'k-classic', name: 'K-Classic', retailer_chain_id: 'kaufland', verified: true },
    { id: 'k-bio', name: 'K-Bio', retailer_chain_id: 'kaufland', verified: true },
    { id: 'k-take-it-veggie', name: 'K-take it veggie', retailer_chain_id: 'kaufland', verified: true },
    { id: 'kaufland', name: 'Kaufland', retailer_chain_id: 'kaufland', verified: true },

    // ─── ALDI ─────────────────────────────────────────────────────────────
    { id: 'aldi', name: 'ALDI', retailer_chain_id: 'aldi', verified: true },
    { id: 'aldi-sud', name: 'ALDI SÜD', aliases: ['aldi süd', 'aldi sued'], retailer_chain_id: 'aldi-sued', verified: true },
    { id: 'aldi-nord', name: 'ALDI Nord', retailer_chain_id: 'aldi-nord', verified: true },
    { id: 'gut-bio', name: 'GUT bio', retailer_chain_id: 'aldi-nord', verified: true },
    { id: 'fair-gut', name: 'Fair & Gut', retailer_chain_id: 'aldi-sued', verified: true },
    { id: 'meine-metzgerei', name: 'Meine Metzgerei', retailer_chain_id: 'aldi-sued', verified: true },
    { id: 'mamia', name: 'Mamia', retailer_chain_id: 'aldi', verified: true },
    { id: 'ombia', name: 'Ombia', retailer_chain_id: 'aldi', verified: true },
    { id: 'moser-roth', name: 'Moser Roth', retailer_chain_id: 'aldi', verified: true },

    // ─── Netto MD ─────────────────────────────────────────────────────────
    { id: 'biobio', name: 'BioBio', retailer_chain_id: 'netto', verified: true },
    { id: 'bio-plus', name: 'Bio+', aliases: ['bio+', 'bio plus'], retailer_chain_id: 'netto', verified: true },
    { id: 'netto', name: 'Netto Marken-Discount', retailer_chain_id: 'netto', verified: true },

    // ─── dm & Rossmann ────────────────────────────────────────────────────
    { id: 'dm-bio', name: 'dmBio', aliases: ['dmbio', 'dm bio'], retailer_chain_id: 'dm', verified: true },
    { id: 'dmbio', name: 'dmBio', aliases: ['dmbio', 'dm bio'], retailer_chain_id: 'dm', verified: true },
    { id: 'balea', name: 'Balea', retailer_chain_id: 'dm', verified: true },
    { id: 'alverde', name: 'alverde', retailer_chain_id: 'dm', verified: true },
    { id: 'enerbio', name: 'enerBiO', retailer_chain_id: 'rossmann', verified: true },
    { id: 'ener-bio', name: 'enerBiO', retailer_chain_id: 'rossmann', verified: true },
    { id: 'isana', name: 'Isana', retailer_chain_id: 'rossmann', verified: true },
    { id: 'alterra', name: 'Alterra', retailer_chain_id: 'rossmann', verified: true },

    // ─── Bio / organic chains that are also brands ───────────────────────
    { id: 'alnatura', name: 'Alnatura', retailer_chain_id: 'alnatura', verified: true },
    { id: 'denree', name: 'dennree', aliases: ['dennree'], retailer_chain_id: 'denns', verified: true },
    { id: 'dennree', name: 'dennree', retailer_chain_id: 'denns', verified: true },
    { id: 'basic', name: 'Basic', retailer_chain_id: 'basic', verified: true },

    // ─── Major national-brand name corrections (no retailer) ──────────────
    { id: 'dr-oetker', name: 'Dr. Oetker', aliases: ['dr oetker'], verified: true },
    { id: 'hipp', name: 'HiPP', verified: true },
    { id: 'kellogg-s', name: "Kellogg's", aliases: ['kelloggs', 'kellogg s'], verified: true },
    { id: 'nestle', name: 'Nestlé', aliases: ['nestle'], verified: true },
    { id: 'ferrero', name: 'Ferrero', verified: true },
    { id: 'haribo', name: 'Haribo', verified: true },
    { id: 'ritter-sport', name: 'Ritter Sport', verified: true },
    { id: 'milka', name: 'Milka', verified: true },
    { id: 'knorr', name: 'Knorr', verified: true },
    { id: 'maggi', name: 'Maggi', verified: true },
    { id: 'iglo', name: 'Iglo', verified: true },
    { id: 'bonduelle', name: 'Bonduelle', verified: true },
    { id: 'barilla', name: 'Barilla', verified: true },
    { id: 'mutti', name: 'Mutti', verified: true },
    { id: 'rama', name: 'Rama', verified: true },
    { id: 'du-darfst', name: 'Du darfst', aliases: ['du darfst'], verified: true },
    { id: 'landliebe', name: 'Landliebe', verified: true },
    { id: 'muller', name: 'Müller', aliases: ['mueller'], verified: true },
    { id: 'weihenstephan', name: 'Weihenstephan', verified: true },
    { id: 'zott', name: 'Zott', verified: true },
    { id: 'bauer', name: 'Bauer', verified: true },
    { id: 'ehrmann', name: 'Ehrmann', verified: true },
    { id: 'danone', name: 'Danone', verified: true },
    { id: 'activia', name: 'Activia', verified: true },
    { id: 'actimel', name: 'Actimel', verified: true },
    { id: 'fruchtzwerge', name: 'Fruchtzwerge', verified: true },
    { id: 'coca-cola', name: 'Coca-Cola', aliases: ['coca cola', 'cocacola'], verified: true },
    { id: 'fanta', name: 'Fanta', verified: true },
    { id: 'sprite', name: 'Sprite', verified: true },
    { id: 'pepsi', name: 'Pepsi', verified: true },
    { id: 'red-bull', name: 'Red Bull', aliases: ['redbull'], verified: true },
    { id: 'fritz-kola', name: 'fritz-kola', aliases: ['fritz kola', 'fritzkola'], verified: true },
    { id: 'volvic', name: 'Volvic', verified: true },
    { id: 'vittel', name: 'Vittel', verified: true },
    { id: 'evian', name: 'Evian', verified: true },
    { id: 'gerolsteiner', name: 'Gerolsteiner', verified: true },
    { id: 'apollinaris', name: 'Apollinaris', verified: true },
    { id: 'adelholzener', name: 'Adelholzener', verified: true },
    { id: 'warsteiner', name: 'Warsteiner', verified: true },
    { id: 'beck-s', name: "Beck's", aliases: ['becks'], verified: true },
    { id: 'bitburger', name: 'Bitburger', verified: true },
    { id: 'krombacher', name: 'Krombacher', verified: true },
    { id: 'paulaner', name: 'Paulaner', verified: true },
    { id: 'augustiner', name: 'Augustiner', verified: true },
    { id: 'erdinger', name: 'Erdinger', verified: true },
    { id: 'radeberger', name: 'Radeberger', verified: true },
    { id: 'jagermeister', name: 'Jägermeister', aliases: ['jaegermeister'], verified: true },
    { id: 'wurzener', name: 'Wurzener', verified: true },
    { id: 'seitenbacher', name: 'Seitenbacher', verified: true },
    { id: 'alpro', name: 'Alpro', verified: true },
    { id: 'oatly', name: 'Oatly', verified: true },
    { id: 'rugenwalder-muhle', name: 'Rügenwalder Mühle', aliases: ['ruegenwalder muehle'], verified: true },
    { id: 'wiesenhof', name: 'Wiesenhof', verified: true },
    { id: 'gutfried', name: 'Gutfried', verified: true },
    { id: 'meica', name: 'Meica', verified: true },
    { id: 'herta', name: 'Herta', verified: true },
    { id: 'reinert', name: 'Reinert', verified: true },
    { id: 'homann', name: 'Homann', verified: true },
    { id: 'birkel', name: 'Birkel', verified: true },
    { id: '3-glocken', name: '3 Glocken', verified: true },
    { id: 'alnavit', name: 'Alnavit', verified: true },
    { id: 'hanuta', name: 'Hanuta', verified: true },
    { id: 'duplo', name: 'Duplo', verified: true },
    { id: 'kinder', name: 'Kinder', verified: true },
    { id: 'raffaello', name: 'Raffaello', verified: true },
    { id: 'mon-cheri', name: 'Mon Chéri', aliases: ['mon cheri'], verified: true },
    { id: 'lindt', name: 'Lindt', verified: true },
    { id: 'rittersport', name: 'Ritter Sport', verified: true },
    { id: 'zentis', name: 'Zentis', verified: true },
    { id: 'schwartau', name: 'Schwartau', verified: true },
    { id: 'nutella', name: 'Nutella', verified: true },
]
