/**
 * Produktkatalog — markenunabhängige Standardprodukte für den deutschen Markt.
 *
 * Struktur:  Category → Subcategory → Produkt (mit Standardeinheit/-menge)
 *
 *  Level 1: Category      (e.g. "Dairy & Eggs")
 *  Level 2: Subcategory   (e.g. "Milch", "Joghurt", "Reis")
 *  Level 3: Product name  (e.g. "Vollmilch 3,5 %", "Basmati-Reis")
 *
 * Wird für Autovervollständigung, Vorschläge und Schnell-Hinzufügen verwendet.
 * Kategorien stimmen mit CATEGORIES in utils/classify.js überein.
 * Subcategories sind in data/subcategories.js registriert.
 */

const PRODUCT_CATALOGUE = [
    // ═════════════════════════════════════════════════════════════════════════
    // DAIRY & EGGS — Milch, Käse, Eier
    // ═════════════════════════════════════════════════════════════════════════

    // ── Milch ─────────────────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Vollmilch 3,5 %', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Fettarme Milch 1,5 %', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Magermilch 0,3 %', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'H-Milch (haltbar)', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Laktosefreie Milch', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Bio-Milch', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Ziegenmilch', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Buttermilch', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Kondensmilch', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Kaffeesahne', defaultUnit: 'ml', defaultQty: 340 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Milchpulver', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Kakaotrunk / Schokomilch', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Milch', name: 'Bananenmilch', defaultUnit: 'ml', defaultQty: 500 },

    // ── Joghurt ──────────────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Joghurt', name: 'Naturjoghurt', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Joghurt', name: 'Griechischer Joghurt', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Joghurt', name: 'Fruchtjoghurt', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Dairy & Eggs', subcategory: 'Joghurt', name: 'Trinkjoghurt', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Joghurt', name: 'Skyr', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Dairy & Eggs', subcategory: 'Joghurt', name: 'Joghurt laktosefrei', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Joghurt', name: 'Sahnejoghurt', defaultUnit: 'g', defaultQty: 150 },

    // ── Quark ──────────────────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Quark', name: 'Magerquark', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Quark', name: 'Sahnequark', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Quark', name: 'Kräuterquark', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Quark', name: 'Fruchtquark', defaultUnit: 'g', defaultQty: 500 },

    // ── Milchdesserts ─────────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Milchdesserts', name: 'Grießpudding', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Milchdesserts', name: 'Milchreis (Becher)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Milchdesserts', name: 'Pudding (Becher)', defaultUnit: 'g', defaultQty: 200 },

    // ── Fermentierte Milch ────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Fermentierte Milch', name: 'Kefir', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Fermentierte Milch', name: 'Ayran', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Fermentierte Milch', name: 'Dickmilch', defaultUnit: 'ml', defaultQty: 500 },

    // ── Käse — Schnitt- & Hartkäse ────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Gouda jung', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Gouda mittelalt', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Gouda alt', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Edamer', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Emmentaler', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Tilsiter', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Butterkäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Bergkäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Appenzeller', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Comté', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Gruyère', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Parmesan / Parmigiano', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Pecorino', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Cheddar', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Raclette-Käse', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Schnitt- & Hartkäse', name: 'Manchego', defaultUnit: 'g', defaultQty: 150 },

    // ── Käse — Weichkäse ──────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Brie', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Camembert', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Blauschimmelkäse', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Gorgonzola', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Roquefort', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Limburger', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Harzer Käse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Weichkäse', name: 'Obatzda', defaultUnit: 'g', defaultQty: 125 },

    // ── Käse — Frischkäse & Aufstrich ─────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Frischkäse natur', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Frischkäse Kräuter', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Doppelrahmfrischkäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Hüttenkäse / Körniger Frischkäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Schmelzkäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Schmelzkäsescheiben', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Streichkäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Kräuterkäse', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Frischkäse & Aufstrich', name: 'Ziegenkäse', defaultUnit: 'g', defaultQty: 150 },

    // ── Käse — Italienisch ────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Käse — Italienisch', name: 'Mozzarella', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Italienisch', name: 'Burrata', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Italienisch', name: 'Mascarpone', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Italienisch', name: 'Ricotta', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Italienisch', name: 'Provolone', defaultUnit: 'g', defaultQty: 200 },

    // ── Käse — Sonstiges ──────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Käse — Sonstiges', name: 'Feta / Hirtenkäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Sonstiges', name: 'Halloumi', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Sonstiges', name: 'Käsescheiben (Aufschnitt)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Sonstiges', name: 'Reibekäse / Streukäse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Sonstiges', name: 'Pizza-Käse (gerieben)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Sonstiges', name: 'Käse am Stück', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Dairy & Eggs', subcategory: 'Käse — Sonstiges', name: 'Veganer Käse', defaultUnit: 'g', defaultQty: 200 },

    // ── Butter & Margarine ────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Deutsche Markenbutter', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Süßrahmbutter', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Sauerrahmbutter', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Mildgesäuerte Butter', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Irische Butter', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Halbfettbutter', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Butterschmalz / Ghee', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Margarine', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Dairy & Eggs', subcategory: 'Butter & Margarine', name: 'Pflanzenmargarine', defaultUnit: 'g', defaultQty: 250 },

    // ── Sahne & Crème ─────────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Sahne & Crème', name: 'Schlagsahne', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Sahne & Crème', name: 'Saure Sahne', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Sahne & Crème', name: 'Schmand', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Sahne & Crème', name: 'Crème fraîche', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Sahne & Crème', name: 'Kochsahne', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Dairy & Eggs', subcategory: 'Sahne & Crème', name: 'Sprühsahne', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Dairy & Eggs', subcategory: 'Sahne & Crème', name: 'Sahnesteif', defaultUnit: 'pc', defaultQty: 5 },

    // ── Eier ──────────────────────────────────────────────────────────────
    { category: 'Dairy & Eggs', subcategory: 'Eier', name: 'Eier (Freilandhaltung)', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Dairy & Eggs', subcategory: 'Eier', name: 'Eier (Bodenhaltung)', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Dairy & Eggs', subcategory: 'Eier', name: 'Bio-Eier', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Dairy & Eggs', subcategory: 'Eier', name: 'Wachteleier', defaultUnit: 'pc', defaultQty: 12 },
    { category: 'Dairy & Eggs', subcategory: 'Eier', name: 'Flüssiges Eiweiß', defaultUnit: 'ml', defaultQty: 500 },

    // ═════════════════════════════════════════════════════════════════════════
    // FRUITS & VEG — Obst & Gemüse
    // ═════════════════════════════════════════════════════════════════════════

    // ── Frisches Obst — Kernobst ──────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Kernobst', name: 'Äpfel', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Kernobst', name: 'Birnen', defaultUnit: 'kg', defaultQty: 1 },

    // ── Frisches Obst — Zitrusfrüchte ─────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Zitrusfrüchte', name: 'Orangen', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Zitrusfrüchte', name: 'Zitronen', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Zitrusfrüchte', name: 'Limetten', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Zitrusfrüchte', name: 'Grapefruits', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Zitrusfrüchte', name: 'Clementinen / Mandarinen', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Zitrusfrüchte', name: 'Blutorangen', defaultUnit: 'kg', defaultQty: 1 },

    // ── Frisches Obst — Bananen & Tropisch ────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Bananen', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Mango', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Ananas', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Papaya', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Kokosnuss (frisch)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Passionsfrucht / Maracuja', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Drachenfrucht / Pitaya', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Litschis', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Kaki / Sharon-Frucht', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Sternfrucht / Karambole', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Guave', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Kochbanane', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Bananen & Tropisch', name: 'Physalis', defaultUnit: 'g', defaultQty: 100 },

    // ── Frisches Obst — Beeren ────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Erdbeeren', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Heidelbeeren', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Blaubeeren', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Himbeeren', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Brombeeren', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Johannisbeeren', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Stachelbeeren', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Beeren', name: 'Cranberries (frisch)', defaultUnit: 'g', defaultQty: 250 },

    // ── Frisches Obst — Steinobst ─────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Steinobst', name: 'Pfirsiche', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Steinobst', name: 'Nektarinen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Steinobst', name: 'Pflaumen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Steinobst', name: 'Aprikosen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Steinobst', name: 'Kirschen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Steinobst', name: 'Mirabellen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Steinobst', name: 'Zwetschgen', defaultUnit: 'g', defaultQty: 500 },

    // ── Frisches Obst — Trauben & Melonen ─────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Trauben & Melonen', name: 'Weintrauben (hell)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Trauben & Melonen', name: 'Weintrauben (dunkel)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Trauben & Melonen', name: 'Wassermelone', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Trauben & Melonen', name: 'Honigmelone', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Trauben & Melonen', name: 'Galiamelone', defaultUnit: 'pc', defaultQty: 1 },

    // ── Frisches Obst — Sonstiges ─────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Sonstiges', name: 'Granatapfel', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Sonstiges', name: 'Feigen (frisch)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Sonstiges', name: 'Kiwi', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Sonstiges', name: 'Rhabarber', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Frisches Obst — Sonstiges', name: 'Avocado', defaultUnit: 'pc', defaultQty: 2 },

    // ── Obstkonserven ─────────────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Pfirsiche (Dose)', defaultUnit: 'g', defaultQty: 410 },
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Ananas (Dose)', defaultUnit: 'g', defaultQty: 425 },
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Mandarinen (Dose)', defaultUnit: 'g', defaultQty: 312 },
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Birnen (Dose)', defaultUnit: 'g', defaultQty: 410 },
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Obstcocktail (Dose)', defaultUnit: 'g', defaultQty: 410 },
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Apfelmus', defaultUnit: 'g', defaultQty: 360 },
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Kirschen (Glas)', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Fruits & Veg', subcategory: 'Obstkonserven', name: 'Preiselbeeren (Glas)', defaultUnit: 'g', defaultQty: 400 },

    // ── Trockenfrüchte ────────────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Rosinen', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Sultaninen', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Getrocknete Aprikosen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Getrocknete Cranberries', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Getrocknete Feigen', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Datteln', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Pflaumen (getrocknet)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Studentenfutter', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Getrocknete Mango', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Bananenchips', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Kokosraspeln', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Fruits & Veg', subcategory: 'Trockenfrüchte', name: 'Gojibeeren', defaultUnit: 'g', defaultQty: 100 },

    // ── Gemüse — Wurzelgemüse ─────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Kartoffeln (festkochend)', defaultUnit: 'kg', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Kartoffeln (mehligkochend)', defaultUnit: 'kg', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Kartoffeln (vorwiegend festkochend)', defaultUnit: 'kg', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Süßkartoffeln', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Karotten / Möhren', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Rote Bete', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Pastinaken', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Steckrüben', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Radieschen', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Rettich', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Sellerie (Knolle)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Meerrettich (frisch)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Ingwer', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Kurkuma (frisch)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Wurzelgemüse', name: 'Topinambur', defaultUnit: 'g', defaultQty: 300 },

    // ── Gemüse — Zwiebeln & Knoblauch ─────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Zwiebeln & Knoblauch', name: 'Zwiebeln', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Zwiebeln & Knoblauch', name: 'Rote Zwiebeln', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Zwiebeln & Knoblauch', name: 'Frühlingszwiebeln', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Zwiebeln & Knoblauch', name: 'Schalotten', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Zwiebeln & Knoblauch', name: 'Knoblauch', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Zwiebeln & Knoblauch', name: 'Lauch / Porree', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Zwiebeln & Knoblauch', name: 'Bärlauch', defaultUnit: 'bunch', defaultQty: 1 },

    // ── Gemüse — Tomaten & Paprika ────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Tomaten', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Kirschtomaten', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Strauchtomaten / Rispentomaten', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Roma-Tomaten / Eiertomaten', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Paprika rot', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Paprika gelb', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Paprika grün', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Spitzpaprika', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Paprika-Mix', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Chilischoten', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Peperoni', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Tomaten & Paprika', name: 'Aubergine', defaultUnit: 'pc', defaultQty: 1 },

    // ── Gemüse — Kürbis & Gurke ───────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kürbis & Gurke', name: 'Gurke (Salatgurke)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kürbis & Gurke', name: 'Minigurken / Snackgurken', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kürbis & Gurke', name: 'Zucchini', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kürbis & Gurke', name: 'Butternut-Kürbis', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kürbis & Gurke', name: 'Hokkaido-Kürbis', defaultUnit: 'pc', defaultQty: 1 },

    // ── Gemüse — Kohl ─────────────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Brokkoli', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Blumenkohl', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Weißkohl', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Rotkohl', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Wirsing', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Rosenkohl', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Grünkohl', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Kohlrabi', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Chinakohl', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Pak Choi', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Romanesco', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Kohl', name: 'Spitzkohl', defaultUnit: 'pc', defaultQty: 1 },

    // ── Gemüse — Blattsalate & Grün ───────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Eisbergsalat', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Kopfsalat', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Romana-Salat', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Salatmischung (fertig)', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Blattspinat (frisch)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Babyspinat', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Rucola', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Feldsalat / Rapunzel', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Mangold', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Brunnenkresse', defaultUnit: 'g', defaultQty: 80 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Endivie', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Lollo Rosso', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Radicchio', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Blattsalate & Grün', name: 'Chicorée', defaultUnit: 'pc', defaultQty: 2 },

    // ── Gemüse — Stängel & Stiele ─────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Stängel & Stiele', name: 'Stangensellerie', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Stängel & Stiele', name: 'Spargel (grün)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Stängel & Stiele', name: 'Spargel (weiß)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Stängel & Stiele', name: 'Fenchel', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Stängel & Stiele', name: 'Artischocken', defaultUnit: 'pc', defaultQty: 2 },

    // ── Gemüse — Hülsenfrüchte & Mais ─────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Hülsenfrüchte & Mais', name: 'Maiskolben', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Hülsenfrüchte & Mais', name: 'Grüne Bohnen', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Hülsenfrüchte & Mais', name: 'Erbsen (frisch / Zuckerschoten)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Hülsenfrüchte & Mais', name: 'Zuckerschoten', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Hülsenfrüchte & Mais', name: 'Okra', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Hülsenfrüchte & Mais', name: 'Sojasprossen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Gemüse — Hülsenfrüchte & Mais', name: 'Bambussprossen', defaultUnit: 'g', defaultQty: 200 },

    // ── Pilze ─────────────────────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Champignons (weiß)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Champignons (braun)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Riesenchampignons / Portobello', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Shiitake-Pilze', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Austernpilze', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Kräuterseitlinge', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Pfifferlinge', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Steinpilze (getrocknet)', defaultUnit: 'g', defaultQty: 25 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Pilzmischung', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Pilze', name: 'Enoki-Pilze', defaultUnit: 'g', defaultQty: 100 },

    // ── Hülsenfrüchte (trocken & Dose) ────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Kichererbsen (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Kichererbsen (trocken)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Rote Linsen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Grüne Linsen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Braune Linsen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Beluga-Linsen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Kidneybohnen (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Schwarze Bohnen (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Weiße Bohnen (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Dicke Bohnen (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Bohnenmischung (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Edamame', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Gelbe Erbsen (trocken)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Hülsenfrüchte (trocken & Dose)', name: 'Mungobohnen (trocken)', defaultUnit: 'g', defaultQty: 500 },

    // ── Gemüsekonserven & Glas ─────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Mais (Dose)', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Erbsen (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Erbsen & Möhren (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Geschälte Tomaten (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Gehackte Tomaten (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Champignons (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Artischockenherzen (Glas)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Geröstete Paprika (Glas)', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Getrocknete Tomaten', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Rote Bete (gekocht/Glas)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Sauerkraut', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Rotkohl (Glas)', defaultUnit: 'g', defaultQty: 680 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Kimchi', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Kokosmilch (Dose)', defaultUnit: 'ml', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Gemüsekonserven & Glas', name: 'Kokoscreme (Dose)', defaultUnit: 'ml', defaultQty: 400 },

    // ── Frische Kräuter ───────────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Basilikum (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Petersilie (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Koriander (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Minze (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Dill (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Schnittlauch (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Rosmarin (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Thymian (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Salbei (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Estragon (frisch)', defaultUnit: 'bunch', defaultQty: 1 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Zitronengras', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Fruits & Veg', subcategory: 'Frische Kräuter', name: 'Kräutertopf (gemischt)', defaultUnit: 'pc', defaultQty: 1 },

    // ── Nüsse & Kerne ─────────────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Mandeln', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Walnüsse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Cashewkerne', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Erdnüsse', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Pistazien', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Haselnüsse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Paranüsse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Pekannüsse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Macadamia-Nüsse', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Nussmischung', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Nussmix', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Walnusskerne', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Pinienkerne', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Maronen / Esskastanien', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Sonnenblumenkerne', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Kürbiskerne', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Sesam', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Chiasamen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Leinsamen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Hanfsamen', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Fruits & Veg', subcategory: 'Nüsse & Kerne', name: 'Mohnsamen', defaultUnit: 'g', defaultQty: 100 },

    // ── Tofu & Soja ───────────────────────────────────────────────────────
    { category: 'Fruits & Veg', subcategory: 'Tofu & Soja', name: 'Tofu (Natur)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Tofu & Soja', name: 'Seidentofu', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Fruits & Veg', subcategory: 'Tofu & Soja', name: 'Räuchertofu', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Tofu & Soja', name: 'Tempeh', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Fruits & Veg', subcategory: 'Tofu & Soja', name: 'Seitan', defaultUnit: 'g', defaultQty: 200 },

    // ═════════════════════════════════════════════════════════════════════════
    // MEAT & FISH — Fleisch & Fisch
    // ═════════════════════════════════════════════════════════════════════════

    // ── Geflügel ──────────────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Hähnchenbrustfilet', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Hähnchenschenkel', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Hähnchenkeulen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Hähnchenflügel', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Ganzes Hähnchen', defaultUnit: 'kg', defaultQty: 1.2 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Hähnchenhackfleisch', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Putenbrust', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Putenhackfleisch', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Putensteak / Putenschnitzel', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Entenbrust', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Ganze Ente', defaultUnit: 'kg', defaultQty: 2 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Hähnchenleber', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Putengulasch', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Geflügel', name: 'Hähnchengeschnetzeltes', defaultUnit: 'g', defaultQty: 400 },

    // ── Rindfleisch ───────────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rindersteak (Rumpsteak)', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rindersteak (Entrecôte)', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rinderfilet', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rinderhackfleisch', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rindergulasch', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rinderbraten', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Tafelspitz', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rinderbrust', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Rinder-Rouladen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Suppenfleisch (Rind)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Corned Beef', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Meat & Fish', subcategory: 'Rindfleisch', name: 'Beef Jerky', defaultUnit: 'g', defaultQty: 50 },

    // ── Schweinefleisch ───────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinekotelett', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinefilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweineschnitzel', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinehackfleisch', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinebauch', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinerippchen / Spareribs', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweineschulter / Bug', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinebraten', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinegulasch', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Schweinenackensteak', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Hackfleisch gemischt (Rind & Schwein)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Kasseler', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Schweinefleisch', name: 'Eisbein / Schweinshaxe', defaultUnit: 'pc', defaultQty: 1 },

    // ── Lamm ──────────────────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Lamm', name: 'Lammkoteletts', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Lamm', name: 'Lammkeule', defaultUnit: 'kg', defaultQty: 1.5 },
    { category: 'Meat & Fish', subcategory: 'Lamm', name: 'Lammhackfleisch', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Lamm', name: 'Lammschulter', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Lamm', name: 'Lammhaxe', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Meat & Fish', subcategory: 'Lamm', name: 'Lammrücken', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Lamm', name: 'Lammgulasch', defaultUnit: 'g', defaultQty: 500 },

    // ── Kalb & Wild ───────────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Kalbsschnitzel', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Kalbshaxe', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Kalbsgulasch', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Kalbsleber', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Rehkeule / Rehbraten', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Wildschweinbraten', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Hirschgulasch', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Kalb & Wild', name: 'Kaninchen', defaultUnit: 'g', defaultQty: 500 },

    // ── Wurst & Würstchen ─────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Bratwurst', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Nürnberger Rostbratwürstchen', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Thüringer Rostbratwurst', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Frankfurter / Wiener Würstchen', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Bockwurst', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Weißwurst', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Currywurst', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Geflügelwürstchen', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Chorizo', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Merguez', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Speck (Frühstücksspeck)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Speck (geräuchert)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Bauchspeck / Pancetta', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Speckwürfel', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Frikadellen / Bouletten', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Burger-Patties (Rind)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Hackbällchen / Fleischbällchen', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Wurst & Würstchen', name: 'Leberkäse / Fleischkäse', defaultUnit: 'g', defaultQty: 300 },

    // ── Aufschnitt & Wurstwaren ───────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Kochschinken', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Schwarzwälder Schinken', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Parmaschinken / Prosciutto', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Serranoschinken', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Lachsschinken', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Schinkenspeck', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Salami', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Ungarische Salami', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Cervelatwurst', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Mortadella', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Lyoner / Fleischwurst', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Bierschinken', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Teewurst', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Leberwurst', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Mettwurst / Mett', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Blutwurst', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Sülze / Aspik', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Geflügel-Aufschnitt', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Bresaola', defaultUnit: 'g', defaultQty: 80 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Peperoni-Salami', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Meat & Fish', subcategory: 'Aufschnitt & Wurstwaren', name: 'Schinkenwurst', defaultUnit: 'g', defaultQty: 150 },

    // ── Frischer Fisch ────────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Lachsfilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Kabeljaufilet / Dorsch', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Thunfischsteak', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Wolfsbarschfilet', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Forelle (ganz)', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Forellenfilet', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Schellfischfilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Makrele (ganz)', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Schollenfilet', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Tilapiafilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Pangasiusfilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Seelachsfilet / Alaskapollack', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Seezungenfilet', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Rotbarschfilet', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Dorade / Goldbrasse', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Sardinen (frisch)', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Hering (frisch)', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Zanderfilet', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Welsfilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Frischer Fisch', name: 'Heilbutt', defaultUnit: 'g', defaultQty: 300 },

    // ── Meeresfrüchte ─────────────────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Garnelen / Shrimps (roh)', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Garnelen / Shrimps (gekocht)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Riesengarnelen', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Tintenfisch / Calamari', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Miesmuscheln', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Venusmuscheln', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Jakobsmuscheln', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Oktopus', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Hummer', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Flusskrebse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Meeresfrüchte', name: 'Nordseekrabben', defaultUnit: 'g', defaultQty: 100 },

    // ── Fisch aus der Dose / geräuchert ───────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Thunfisch (Dose)', defaultUnit: 'g', defaultQty: 185 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Sardinen (Dose)', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Sardinen in Öl', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Lachs (Dose)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Makrele (Dose)', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Sardellen / Anchovis (Dose)', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Heringsfilet (Dose)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Bratheringe (Glas)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Rollmops (Glas)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Bismarckhering', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Matjeshering', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Räucherlachs', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Räuchermakrele', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Räucherforelle', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Räucheraal', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Krabben-Sticks / Surimi', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Fischstäbchen', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Muscheln (Dose)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Fisch aus der Dose / geräuchert', name: 'Garnelen (Dose)', defaultUnit: 'g', defaultQty: 150 },

    // ── Vegane Fleischalternativen ─────────────────────────────────────────
    { category: 'Meat & Fish', subcategory: 'Vegane Fleischalternativen', name: 'Vegane Burger-Patties', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Meat & Fish', subcategory: 'Vegane Fleischalternativen', name: 'Veganes Hackfleisch', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Meat & Fish', subcategory: 'Vegane Fleischalternativen', name: 'Vegane Würstchen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Meat & Fish', subcategory: 'Vegane Fleischalternativen', name: 'Vegane Nuggets', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Meat & Fish', subcategory: 'Vegane Fleischalternativen', name: 'Veganes Schnitzel', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Meat & Fish', subcategory: 'Vegane Fleischalternativen', name: 'Veganer Aufschnitt', defaultUnit: 'g', defaultQty: 100 },

    // ═════════════════════════════════════════════════════════════════════════
    // DRINKS — Getränke
    // ═════════════════════════════════════════════════════════════════════════

    // ── Wasser ────────────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Wasser', name: 'Stilles Wasser', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Drinks', subcategory: 'Wasser', name: 'Sprudel / Mineralwasser (mit Kohlensäure)', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Drinks', subcategory: 'Wasser', name: 'Mineralwasser medium', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Drinks', subcategory: 'Wasser', name: 'Heilwasser', defaultUnit: 'L', defaultQty: 0.75 },

    // ── Saft ──────────────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Saft', name: 'Orangensaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Apfelsaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Traubensaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Kirschsaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Tomatensaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Multivitaminsaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Ananassaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Mangosaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Karottensaft', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Rote-Bete-Saft', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Cranberrysaft', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Direktsaft (frisch gepresst)', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Fruchtnektar', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Saft', name: 'Zitronensaft', defaultUnit: 'ml', defaultQty: 250 },

    // ── Schorle & Limonaden ───────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Apfelschorle', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Rhabarberschorle', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Johannisbeerschorle', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Cola', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Cola Zero / Light', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Limonade (Zitrone)', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Limonade (Orange)', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Spezi', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Bionade / Bio-Limonade', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Tonic Water', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Ginger Ale', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Ginger Beer', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Energy-Drink', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Iso-Drink / Sportgetränk', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Eistee', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Fritz-Kola / Craft-Limo', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Club Soda', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Sirup (zum Verdünnen)', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Schorle & Limonaden', name: 'Almdudler', defaultUnit: 'L', defaultQty: 1 },

    // ── Smoothies ─────────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Smoothies', name: 'Frucht-Smoothie', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Smoothies', name: 'Grüner Smoothie', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Smoothies', name: 'Protein-Smoothie', defaultUnit: 'ml', defaultQty: 330 },

    // ── Kaffee ────────────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Kaffeebohnen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Gemahlener Kaffee (Filterkaffee)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Espresso (gemahlen)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Instantkaffee / löslicher Kaffee', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Kaffeekapseln', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Kaffeepads', defaultUnit: 'pc', defaultQty: 16 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Entkoffeinierter Kaffee', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Kaffeefiltertüten', defaultUnit: 'pc', defaultQty: 80 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Eiskaffee (Fertiggetränk)', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Kaffee', name: 'Kaffeesahne / Kaffeeweißer', defaultUnit: 'g', defaultQty: 200 },

    // ── Tee ───────────────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Tee', name: 'Schwarztee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Grüntee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Earl Grey', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Kräutertee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Kamillentee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Pfefferminztee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Fencheltee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Hagebuttentee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Früchtetee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Rooibostee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Matcha-Pulver', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Chai-Tee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Ingwertee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Brennnesseltee', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Drinks', subcategory: 'Tee', name: 'Melissentee', defaultUnit: 'pc', defaultQty: 20 },

    // ── Kakao & Heißgetränke ──────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Kakao & Heißgetränke', name: 'Kakaopulver', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Kakao & Heißgetränke', name: 'Trinkschokolade', defaultUnit: 'g', defaultQty: 400 },

    // ── Pflanzenmilch ─────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Hafermilch / Haferdrink', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Sojamilch / Sojadrink', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Mandelmilch / Mandeldrink', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Reismilch / Reisdrink', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Kokosmilch-Drink', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Cashewdrink', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Dinkeldrink', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Pflanzenmilch', name: 'Haferdrink Barista', defaultUnit: 'L', defaultQty: 1 },

    // ── Bier ──────────────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Bier', name: 'Pils', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Helles', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Weizen / Weißbier', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Dunkles Bier', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Export', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Kölsch', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Alt (Altbier)', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Kellerbier / Zwickel', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Craft-Bier / IPA', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Stout / Porter', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Alkoholfreies Bier', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Radler', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Bier (Sixpack / Kasten)', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Berliner Weiße', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Bier', name: 'Malzbier', defaultUnit: 'ml', defaultQty: 500 },

    // ── Wein & Sekt ───────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Rotwein', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Weißwein', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Roséwein', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Sekt', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Prosecco', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Glühwein', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Kochwein', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Federweißer', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Weinschorle (fertig)', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Hugo (fertig)', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Drinks', subcategory: 'Wein & Sekt', name: 'Aperol Spritz (fertig)', defaultUnit: 'ml', defaultQty: 750 },

    // ── Spirituosen ───────────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Wodka', defaultUnit: 'ml', defaultQty: 700 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Gin', defaultUnit: 'ml', defaultQty: 700 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Rum', defaultUnit: 'ml', defaultQty: 700 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Whisky / Whiskey', defaultUnit: 'ml', defaultQty: 700 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Tequila', defaultUnit: 'ml', defaultQty: 700 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Weinbrand / Cognac', defaultUnit: 'ml', defaultQty: 700 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Likör', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Eierlikör', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Wermut / Vermouth', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Obstler / Obstbrand', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Korn / Kornbrand', defaultUnit: 'ml', defaultQty: 700 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Grappa', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Spirituosen', name: 'Jägermeister / Kräuterlikör', defaultUnit: 'ml', defaultQty: 700 },

    // ── Sonstige Getränke ─────────────────────────────────────────────────
    { category: 'Drinks', subcategory: 'Sonstige Getränke', name: 'Kombucha', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Sonstige Getränke', name: 'Kokoswasser', defaultUnit: 'ml', defaultQty: 330 },
    { category: 'Drinks', subcategory: 'Sonstige Getränke', name: 'Kwas', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Drinks', subcategory: 'Sonstige Getränke', name: 'Lassi', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Drinks', subcategory: 'Sonstige Getränke', name: 'Proteinpulver / Eiweißpulver', defaultUnit: 'g', defaultQty: 500 },

    // ═════════════════════════════════════════════════════════════════════════
    // BREAD & GRAINS — Brot, Backwaren & Getreide
    // ═════════════════════════════════════════════════════════════════════════

    // ── Brot ──────────────────────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Weizenbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Vollkornbrot', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Roggenbrot', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Mischbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Sauerteigbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Mehrkornbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Körnerbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Toastbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Vollkorntoast', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Pumpernickel', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Schwarzbrot', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Dinkelbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Eiweißbrot', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brot', name: 'Glutenfreies Brot', defaultUnit: 'pc', defaultQty: 1 },

    // ── Brötchen & Kleingebäck ────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Brötchen / Semmeln', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Vollkornbrötchen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Laugenbrötchen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Laugenstange', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Brezel / Breze', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Baguette', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Ciabatta', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Focaccia', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Käsebrötchen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Rosinenbrötchen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Paniermehl / Semmelbrösel', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Bread & Grains', subcategory: 'Brötchen & Kleingebäck', name: 'Croutons', defaultUnit: 'g', defaultQty: 100 },

    // ── Fladenbrot, Wraps & Spezialbrote ──────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Fladenbrot / Pide', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Pitabrot', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Naanbrot', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Tortilla-Wraps (Weizen)', defaultUnit: 'pc', defaultQty: 8 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Tortilla-Wraps (Mais)', defaultUnit: 'pc', defaultQty: 8 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Bagels', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Taco-Schalen', defaultUnit: 'pc', defaultQty: 12 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Dürüm / Yufka-Fladen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Fladenbrot, Wraps & Spezialbrote', name: 'Knäckebrot', defaultUnit: 'g', defaultQty: 250 },

    // ── Feingebäck & Blätterteig ──────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Croissants', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Schoko-Croissants', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Brioche', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Blätterteig (fertig)', defaultUnit: 'g', defaultQty: 275 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Mürbeteig (fertig)', defaultUnit: 'g', defaultQty: 275 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Filoteig / Yufkateig', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Pizzateig (fertig)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Strudelteig', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Bread & Grains', subcategory: 'Feingebäck & Blätterteig', name: 'Hefeteig (fertig)', defaultUnit: 'g', defaultQty: 400 },

    // ── Nudeln ────────────────────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Spaghetti', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Penne', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Fusilli / Spiralnudeln', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Tagliatelle / Bandnudeln', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Farfalle / Schmetterlingsnudeln', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Rigatoni', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Makkaroni / Hörnchen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Lasagneplatten', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Cannelloni', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Orzo / Risoni (Reisnudeln)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Tortellini (frisch)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Ravioli (frisch)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Maultaschen (frisch)', defaultUnit: 'g', defaultQty: 360 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Gnocchi', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Vollkornnudeln', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Glutenfreie Nudeln', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Spätzle / Knöpfle', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Schupfnudeln', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Couscous', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Fadennudeln / Suppennudeln', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Nudeln', name: 'Eiernudeln', defaultUnit: 'g', defaultQty: 500 },

    // ── Asiatische Nudeln ─────────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Asiatische Nudeln', name: 'Reisnudeln', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Asiatische Nudeln', name: 'Udon-Nudeln', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Bread & Grains', subcategory: 'Asiatische Nudeln', name: 'Soba-Nudeln', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Asiatische Nudeln', name: 'Glasnudeln', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Bread & Grains', subcategory: 'Asiatische Nudeln', name: 'Ramen-Nudeln', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Bread & Grains', subcategory: 'Asiatische Nudeln', name: 'Mie-Nudeln', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Asiatische Nudeln', name: 'Reispapier', defaultUnit: 'g', defaultQty: 150 },

    // ── Reis ──────────────────────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Langkornreis', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Naturreis / Vollkornreis', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Basmatireis', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Jasminreis', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Risotto-Reis / Arborio', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Wildreis', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Sushi-Reis', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Mikrowellenreis (fertig)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Milchreis-Reis', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Reis', name: 'Parboiled-Reis', defaultUnit: 'kg', defaultQty: 1 },

    // ── Andere Getreide ───────────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Quinoa', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Bulgur', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Polenta / Maisgrieß', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Graupen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Buchweizen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Hirse', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Amaranth', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Dinkel (ganz)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Andere Getreide', name: 'Grünkern', defaultUnit: 'g', defaultQty: 500 },

    // ── Frühstückscerealien ───────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Haferflocken (zart)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Haferflocken (kernig)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Instant-Haferflocken', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Müsli', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Knuspermüsli / Granola', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Cornflakes', defaultUnit: 'g', defaultQty: 375 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Schoko-Cerealien', defaultUnit: 'g', defaultQty: 375 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Honig-Cerealien', defaultUnit: 'g', defaultQty: 375 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Vollkorn-Flakes', defaultUnit: 'g', defaultQty: 375 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Dinkelflocken', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Haferkleie', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Porridge (Instant)', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Bread & Grains', subcategory: 'Frühstückscerealien', name: 'Overnight-Oats-Mix', defaultUnit: 'g', defaultQty: 300 },

    // ── Mehl ──────────────────────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Weizenmehl Type 405', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Weizenmehl Type 550', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Weizenvollkornmehl', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Roggenmehl Type 997', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Dinkelmehl Type 630', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Dinkelvollkornmehl', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Speisestärke', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Mandelmehl', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Kokosmehl', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Kichererbsenmehl', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Reismehl', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Hartweizengrieß', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Weichweizengrieß', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Glutenfreie Mehlmischung', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Pfannkuchenmischung', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Kartoffelmehl / Kartoffelstärke', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Mehl', name: 'Semmelbrösel / Paniermehl', defaultUnit: 'g', defaultQty: 200 },

    // ── Cracker & Knäckebrot ──────────────────────────────────────────────
    { category: 'Bread & Grains', subcategory: 'Cracker & Knäckebrot', name: 'Cracker', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Bread & Grains', subcategory: 'Cracker & Knäckebrot', name: 'Reiswaffeln', defaultUnit: 'pc', defaultQty: 14 },
    { category: 'Bread & Grains', subcategory: 'Cracker & Knäckebrot', name: 'Maiswaffeln', defaultUnit: 'pc', defaultQty: 12 },
    { category: 'Bread & Grains', subcategory: 'Cracker & Knäckebrot', name: 'Grissini / Brotstangen', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Bread & Grains', subcategory: 'Cracker & Knäckebrot', name: 'Vollkorn-Knäckebrot', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Cracker & Knäckebrot', name: 'Roggen-Knäckebrot', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Bread & Grains', subcategory: 'Cracker & Knäckebrot', name: 'Zwieback', defaultUnit: 'g', defaultQty: 225 },

    // ═════════════════════════════════════════════════════════════════════════
    // SNACKS & SWEETS — Süßes & Knabbereien
    // ═════════════════════════════════════════════════════════════════════════

    // ── Schokolade ────────────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Vollmilchschokolade', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Zartbitterschokolade', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Weiße Schokolade', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Nussschokolade', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Schokolade mit Füllung', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Schokoladentrüffel', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Pralinen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Kuvertüre / Backschokolade', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Schokotropfen / Schokostückchen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Nuss-Nougat-Creme', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Schokoriegel', defaultUnit: 'pc', defaultQty: 5 },
    { category: 'Snacks & Sweets', subcategory: 'Schokolade', name: 'Schokoladenosterhasen / -nikoläuse', defaultUnit: 'pc', defaultQty: 1 },

    // ── Süßigkeiten ───────────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Gummibärchen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Fruchtgummi', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Weingummi', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Lakritz', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Bonbons', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Lutscher / Lollipops', defaultUnit: 'pc', defaultQty: 5 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Karamellbonbons / Toffees', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Marshmallows', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Pfefferminzbonbons', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Kaugummi', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Nougat', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Marzipan', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Türkischer Honig / Lokum', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Saure Süßigkeiten', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Zuckerwatte', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Lebkuchen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Dominosteine', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Zimtsterne', defaultUnit: 'g', defaultQty: 175 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Spekulatius', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Süßigkeiten', name: 'Stollenkonfekt', defaultUnit: 'g', defaultQty: 200 },

    // ── Salzige Snacks ────────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Kartoffelchips', defaultUnit: 'g', defaultQty: 175 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Paprikachips', defaultUnit: 'g', defaultQty: 175 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Ungarisch-Chips', defaultUnit: 'g', defaultQty: 175 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Tortilla-Chips', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Salzstangen', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Mini-Brezeln / Salzbrezel', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Laugengebäck-Mix', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Gesalzene Nüsse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Studentenfutter', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Popcorn', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Mikrowellen-Popcorn', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Erdnussflips', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Gemüsechips', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Wasabi-Erbsen', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Cracker (gewürzt)', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Snacks & Sweets', subcategory: 'Salzige Snacks', name: 'Käsegebäck / Käsestangen', defaultUnit: 'g', defaultQty: 150 },

    // ── Kekse & Gebäck ────────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Butterkekse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Vollkornkekse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Schokoladenkekse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Doppelkekse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Haferflockenkekse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Waffeln', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Zwieback', defaultUnit: 'g', defaultQty: 225 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Karamellkekse / Spekulatius-Kekse', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Amaretti', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Löffelbiskuit', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Glutenfreie Kekse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Kekse & Gebäck', name: 'Printen (Aachener)', defaultUnit: 'g', defaultQty: 200 },

    // ── Kuchen & Gebäck ───────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Muffins', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Brownies', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Berliner / Krapfen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Kuchen (ganz)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Kuchenstück', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Apfelstrudel', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Käsekuchen', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Bienenstich', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Schwarzwälder Kirschtorte', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Streuselkuchen', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Biskuitrolle', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Kuchen & Gebäck', name: 'Baklava', defaultUnit: 'g', defaultQty: 200 },

    // ── Riegel ────────────────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Riegel', name: 'Müsliriegel', defaultUnit: 'pc', defaultQty: 5 },
    { category: 'Snacks & Sweets', subcategory: 'Riegel', name: 'Proteinriegel', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Riegel', name: 'Fruchtriegel', defaultUnit: 'pc', defaultQty: 5 },
    { category: 'Snacks & Sweets', subcategory: 'Riegel', name: 'Energy Balls / Energiekugeln', defaultUnit: 'g', defaultQty: 120 },
    { category: 'Snacks & Sweets', subcategory: 'Riegel', name: 'Nussriegel', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Snacks & Sweets', subcategory: 'Riegel', name: 'Haferriegel', defaultUnit: 'pc', defaultQty: 5 },

    // ── Aufstriche (süß) ──────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Aufstriche (süß)', name: 'Erdnussbutter', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Snacks & Sweets', subcategory: 'Aufstriche (süß)', name: 'Mandelmus', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Snacks & Sweets', subcategory: 'Aufstriche (süß)', name: 'Cashewmus', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Snacks & Sweets', subcategory: 'Aufstriche (süß)', name: 'Tahini / Sesammus', defaultUnit: 'g', defaultQty: 250 },

    // ── Desserts (gekühlt / ungekühlt) ────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Puddingbecher', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Milchreis (Becher)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Vanillesoße', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Wackelpudding / Götterspeise', defaultUnit: 'g', defaultQty: 120 },
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Panna Cotta', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Mousse au Chocolat', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Tiramisu', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Snacks & Sweets', subcategory: 'Desserts (gekühlt / ungekühlt)', name: 'Crème brûlée', defaultUnit: 'pc', defaultQty: 2 },

    // ── Eis ───────────────────────────────────────────────────────────────
    { category: 'Snacks & Sweets', subcategory: 'Eis', name: 'Eiscreme (Becher)', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Snacks & Sweets', subcategory: 'Eis', name: 'Eis am Stiel', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Snacks & Sweets', subcategory: 'Eis', name: 'Eishörnchen / Cornetto', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Snacks & Sweets', subcategory: 'Eis', name: 'Frozen Yogurt', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Snacks & Sweets', subcategory: 'Eis', name: 'Sorbet', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Snacks & Sweets', subcategory: 'Eis', name: 'Wassereis', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Snacks & Sweets', subcategory: 'Eis', name: 'Mochi-Eis', defaultUnit: 'pc', defaultQty: 6 },

    // ═════════════════════════════════════════════════════════════════════════
    // FROZEN — Tiefkühlkost
    // ═════════════════════════════════════════════════════════════════════════

    // ── TK-Gemüse ─────────────────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Gemüsemischung', defaultUnit: 'g', defaultQty: 750 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Erbsen', defaultUnit: 'g', defaultQty: 750 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Blattspinat', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Rahmspinat', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Brokkoli', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Blumenkohl', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Bohnen (grün)', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Mais', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Paprikastreifen', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Erbsen & Möhren', defaultUnit: 'g', defaultQty: 750 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Suppengemüse', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Grünkohl', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Rosenkohl', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Edamame', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Wok-Gemüse', defaultUnit: 'g', defaultQty: 600 },
    { category: 'Frozen', subcategory: 'TK-Gemüse', name: 'TK-Zwiebeln (gewürfelt)', defaultUnit: 'g', defaultQty: 450 },

    // ── TK-Obst ───────────────────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Beerenmischung', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Erdbeeren', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Himbeeren', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Heidelbeeren', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Mango (Stücke)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Sauerkirschen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Smoothie-Mix', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Obst', name: 'TK-Ananas (Stücke)', defaultUnit: 'g', defaultQty: 500 },

    // ── TK-Kartoffelprodukte ──────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Pommes frites', defaultUnit: 'g', defaultQty: 750 },
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Süßkartoffel-Pommes', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Kartoffelecken / Wedges', defaultUnit: 'g', defaultQty: 750 },
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Rösti', defaultUnit: 'g', defaultQty: 600 },
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Kroketten', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Kartoffelpuffer / Reibekuchen', defaultUnit: 'g', defaultQty: 600 },
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Knödel / Kartoffelklöße', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Kartoffelprodukte', name: 'TK-Kartoffeltaschen', defaultUnit: 'g', defaultQty: 500 },

    // ── TK-Fertiggerichte ─────────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Pizza', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Lasagne', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Quiche', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Flammkuchen', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Mikrowellen-Fertiggericht', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Bratkartoffeln (fertig)', defaultUnit: 'g', defaultQty: 600 },
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Gyros', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fertiggerichte', name: 'TK-Rahm-Geschnetzeltes', defaultUnit: 'g', defaultQty: 400 },

    // ── TK-Fleischprodukte ────────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Chicken Nuggets', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Hähnchen-Strips', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Hähnchenflügel', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Schnitzel (paniert)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Burger-Patties', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Fleischbällchen', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Bratwurst', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Cordon Bleu', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Frozen', subcategory: 'TK-Fleischprodukte', name: 'TK-Cevapcici', defaultUnit: 'g', defaultQty: 400 },

    // ── TK-Fisch ──────────────────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Fischstäbchen', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Lachsfilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Kabeljaufilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Seelachsfilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Garnelen', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Calamari-Ringe', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Backfisch / Schlemmerfilet', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Fischfrikadellen', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Frozen', subcategory: 'TK-Fisch', name: 'TK-Meeresfrüchte-Mix', defaultUnit: 'g', defaultQty: 400 },

    // ── TK-Snacks & Vorspeisen ────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Frühlingsrollen', defaultUnit: 'pc', defaultQty: 8 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Samosas', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Gyoza / Teigtaschen', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Dim Sum', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Falafel', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Zwiebelringe', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Knoblauchbaguette', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Börek / Yufka-Teigtaschen', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Frozen', subcategory: 'TK-Snacks & Vorspeisen', name: 'TK-Mozzarella-Sticks', defaultUnit: 'g', defaultQty: 250 },

    // ── TK-Backwaren ──────────────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Backwaren', name: 'TK-Brötchen', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Frozen', subcategory: 'TK-Backwaren', name: 'TK-Baguette', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Frozen', subcategory: 'TK-Backwaren', name: 'TK-Croissants', defaultUnit: 'pc', defaultQty: 6 },
    { category: 'Frozen', subcategory: 'TK-Backwaren', name: 'TK-Waffeln', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Frozen', subcategory: 'TK-Backwaren', name: 'TK-Pfannkuchen', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Frozen', subcategory: 'TK-Backwaren', name: 'TK-Laugenbrezel', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Frozen', subcategory: 'TK-Backwaren', name: 'TK-Naan / Fladenbrot', defaultUnit: 'pc', defaultQty: 4 },

    // ── TK-Kräuter ────────────────────────────────────────────────────────
    { category: 'Frozen', subcategory: 'TK-Kräuter', name: 'TK-Petersilie', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Frozen', subcategory: 'TK-Kräuter', name: 'TK-Basilikum', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Frozen', subcategory: 'TK-Kräuter', name: 'TK-Dill', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Frozen', subcategory: 'TK-Kräuter', name: 'TK-Kräutermischung (8 Kräuter)', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Frozen', subcategory: 'TK-Kräuter', name: 'TK-Knoblauch (Würfel)', defaultUnit: 'g', defaultQty: 75 },
    { category: 'Frozen', subcategory: 'TK-Kräuter', name: 'TK-Schnittlauch', defaultUnit: 'g', defaultQty: 50 },

    // ═════════════════════════════════════════════════════════════════════════
    // READY MEALS — Fertiggerichte & Konserven
    // ═════════════════════════════════════════════════════════════════════════

    // ── Suppen ────────────────────────────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Tomatensuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Hühnersuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Linsensuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Erbsensuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Pilzsuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Gemüsesuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Kartoffelsuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Gulaschsuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Nudelsuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Hochzeitssuppe (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Tütensuppe / Instantsuppe', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Miso-Suppe (Instant)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Frische Suppe (gekühlt)', defaultUnit: 'ml', defaultQty: 600 },
    { category: 'Ready Meals', subcategory: 'Suppen', name: 'Brühe (flüssig)', defaultUnit: 'ml', defaultQty: 500 },

    // ── Instantgerichte ───────────────────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Instantgerichte', name: 'Instant-Nudeln / Cup-Nudeln', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Instantgerichte', name: 'Instant-Ramen', defaultUnit: 'pc', defaultQty: 5 },
    { category: 'Ready Meals', subcategory: 'Instantgerichte', name: 'Kartoffelpüree (Instant)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Ready Meals', subcategory: 'Instantgerichte', name: 'Risotto-Mischung', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Ready Meals', subcategory: 'Instantgerichte', name: 'Couscous-Becher (Instant)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Instantgerichte', name: 'Fix-Soße (Tüte)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Instantgerichte', name: 'Fix-Produkt (Gewürzmischung)', defaultUnit: 'pc', defaultQty: 1 },

    // ── Nudelsoßen (Glas) ─────────────────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Nudelsoßen (Glas)', name: 'Tomatensoße (Glas)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Nudelsoßen (Glas)', name: 'Bolognese-Soße (Glas)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Nudelsoßen (Glas)', name: 'Arrabbiata-Soße (Glas)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Nudelsoßen (Glas)', name: 'Pesto Genovese (grün)', defaultUnit: 'g', defaultQty: 190 },
    { category: 'Ready Meals', subcategory: 'Nudelsoßen (Glas)', name: 'Pesto Rosso (rot)', defaultUnit: 'g', defaultQty: 190 },
    { category: 'Ready Meals', subcategory: 'Nudelsoßen (Glas)', name: 'Sahnesoße (Glas)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Nudelsoßen (Glas)', name: 'Carbonara-Soße (Glas)', defaultUnit: 'g', defaultQty: 400 },

    // ── Fertiggerichte (Dose / Glas) ──────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Ravioli (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Chili con Carne (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Eintopf (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Gulasch (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Königsberger Klopse (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Spaghetti (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Currywurst (Dose / Glas)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Bohneneintopf (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Linseneintopf (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Grünkohl mit Pinkel (Dose)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertiggerichte (Dose / Glas)', name: 'Labskaus (Dose)', defaultUnit: 'g', defaultQty: 400 },

    // ── Dips & Aufstriche (herzhaft) ──────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Hummus', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Guacamole', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Tzatziki', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Baba Ganoush', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Salsa', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Kräuterbutter (fertig)', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Aioli-Dip', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Tapenade', defaultUnit: 'g', defaultQty: 150 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Raita', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Dips & Aufstriche (herzhaft)', name: 'Muhammara', defaultUnit: 'g', defaultQty: 200 },

    // ── Fertigsalate & Deli (gekühlt) ─────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Frische Pizza (gekühlt)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Belegtes Brötchen / Sandwich', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Wrap (fertig)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Fertigsalat', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Sushi (fertig)', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Kartoffelsalat', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Krautsalat / Coleslaw', defaultUnit: 'g', defaultQty: 300 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Nudelsalat', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Fleischsalat', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Heringssalat', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Tabouleh / Tabbouleh', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Falafel (fertig)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Fertigsalate & Deli (gekühlt)', name: 'Dolma / Weinblätter (gefüllt)', defaultUnit: 'g', defaultQty: 280 },

    // ── Kochsets & Würzpasten ─────────────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Kochsets & Würzpasten', name: 'Taco-Set', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Kochsets & Würzpasten', name: 'Fajita-Set', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Kochsets & Würzpasten', name: 'Wok-Soße', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Ready Meals', subcategory: 'Kochsets & Würzpasten', name: 'Currypaste (Glas)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Kochsets & Würzpasten', name: 'Enchilada-Set', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Ready Meals', subcategory: 'Kochsets & Würzpasten', name: 'Döner-Gewürz / Gyros-Gewürz', defaultUnit: 'g', defaultQty: 50 },

    // ── Tomatenprodukte ───────────────────────────────────────────────────
    { category: 'Ready Meals', subcategory: 'Tomatenprodukte', name: 'Passierte Tomaten / Passata', defaultUnit: 'ml', defaultQty: 680 },
    { category: 'Ready Meals', subcategory: 'Tomatenprodukte', name: 'Tomatenmark', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Ready Meals', subcategory: 'Tomatenprodukte', name: 'Pizzasoße', defaultUnit: 'g', defaultQty: 400 },

    // ═════════════════════════════════════════════════════════════════════════
    // CONDIMENTS — Würzmittel, Öle & Vorrat
    // ═════════════════════════════════════════════════════════════════════════

    // ── Speiseöle ─────────────────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Olivenöl (extra vergine)', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Olivenöl (zum Braten)', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Sonnenblumenöl', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Rapsöl', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Kokosöl', defaultUnit: 'ml', defaultQty: 300 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Sesamöl', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Leinöl', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Walnussöl', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Traubenkernöl', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Kürbiskernöl', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Trüffelöl', defaultUnit: 'ml', defaultQty: 100 },
    { category: 'Condiments', subcategory: 'Speiseöle', name: 'Bratöl / Frittieröl', defaultUnit: 'L', defaultQty: 1 },

    // ── Essig ─────────────────────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Essig', name: 'Balsamico-Essig', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Essig', name: 'Weißweinessig', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Essig', name: 'Rotweinessig', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Essig', name: 'Apfelessig', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Essig', name: 'Reisessig', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Essig', name: 'Branntweinessig', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Essig', name: 'Sherryessig', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Essig', name: 'Balsamico-Creme / -Glaze', defaultUnit: 'ml', defaultQty: 250 },

    // ── Tischsoßen ────────────────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Ketchup', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Senf (mittelscharf)', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Senf (süß / bayerisch)', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Senf (Dijon)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Senf (Körniger)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Mayonnaise', defaultUnit: 'ml', defaultQty: 400 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Leichte Mayonnaise', defaultUnit: 'ml', defaultQty: 400 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Salatmayonnaise / Miracle Whip', defaultUnit: 'ml', defaultQty: 400 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'BBQ-Soße', defaultUnit: 'ml', defaultQty: 400 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Chilisoße / Scharfe Soße', defaultUnit: 'ml', defaultQty: 150 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Sriracha', defaultUnit: 'ml', defaultQty: 435 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Tabasco', defaultUnit: 'ml', defaultQty: 60 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Meerrettich (Glas / Tube)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Sahne-Meerrettich', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Remoulade', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Cocktailsoße', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Preiselbeersoße', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Knoblauchsoße / Aioli', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Curryketchup', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Zigeunersoße / Schaschliksoße', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Tischsoßen', name: 'Bratensauce (fertig)', defaultUnit: 'ml', defaultQty: 500 },

    // ── Asiatische Soßen & Pasten ─────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Sojasoße', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Sojasoße (hell)', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Sojasoße (dunkel)', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Teriyaki-Soße', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Süße Chilisoße', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Fischsoße', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Austernsoße', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Hoisin-Soße', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Worcestersoße', defaultUnit: 'ml', defaultQty: 150 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Sambal Oelek', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Miso-Paste', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Thai-Currypaste (grün)', defaultUnit: 'g', defaultQty: 70 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Thai-Currypaste (rot)', defaultUnit: 'g', defaultQty: 70 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Thai-Currypaste (gelb)', defaultUnit: 'g', defaultQty: 70 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Harissa', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Wasabi-Paste', defaultUnit: 'g', defaultQty: 43 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Gochujang (koreanische Chilipaste)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Tahini / Sesampaste', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Tamarindenpaste', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Ponzu-Soße', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Asiatische Soßen & Pasten', name: 'Tamari (glutenfrei)', defaultUnit: 'ml', defaultQty: 250 },

    // ── Salatdressing ─────────────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Salatdressing', name: 'Salatdressing — Vinaigrette', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Salatdressing', name: 'Salatdressing — Joghurt', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Salatdressing', name: 'Salatdressing — Caesar', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Salatdressing', name: 'Salatdressing — Kräuter', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Salatdressing', name: 'Salatdressing — French', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Salatdressing', name: 'Salatdressing — Thousand Island', defaultUnit: 'ml', defaultQty: 250 },

    // ── Gewürze (getrocknet) ──────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Salz', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Meersalz', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Fleur de Sel', defaultUnit: 'g', defaultQty: 125 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Schwarzer Pfeffer (gemahlen)', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Pfefferkörner (ganz)', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Weißer Pfeffer', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Paprika edelsüß', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Paprika geräuchert', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Paprika rosenscharf', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Kreuzkümmel (gemahlen)', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Kümmelsamen', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Kurkuma (gemahlen)', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Zimt (gemahlen)', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Zimtstangen', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Muskatnuss (gemahlen)', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Muskatnuss (ganz)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Oregano (getrocknet)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Basilikum (getrocknet)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Thymian (getrocknet)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Rosmarin (getrocknet)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Petersilie (getrocknet)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Lorbeerblätter', defaultUnit: 'g', defaultQty: 10 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Chiliflocken', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Chilipulver', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Cayennepfeffer', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Currypulver', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Garam Masala', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Chinesisches Fünf-Gewürze-Pulver', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Kräuter der Provence', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Italienische Kräuter', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Knoblauchpulver', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Zwiebelpulver', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Koriander (gemahlen)', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Kardamom (gemahlen)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Nelken (gemahlen)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Nelken (ganz)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Fenchelsamen', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Bockshornkleesamen', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Senfkörner', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Sternanis', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Safran', defaultUnit: 'g', defaultQty: 1 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Za\'atar', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Sumach', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Ras el Hanout', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Piment (gemahlen)', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Wacholderbeeren', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Dill (getrocknet)', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Majoran (getrocknet)', defaultUnit: 'g', defaultQty: 15 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Salbei (getrocknet)', defaultUnit: 'g', defaultQty: 15 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Estragon (getrocknet)', defaultUnit: 'g', defaultQty: 15 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Vanilleschoten', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Vanilleextrakt', defaultUnit: 'ml', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Vanillezucker', defaultUnit: 'pc', defaultQty: 5 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Kräutersalz', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Steakpfeffer', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Brathähnchen-Gewürz', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Pommes-Gewürz', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Grillgewürz', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Gyrosgewürz', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Condiments', subcategory: 'Gewürze (getrocknet)', name: 'Lebkuchengewürz', defaultUnit: 'g', defaultQty: 30 },

    // ── Zucker & Süßungsmittel ────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Weißer Zucker', defaultUnit: 'kg', defaultQty: 1 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Brauner Zucker', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Puderzucker', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Rohrzucker', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Gelierzucker (2:1)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Gelierzucker (3:1)', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Kokosblütenzucker', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Honig', defaultUnit: 'g', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Ahornsirup', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Agavendicksaft', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Zuckerrübensirup', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Dattelsirup', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Stevia-Süßungsmittel', defaultUnit: 'g', defaultQty: 75 },
    { category: 'Condiments', subcategory: 'Zucker & Süßungsmittel', name: 'Süßstoff (Tabletten)', defaultUnit: 'pc', defaultQty: 100 },

    // ── Marmelade & Aufstrich ─────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Erdbeermarmelade / -konfitüre', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Aprikosenmarmelade', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Himbeermarmelade', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Kirschmarmelade', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Orangenmarmelade', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Pflaumenmus', defaultUnit: 'g', defaultQty: 450 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Waldfrucht-Konfitüre', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Gelee (Johannisbeere)', defaultUnit: 'g', defaultQty: 340 },
    { category: 'Condiments', subcategory: 'Marmelade & Aufstrich', name: 'Fruchtaufstrich (zuckerreduziert)', defaultUnit: 'g', defaultQty: 250 },

    // ── Brühe, Fond & Kochhilfen ──────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Gemüsebrühwürfel', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Hühnerbrühwürfel', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Rinderbrühwürfel', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Gemüsebrühe (Pulver)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Gemüsebrühe (flüssig)', defaultUnit: 'ml', defaultQty: 1000 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Hühnerbrühe (flüssig)', defaultUnit: 'ml', defaultQty: 1000 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Rinderbrühe (flüssig)', defaultUnit: 'ml', defaultQty: 1000 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Fond (Geflügel)', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Fond (Fisch)', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Bratensoße (Granulat / Pulver)', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Brühe, Fond & Kochhilfen', name: 'Soßenbinder (hell/dunkel)', defaultUnit: 'g', defaultQty: 100 },

    // ── Backzutaten ───────────────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Backpulver', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Natron', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Trockenhefe', defaultUnit: 'g', defaultQty: 7 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Frische Hefe', defaultUnit: 'g', defaultQty: 42 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Gelatine (Blatt / Pulver)', defaultUnit: 'g', defaultQty: 12 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Kakaopulver (Back)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Weinstein-Backpulver', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Lebensmittelfarbe', defaultUnit: 'ml', defaultQty: 30 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Marzipanrohmasse', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Fondant', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Streusel / Tortendeko', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Agar-Agar', defaultUnit: 'g', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Puddingpulver', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Tortenguss', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Rumaroma / Backaroma', defaultUnit: 'ml', defaultQty: 20 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Zitronat', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Condiments', subcategory: 'Backzutaten', name: 'Orangeat', defaultUnit: 'g', defaultQty: 100 },

    // ── Eingelegtes & Konserven ────────────────────────────────────────────
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Gewürzgurken', defaultUnit: 'g', defaultQty: 670 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Cornichons', defaultUnit: 'g', defaultQty: 200 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Senfgurken', defaultUnit: 'g', defaultQty: 670 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Oliven (grün)', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Oliven (schwarz)', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Oliven (Kalamata)', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Kapern', defaultUnit: 'g', defaultQty: 100 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Peperoni (eingelegt)', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Silberzwiebeln', defaultUnit: 'g', defaultQty: 350 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Mixed Pickles', defaultUnit: 'g', defaultQty: 370 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Rotkohl (Glas)', defaultUnit: 'g', defaultQty: 680 },
    { category: 'Condiments', subcategory: 'Eingelegtes & Konserven', name: 'Mango-Chutney', defaultUnit: 'g', defaultQty: 250 },

    // ═════════════════════════════════════════════════════════════════════════
    // BABY FOOD — Babynahrung
    // ═════════════════════════════════════════════════════════════════════════

    // ── Baby-Milchnahrung ─────────────────────────────────────────────────
    { category: 'Baby Food', subcategory: 'Baby-Milchnahrung', name: 'Anfangsmilch Pre (0–6 Monate)', defaultUnit: 'g', defaultQty: 800 },
    { category: 'Baby Food', subcategory: 'Baby-Milchnahrung', name: 'Folgemilch 1 (6–12 Monate)', defaultUnit: 'g', defaultQty: 800 },
    { category: 'Baby Food', subcategory: 'Baby-Milchnahrung', name: 'Folgemilch 2 (ab 12 Monate)', defaultUnit: 'g', defaultQty: 800 },
    { category: 'Baby Food', subcategory: 'Baby-Milchnahrung', name: 'HA-Milch (hypoallergen)', defaultUnit: 'g', defaultQty: 800 },
    { category: 'Baby Food', subcategory: 'Baby-Milchnahrung', name: 'Kindermilch (ab 1 Jahr)', defaultUnit: 'ml', defaultQty: 1000 },

    // ── Baby-Brei ─────────────────────────────────────────────────────────
    { category: 'Baby Food', subcategory: 'Baby-Brei', name: 'Babybrei — Reisbrei', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Baby Food', subcategory: 'Baby-Brei', name: 'Babybrei — Haferbrei', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Baby Food', subcategory: 'Baby-Brei', name: 'Babybrei — Grießbrei', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Baby Food', subcategory: 'Baby-Brei', name: 'Babybrei — Mehrkornbrei', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Baby Food', subcategory: 'Baby-Brei', name: 'Babybrei — Milchbrei (Gute Nacht)', defaultUnit: 'g', defaultQty: 250 },

    // ── Baby-Gläschen ─────────────────────────────────────────────────────
    { category: 'Baby Food', subcategory: 'Baby-Gläschen', name: 'Obstgläschen (Apfel-Birne)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Baby Food', subcategory: 'Baby-Gläschen', name: 'Gemüsegläschen (Karotte)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Baby Food', subcategory: 'Baby-Gläschen', name: 'Menügläschen (Gemüse-Kartoffel-Fleisch)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Baby Food', subcategory: 'Baby-Gläschen', name: 'Menügläschen (Nudeln & Gemüse)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Baby Food', subcategory: 'Baby-Gläschen', name: 'Quetschbeutel / Fruchtpüree', defaultUnit: 'pc', defaultQty: 4 },

    // ── Baby-Snacks ───────────────────────────────────────────────────────
    { category: 'Baby Food', subcategory: 'Baby-Snacks', name: 'Babykekse / Babyzwieback', defaultUnit: 'g', defaultQty: 180 },
    { category: 'Baby Food', subcategory: 'Baby-Snacks', name: 'Baby-Knabbergebäck', defaultUnit: 'g', defaultQty: 50 },
    { category: 'Baby Food', subcategory: 'Baby-Snacks', name: 'Baby-Reiswaffeln', defaultUnit: 'g', defaultQty: 40 },
    { category: 'Baby Food', subcategory: 'Baby-Snacks', name: 'Baby-Fruchtriegel', defaultUnit: 'pc', defaultQty: 5 },
    { category: 'Baby Food', subcategory: 'Baby-Snacks', name: 'Baby-Dinkel-Snacks', defaultUnit: 'g', defaultQty: 30 },

    // ── Baby-Getränke & Sonstiges ─────────────────────────────────────────
    { category: 'Baby Food', subcategory: 'Baby-Getränke & Sonstiges', name: 'Babywasser', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Baby Food', subcategory: 'Baby-Getränke & Sonstiges', name: 'Baby-Tee (Fenchel / Kamille)', defaultUnit: 'g', defaultQty: 30 },
    { category: 'Baby Food', subcategory: 'Baby-Getränke & Sonstiges', name: 'Baby-Nudeln', defaultUnit: 'g', defaultQty: 250 },
    { category: 'Baby Food', subcategory: 'Baby-Getränke & Sonstiges', name: 'Baby-Joghurt', defaultUnit: 'g', defaultQty: 100 },

    // ═════════════════════════════════════════════════════════════════════════
    // OTHER — Haushalt, Pflege & Sonstiges
    // ═════════════════════════════════════════════════════════════════════════

    // ── Küche ─────────────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Küche', name: 'Spülmittel', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Küche', name: 'Geschirrspültabs', defaultUnit: 'pc', defaultQty: 30 },
    { category: 'Other', subcategory: 'Küche', name: 'Klarspüler', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Küche', name: 'Spülmaschinensalz', defaultUnit: 'kg', defaultQty: 2 },
    { category: 'Other', subcategory: 'Küche', name: 'Küchenschwämme', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Other', subcategory: 'Küche', name: 'Topfreiniger / Stahlwolle', defaultUnit: 'pc', defaultQty: 3 },
    { category: 'Other', subcategory: 'Küche', name: 'Küchenrolle', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Other', subcategory: 'Küche', name: 'Frischhaltefolie', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Küche', name: 'Alufolie', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Küche', name: 'Backpapier', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Küche', name: 'Gefrierbeutel', defaultUnit: 'pc', defaultQty: 50 },
    { category: 'Other', subcategory: 'Küche', name: 'Butterbrotbeutel / Frühstückstüten', defaultUnit: 'pc', defaultQty: 50 },
    { category: 'Other', subcategory: 'Küche', name: 'Vorratsdosen', defaultUnit: 'pc', defaultQty: 1 },

    // ── Reinigung ─────────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Reinigung', name: 'Allzweckreiniger', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Glasreiniger', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Badreiniger', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Other', subcategory: 'Reinigung', name: 'WC-Reiniger', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Scheuermilch', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Bodenreiniger', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Entkalker', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Desinfektionsspray', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Feuchte Reinigungstücher', defaultUnit: 'pc', defaultQty: 40 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Backofenreiniger', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Rohrreiniger', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Raumduft / Lufterfrischer', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Reinigung', name: 'Essigessenz (Reinigung)', defaultUnit: 'ml', defaultQty: 500 },

    // ── Wäschepflege ──────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Waschmittel (flüssig)', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Waschmittel (Pulver)', defaultUnit: 'kg', defaultQty: 1.5 },
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Waschmittel-Pods / -Caps', defaultUnit: 'pc', defaultQty: 30 },
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Colorwaschmittel', defaultUnit: 'L', defaultQty: 1.5 },
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Feinwaschmittel', defaultUnit: 'ml', defaultQty: 750 },
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Weichspüler', defaultUnit: 'L', defaultQty: 1 },
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Fleckenentferner', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Wäschepflege', name: 'Hygienespüler', defaultUnit: 'ml', defaultQty: 1000 },

    // ── Papierprodukte ────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Papierprodukte', name: 'Toilettenpapier', defaultUnit: 'pc', defaultQty: 8 },
    { category: 'Other', subcategory: 'Papierprodukte', name: 'Taschentücher', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Other', subcategory: 'Papierprodukte', name: 'Servietten', defaultUnit: 'pc', defaultQty: 50 },
    { category: 'Other', subcategory: 'Papierprodukte', name: 'Müllbeutel / Mülltüten', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Other', subcategory: 'Papierprodukte', name: 'Bio-Müllbeutel', defaultUnit: 'pc', defaultQty: 10 },

    // ── Körperpflege ──────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Körperpflege', name: 'Handseife (flüssig)', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Handseife (Nachfüller)', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Desinfektionsmittel (Hand)', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Duschgel', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Stückseife / Seife', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Shampoo', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Spülung / Conditioner', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Zahnpasta', defaultUnit: 'ml', defaultQty: 75 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Zahnbürste', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Mundspülung', defaultUnit: 'ml', defaultQty: 500 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Zahnseide', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Deodorant / Deo', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Bodylotion / Körperlotion', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Gesichtscreme', defaultUnit: 'ml', defaultQty: 50 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Handcreme', defaultUnit: 'ml', defaultQty: 75 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Lippenpflege', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Sonnencreme', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Rasierer / Rasierklingen', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Rasierschaum / Rasiergel', defaultUnit: 'ml', defaultQty: 200 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Wattepads', defaultUnit: 'pc', defaultQty: 100 },
    { category: 'Other', subcategory: 'Körperpflege', name: 'Wattestäbchen', defaultUnit: 'pc', defaultQty: 200 },

    // ── Damenhygiene ──────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Damenhygiene', name: 'Damenbinden', defaultUnit: 'pc', defaultQty: 14 },
    { category: 'Other', subcategory: 'Damenhygiene', name: 'Tampons', defaultUnit: 'pc', defaultQty: 16 },
    { category: 'Other', subcategory: 'Damenhygiene', name: 'Slipeinlagen', defaultUnit: 'pc', defaultQty: 30 },

    // ── Baby & Kind ───────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Baby & Kind', name: 'Windeln', defaultUnit: 'pc', defaultQty: 30 },
    { category: 'Other', subcategory: 'Baby & Kind', name: 'Feuchttücher (Baby)', defaultUnit: 'pc', defaultQty: 80 },
    { category: 'Other', subcategory: 'Baby & Kind', name: 'Wundschutzcreme', defaultUnit: 'ml', defaultQty: 75 },
    { category: 'Other', subcategory: 'Baby & Kind', name: 'Babyshampoo', defaultUnit: 'ml', defaultQty: 250 },
    { category: 'Other', subcategory: 'Baby & Kind', name: 'Babybadezusatz', defaultUnit: 'ml', defaultQty: 250 },

    // ── Gesundheit & Nahrungsergänzung ─────────────────────────────────────
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Multivitamin-Tabletten', defaultUnit: 'pc', defaultQty: 60 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Vitamin C', defaultUnit: 'pc', defaultQty: 60 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Vitamin D', defaultUnit: 'pc', defaultQty: 60 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Eisentabletten', defaultUnit: 'pc', defaultQty: 30 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Omega-3 / Fischöl-Kapseln', defaultUnit: 'pc', defaultQty: 60 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Magnesium', defaultUnit: 'pc', defaultQty: 60 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Zink-Tabletten', defaultUnit: 'pc', defaultQty: 60 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Probiotika', defaultUnit: 'pc', defaultQty: 30 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Pflaster', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Schmerzmittel (Ibuprofen / Paracetamol)', defaultUnit: 'pc', defaultQty: 20 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Halstabletten / Lutschtabletten', defaultUnit: 'pc', defaultQty: 24 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Nasenspray', defaultUnit: 'ml', defaultQty: 15 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Hustensaft', defaultUnit: 'ml', defaultQty: 150 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Augentropfen', defaultUnit: 'ml', defaultQty: 10 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Mückenschutz / Insektenschutz', defaultUnit: 'ml', defaultQty: 100 },
    { category: 'Other', subcategory: 'Gesundheit & Nahrungsergänzung', name: 'Wundsalbe / Heilsalbe', defaultUnit: 'g', defaultQty: 30 },

    // ── Tierbedarf ────────────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Tierbedarf', name: 'Katzenfutter (Nassfutter)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Other', subcategory: 'Tierbedarf', name: 'Katzenfutter (Trockenfutter)', defaultUnit: 'kg', defaultQty: 2 },
    { category: 'Other', subcategory: 'Tierbedarf', name: 'Hundefutter (Nassfutter)', defaultUnit: 'g', defaultQty: 400 },
    { category: 'Other', subcategory: 'Tierbedarf', name: 'Hundefutter (Trockenfutter)', defaultUnit: 'kg', defaultQty: 3 },
    { category: 'Other', subcategory: 'Tierbedarf', name: 'Katzenstreu', defaultUnit: 'kg', defaultQty: 10 },
    { category: 'Other', subcategory: 'Tierbedarf', name: 'Leckerlis / Snacks (Tier)', defaultUnit: 'g', defaultQty: 100 },

    // ── Haushalt Sonstiges ────────────────────────────────────────────────
    { category: 'Other', subcategory: 'Haushalt Sonstiges', name: 'Batterien (AA / Mignon)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Other', subcategory: 'Haushalt Sonstiges', name: 'Batterien (AAA / Micro)', defaultUnit: 'pc', defaultQty: 4 },
    { category: 'Other', subcategory: 'Haushalt Sonstiges', name: 'Glühbirnen / Leuchtmittel', defaultUnit: 'pc', defaultQty: 2 },
    { category: 'Other', subcategory: 'Haushalt Sonstiges', name: 'Kerzen / Teelichter', defaultUnit: 'pc', defaultQty: 10 },
    { category: 'Other', subcategory: 'Haushalt Sonstiges', name: 'Streichhölzer / Feuerzeug', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Haushalt Sonstiges', name: 'Gummihandschuhe', defaultUnit: 'pc', defaultQty: 1 },
    { category: 'Other', subcategory: 'Haushalt Sonstiges', name: 'Wäscheklammern', defaultUnit: 'pc', defaultQty: 20 },
]

export default PRODUCT_CATALOGUE

/**
 * Hilfsfunktion — alle Produkte einer Kategorie.
 */
export function getProductsByCategory(category) {
    return PRODUCT_CATALOGUE.filter((p) => p.category === category)
}

/**
 * Hilfsfunktion — alle Produkte einer Subkategorie.
 */
export function getProductsBySubcategory(subcategory) {
    return PRODUCT_CATALOGUE.filter((p) => p.subcategory === subcategory)
}

/**
 * Hilfsfunktion — alle einzigartigen Kategorienamen (in Katalogreihenfolge).
 */
export function getCatalogueCategories() {
    return [...new Set(PRODUCT_CATALOGUE.map((p) => p.category))]
}

/**
 * Hilfsfunktion — alle einzigartigen Subkategorienamen (in Katalogreihenfolge).
 */
export function getCatalogueSubcategories() {
    return [...new Set(PRODUCT_CATALOGUE.map((p) => p.subcategory).filter(Boolean))]
}

/**
 * Hilfsfunktion — Produkte nach Name suchen (Groß-/Kleinschreibung egal).
 */
export function searchCatalogue(query) {
    const q = query.toLowerCase()
    return PRODUCT_CATALOGUE.filter((p) => p.name.toLowerCase().includes(q))
}

// ═════════════════════════════════════════════════════════════════════════════
// GENERIC PRODUCT LAYER (Level 3)
// ─────────────────────────────────────────────────────────────────────────────
// Every catalogue entry is treated as a "generic product" — the branded-agnostic
// type of an item (e.g. "H-Milch", "Basmati-Reis", "Naturjoghurt").
//
//   Level 1: Category        ("Dairy & Eggs")
//   Level 2: Subcategory     ("Milch")
//   Level 3: Generic Product ("H-Milch")           ← this layer
//   Level 4: Branded item    ("Weihenstephan H-Milch 1,5 %")  — entered by user
//
// Each generic product gets a stable slug `id` (auto-derived from name), and
// optional `aliases` (synonyms / multilingual terms) for matching.
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Slugify a generic product name → stable id.
 * "H-Milch (haltbar)" → "h-milch-haltbar"
 * "Parmesan / Parmigiano" → "parmesan-parmigiano"
 */
export function slugifyGenericId(name) {
    if (!name) return ''
    return name
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Alias registry — keyed by generic product name (exact match against catalogue).
 * Add multilingual terms, common misspellings, and popular variants here so the
 * classifier can match e.g. "UHT milk" → "H-Milch".
 *
 * Add entries iteratively as needed — this is intentionally sparse at first.
 */
export const GENERIC_ALIASES = {
    // Milch
    'H-Milch (haltbar)': ['UHT-Milch', 'UHT milk', 'Haltbare Milch', 'H Milch', 'lange haltbar', 'longlife milk'],
    'Vollmilch 3,5 %': ['Vollmilch', 'whole milk', 'full fat milk', '3.5% milk'],
    'Fettarme Milch 1,5 %': ['Fettarme Milch', 'low fat milk', 'semi-skimmed milk', '1.5% milk'],
    'Magermilch 0,3 %': ['Magermilch', 'skim milk', 'skimmed milk', 'fat-free milk'],
    'Laktosefreie Milch': ['lactose free milk', 'lactosefrei'],
    'Bio-Milch': ['Biomilch', 'organic milk'],
    'Buttermilch': ['buttermilk'],
    'Kondensmilch': ['condensed milk', 'evaporated milk'],
    'Kaffeesahne': ['coffee cream', 'Kaffeemilch'],
    'Milchpulver': ['milk powder', 'powdered milk', 'dry milk'],
    // Yogurt
    'Naturjoghurt': ['natural yoghurt', 'plain yogurt', 'Joghurt natur'],
    'Griechischer Joghurt': ['greek yogurt', 'greek yoghurt'],
    'Fruchtjoghurt': ['fruit yogurt', 'fruit yoghurt'],
    'Skyr': ['icelandic yogurt'],
    // Cheese
    'Parmesan / Parmigiano': ['Parmesan', 'Parmigiano', 'Parmigiano Reggiano'],
    'Mozzarella': ['mozzarella cheese'],
    'Cheddar': ['cheddar cheese'],
    'Feta': ['feta cheese'],
    // Berries (fixes "Blaubeeren → Drinks" class of issues)
    'Blaubeeren': ['Heidelbeeren', 'blueberries', 'Waldheidelbeeren'],
    'Heidelbeeren': ['Blaubeeren', 'blueberries'],
    'Erdbeeren': ['strawberries'],
    'Himbeeren': ['raspberries'],
    'Brombeeren': ['blackberries'],
    'Johannisbeeren': ['redcurrants', 'currants'],
    // Common fruits
    'Äpfel': ['apples', 'Apfel'],
    'Bananen': ['bananas', 'banana'],
    'Orangen': ['oranges', 'orange'],
    'Zitronen': ['lemons', 'lemon'],
    // Grains
    'Basmati-Reis': ['basmati rice', 'basmati'],
    'Jasmin-Reis': ['jasmine rice', 'jasmin'],
    'Vollkornreis': ['brown rice', 'wholegrain rice'],
    'Haferflocken': ['oatmeal', 'oats', 'rolled oats'],
    // Drinks
    'Hafermilch / Haferdrink': ['oat milk', 'oat drink', 'Hafermilch', 'Haferdrink'],
    'Mandelmilch / Mandeldrink': ['almond milk', 'Mandelmilch', 'Mandeldrink'],
    'Sojamilch / Sojadrink': ['soy milk', 'soy drink', 'Sojamilch', 'Sojadrink'],
    'Kokosmilch-Drink': ['coconut milk drink', 'coconut drink', 'Kokosdrink'],
    'Orangensaft': ['orange juice', 'OJ'],
    'Apfelsaft': ['apple juice'],
    // Meat
    'Hähnchenbrustfilet': ['chicken breast', 'Hähnchenbrust', 'Hühnerbrust'],
    'Rinderhackfleisch': ['ground beef', 'beef mince', 'Rinderhack'],
    'Schweinehackfleisch': ['ground pork', 'pork mince', 'Schweinehack'],
    // Condiments / Spreads
    'Erdnussbutter': ['peanut butter'],
    // Snacks
    'Vollmilchschokolade': ['milk chocolate bar', 'Tafelschokolade'],
    'Zartbitterschokolade': ['dark chocolate', 'Bitterschokolade', 'Dunkle Schokolade', 'Dunkelschokolade', 'Edelbitter', 'Edelbitterschokolade'],
    'Weiße Schokolade': ['white chocolate'],
}

/**
 * Pre-built GENERIC_PRODUCTS array — enriched catalogue with stable `id`,
 * `emoji` (resolved), merged `aliases`, and all catalogue fields preserved.
 */
const _GENERIC_PRODUCTS = PRODUCT_CATALOGUE.map((p) => ({
    id: slugifyGenericId(p.name),
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || null,
    defaultUnit: p.defaultUnit,
    defaultQty: p.defaultQty,
    aliases: GENERIC_ALIASES[p.name] || [],
}))

const _GENERIC_BY_ID = new Map(_GENERIC_PRODUCTS.map((g) => [g.id, g]))
const _GENERIC_BY_NAME = new Map(_GENERIC_PRODUCTS.map((g) => [g.name.toLowerCase(), g]))
const _GENERIC_BY_SUB = new Map()
for (const g of _GENERIC_PRODUCTS) {
    if (!g.subcategory) continue
    if (!_GENERIC_BY_SUB.has(g.subcategory)) _GENERIC_BY_SUB.set(g.subcategory, [])
    _GENERIC_BY_SUB.get(g.subcategory).push(g)
}

// Build alias → generic product map (lowercased, normalised)
function _normAlias(s) {
    return s.toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ').trim()
}
const _ALIAS_INDEX = new Map()
for (const g of _GENERIC_PRODUCTS) {
    _ALIAS_INDEX.set(_normAlias(g.name), g)
    for (const a of g.aliases) {
        const key = _normAlias(a)
        if (!_ALIAS_INDEX.has(key)) _ALIAS_INDEX.set(key, g)
    }
}

/** All generic products (enriched catalogue entries). */
export function getAllGenericProducts() {
    return _GENERIC_PRODUCTS
}

/** Lookup generic product by stable id (slug). */
export function getGenericById(id) {
    return _GENERIC_BY_ID.get(id) || null
}

/** Lookup generic product by exact name (case-insensitive). */
export function getGenericByName(name) {
    if (!name) return null
    return _GENERIC_BY_NAME.get(name.toLowerCase()) || null
}

/** All generic products in a subcategory (exact subcategory name match). */
export function getGenericsForSubcategory(subcategory) {
    return _GENERIC_BY_SUB.get(subcategory) || []
}

/**
 * Match input text against generic product names + aliases.
 * Returns the first exact alias hit, or null.
 */
export function findGenericByAlias(text) {
    if (!text) return null
    const norm = _normAlias(text)
    if (!norm) return null
    return _ALIAS_INDEX.get(norm) || null
}
