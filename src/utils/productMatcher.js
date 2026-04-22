/**
 * NLP-Produkt-Matcher — ordnet Freitext-Eingaben generischen Katalogprodukten zu.
 *
 * Verwendung:
 *  - Manuelle Eingabe → Autovervollständigung, Kategorie + Emoji
 *  - Barcode-Produktname → Icon aus dem Katalog
 *  - Kassenbon-OCR → generisches Produkt zuordnen
 *
 * Ablauf:
 *  1. Eingabe normalisieren (Kleinbuchstaben, Umlaute expandieren)
 *  2. Markennamen entfernen (bekannte deutsche Supermarkt- & Lebensmittelmarken)
 *  3. Tokens gegen vorindizierte Katalogeinträge scoren
 *  4. Bestes Ergebnis liefert Kategorie + Emoji
 */

import PRODUCT_CATALOGUE from '../data/productCatalogue.js'
import { getProductEmoji } from '../data/productIcons.js'

// ─── Bekannte Marken (werden aus der Eingabe entfernt) ───────────────────────
const BRAND_WORDS = new Set([
    // Supermarkt-Eigenmarken
    'ja', 'gut', 'guenstig', 'rewe', 'beste', 'wahl', 'edeka', 'bio',
    'aldi', 'lidl', 'penny', 'netto', 'kaufland', 'real', 'norma',
    'dm', 'rossmann', 'mueller', 'budni',
    'gut&guenstig', 'bio+', 'bioland', 'demeter', 'naturland',
    'eigenmarke', 'markus', 'mühle', 'muehle',
    // Große Marken — Milchprodukte
    'weihenstephan', 'landliebe', 'mueller', 'muellermilch', 'bauer',
    'almighurt', 'ehrmann', 'zott', 'danone', 'activia', 'exquisa',
    'philadelphia', 'kerrygold', 'meggle', 'rama', 'becel', 'arla',
    // Fleisch & Wurst
    'wiesenhof', 'ruegenwalder', 'herta', 'boeklunder', 'meica',
    'dulano', 'gutfried', 'fleischwerke', 'zimbo',
    // Brot & Getreide
    'harry', 'golden', 'toast', 'lieken', 'mestemacher',
    'barilla', 'degiorno', 'buitoni', 'bernbacher', 'birkel',
    'uncle', 'bens', 'reis-fit', 'oryza',
    // Getränke
    'gerolsteiner', 'volvic', 'evian', 'vittel', 'selters', 'vilsa',
    'apollinaris', 'adelholzener', 'bad', 'liebenzeller',
    'coca', 'cola', 'pepsi', 'fanta', 'sprite', 'schweppes', 'mezzo',
    'fritz', 'kola', 'bionade', 'almdudler',
    'jacobs', 'tchibo', 'melitta', 'dallmayr', 'lavazza', 'nescafe',
    'twinings', 'teekanne', 'messmer',
    'oettinger', 'krombacher', 'becks', 'bitburger', 'warsteiner',
    'paulaner', 'erdinger', 'franziskaner', 'augustiner', 'veltins',
    'haseroeder', 'koenigpilsener',
    // Süßwaren & Snacks
    'milka', 'ritter', 'lindt', 'ferrero', 'kinderschokolade',
    'kinder', 'nutella', 'duplo', 'hanuta', 'merci', 'toblerone',
    'mars', 'snickers', 'twix', 'bounty', 'kitkat', 'nestle',
    'haribo', 'katjes', 'trolli', 'nimm2',
    'pringles', 'lorenz', 'chio', 'funny-frisch', 'funnyfrisch',
    'leibniz', 'bahlsen', 'debeuk', 'griesson',
    // Fertiggerichte & Soßen
    'knorr', 'maggi', 'pfanni', 'miracoli', 'mondamin', 'maizena',
    'dr', 'oetker', 'droetker', 'iglo', 'frosta', 'wagner',
    'coppenrath', 'wiese',
    'heinz', 'develey', 'kuehne', 'thomy', 'hela', 'homann',
    'bertolli', 'miracel', 'whip', 'hellmanns', 'tabasco',
    'mutti', 'oro', 'pomodoro', 'barilla',
    // Körperpflege & Haushalt
    'nivea', 'dove', 'rexona', 'axe', 'oldspice', 'loral', 'loreal',
    'garnier', 'schwarzkopf', 'head', 'shoulders', 'pantene',
    'oral-b', 'colgate', 'elmex', 'aronal', 'odol',
    'persil', 'ariel', 'perwoll', 'lenor', 'vernel', 'spee',
    'fairy', 'pril', 'somat', 'finish', 'calgon',
    'domestos', 'sagrotan', 'meister', 'proper',
    'pampers', 'huggies', 'hipp', 'alete', 'bebivita', 'milupa',
    'aptamil', 'humana',
    'whiskas', 'felix', 'sheba', 'pedigree', 'chappi', 'purina',
    // Generische Markenwörter die rauschen
    'nr', 'no', 'original', 'klassik', 'classic', 'premium',
    'extra', 'spezial', 'special', 'gourmet', 'feinste', 'feine',
    'tradition', 'traditionell', 'nach', 'art', 'weise',
])

// ─── Normalisierung ──────────────────────────────────────────────────────────

/**
 * Normalisiert einen String für den Vergleich:
 * Kleinbuchstaben, Umlaute expandieren, ß→ss, Satzzeichen entfernen.
 */
function normalize(str) {
    if (!str) return ''
    return str
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s]/g, ' ')
        .trim()
}

/**
 * Splittet normalisierten String in Tokens,
 * filtert Markennamen und Einzeichen-Wörter.
 */
function tokenize(str, stripBrands = false) {
    const words = str.split(/\s+/).filter(w => w.length >= 2)
    if (!stripBrands) return words
    const filtered = words.filter(w => !BRAND_WORDS.has(w))
    // Wenn alles weggefiltert wurde, Originaltokens verwenden
    return filtered.length > 0 ? filtered : words
}

// ─── Levenshtein ─────────────────────────────────────────────────────────────

function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 3) return 99
    const m = a.length, n = b.length
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1))
    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        }
    }
    return dp[m][n]
}

// ─── Token-Scoring ───────────────────────────────────────────────────────────

/**
 * Wie gut passt Input-Token `a` zu Katalog-Token `b`?
 * Gibt einen Wert von 0 (kein Match) bis 1 (exakt) zurück.
 */
function tokenSimilarity(a, b) {
    if (a === b) return 1.0
    // Präfix — z.B. "spag" → "spaghetti"
    if (a.length >= 3 && b.startsWith(a)) return 0.85
    if (b.length >= 3 && a.startsWith(b)) return 0.80
    // Substring — z.B. "milch" in "vollmilch"
    // Minimum 4 chars to avoid coincidental matches like "gin" in "original"
    if (a.length >= 4 && b.includes(a)) return 0.75
    if (b.length >= 4 && a.includes(b)) return 0.70
    // Levenshtein für Tippfehler
    if (a.length >= 4 && b.length >= 4) {
        const dist = editDistance(a, b)
        const maxLen = Math.max(a.length, b.length)
        if (dist <= 1) return 0.85
        if (dist <= 2 && maxLen >= 7) return 0.65
    }
    return 0
}

// ─── Suchindex ───────────────────────────────────────────────────────────────

/**
 * Vorberechneter Index: jeder Katalogeintrag bekommt seine
 * normalisierten Tokens + ein "joined" Feld für Compound-Matching.
 */
const INDEX = PRODUCT_CATALOGUE.map(p => ({
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || null,
    unit: p.defaultUnit,
    qty: p.defaultQty,
    norm: normalize(p.name),
    tokens: tokenize(normalize(p.name)),
    subTokens: p.subcategory ? tokenize(normalize(p.subcategory)) : [],
}))

// Set of all subcategory-name tokens (single words). Used to detect when a
// user input explicitly names a subcategory (e.g. "Schokolade", "Käse"),
// which should strongly bias matches toward products in that subcategory.
const SUBCATEGORY_TOKENS = new Set()
for (const p of PRODUCT_CATALOGUE) {
    if (!p.subcategory) continue
    for (const tok of tokenize(normalize(p.subcategory))) {
        if (tok.length >= 4) SUBCATEGORY_TOKENS.add(tok)
    }
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Berechnet einen Score (0–1) zwischen Eingabe-Tokens und einem Katalogeintrag.
 *
 * Zwei Richtungen:
 *  - Vorwärts:  Wie viele Input-Tokens finden sich im Katalog? (Recall)
 *  - Rückwärts: Wie viele Katalog-Tokens deckt die Eingabe ab? (Precision)
 *
 * Der Gesamtscore gewichtet Vorwärts stärker (die Eingabe soll abgedeckt sein).
 */
function scoreEntry(inputTokens, entry) {
    const catTokens = entry.tokens
    if (inputTokens.length === 0 || catTokens.length === 0) return 0

    // Exakter Treffer auf normalisierten Gesamtstring
    const inputJoined = inputTokens.join(' ')
    if (inputJoined === entry.norm) return 1.0

    // Input ist exakter Einzeltoken und der Katalogname beginnt damit
    // z.B. "Haferflocken" → "Haferflocken (zart)" soll höher ranken als "Haferflockenkekse"
    if (inputTokens.length === 1 && catTokens.length > 0 && catTokens[0] === inputTokens[0]) {
        return 0.95
    }

    // Vorwärts: jedes Input-Token → bester Katalogtreffer
    let forwardSum = 0
    for (const it of inputTokens) {
        let best = 0
        for (const ct of catTokens) {
            const sim = tokenSimilarity(it, ct)
            if (sim > best) best = sim
            if (best === 1.0) break
        }
        // Compound-Check: Input-Token in den gesamten Katalognamen suchen
        if (best < 0.75 && it.length >= 4 && entry.norm.includes(it)) {
            best = Math.max(best, 0.75)
        }
        forwardSum += best
    }
    const forwardScore = forwardSum / inputTokens.length

    // Rückwärts: jedes Katalog-Token → bester Input-Treffer
    let reverseSum = 0
    for (const ct of catTokens) {
        let best = 0
        for (const it of inputTokens) {
            const sim = tokenSimilarity(ct, it)
            if (sim > best) best = sim
            if (best === 1.0) break
        }
        if (best < 0.75 && ct.length >= 4 && inputJoined.includes(ct)) {
            best = Math.max(best, 0.75)
        }
        reverseSum += best
    }
    const reverseScore = reverseSum / catTokens.length

    // Gewichtung: 60 % Vorwärts (Eingabe abdecken), 40 % Rückwärts
    return forwardScore * 0.6 + reverseScore * 0.4
}

// ─── Öffentliche API ─────────────────────────────────────────────────────────

/**
 * Findet die besten Treffer im Produktkatalog für eine Freitexteingabe.
 *
 * @param {string} input — Benutzer-Eingabe (kann Markenname, Tippfehler etc. enthalten)
 * @param {object} [options]
 * @param {number} [options.topN=5]        — max. Anzahl Ergebnisse
 * @param {number} [options.threshold=0.3] — minimaler Score (0–1)
 * @returns {Array<{ name, category, subcategory, unit, qty, emoji, score }>}
 */
export function matchProduct(input, { topN = 5, threshold = 0.3 } = {}) {
    if (!input || typeof input !== 'string') return []

    const norm = normalize(input)
    const inputTokens = tokenize(norm, true) // Marken entfernen
    if (inputTokens.length === 0) return []

    // Detect which subcategory names the user explicitly mentions, so we can
    // bias the final score toward products in those subcategories. E.g.
    // "Dunkle Schokolade" names subcategory "Schokolade" → prefer real
    // chocolate products over "Schokoladenkekse" (which lives under "Kekse").
    const hintedSubTokens = new Set(inputTokens.filter(t => SUBCATEGORY_TOKENS.has(t)))

    const scored = []
    for (const entry of INDEX) {
        let score = scoreEntry(inputTokens, entry)
        if (score >= threshold) {
            // Subcategory-hint boost: the entry's subcategory shares a token
            // with a subcategory-name explicitly used in the input.
            if (hintedSubTokens.size && entry.subTokens.some(t => hintedSubTokens.has(t))) {
                score = Math.min(1, score + 0.15)
            }
            scored.push({
                name: entry.name,
                category: entry.category,
                subcategory: entry.subcategory,
                unit: entry.unit,
                qty: entry.qty,
                emoji: getProductEmoji(entry.name, entry.category),
                score,
            })
        }
    }

    // Sortieren nach Score absteigend, bei Gleichstand kürzerer Name bevorzugt.
    // Zusätzlich: bei gleichem Score werden Einträge bevorzugt, die den
    // Input-Text als eigenständiges Wort (nicht nur als Suffix) enthalten.
    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        // Bevorzuge kürzere Namen (näher am generischen Produkt)
        return a.name.length - b.name.length
    })

    // Duplikate entfernen (gleicher Name kann in mehreren Kategorien vorkommen)
    const seen = new Set()
    const unique = []
    for (const s of scored) {
        if (!seen.has(s.name)) {
            seen.add(s.name)
            unique.push(s)
        }
        if (unique.length >= topN) break
    }

    return unique
}

/**
 * Gibt den besten Treffer zurück (oder null).
 *
 * @param {string} input
 * @param {number} [threshold=0.4] — höherer Schwellenwert für Einzeltreffer
 * @returns {{ name, category, subcategory, unit, qty, emoji, score } | null}
 */
export function bestMatch(input, threshold = 0.4) {
    const results = matchProduct(input, { topN: 1, threshold })
    return results[0] || null
}

/**
 * Gibt nur das Emoji des besten Treffers zurück.
 * Fallback: 🛒
 */
export function matchProductEmoji(input) {
    const m = bestMatch(input, 0.35)
    return m ? m.emoji : '🛒'
}

/**
 * Gibt Kategorie + Emoji des besten Treffers zurück.
 * Nützlich, um bei manueller Eingabe automatisch die Kategorie vorzuschlagen.
 */
export function inferCategoryAndEmoji(input) {
    const m = bestMatch(input, 0.35)
    return m
        ? { category: m.category, subcategory: m.subcategory, emoji: m.emoji, matchedProduct: m.name, confidence: m.score }
        : null
}
