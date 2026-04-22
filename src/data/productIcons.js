/**
 * Emoji-Icons für den Produktkatalog.
 *
 * Statt 650+ Einzelzuordnungen werden Emojis jetzt über die
 * Subcategory-Registry aufgelöst:
 *
 *   Product → Subcategory (via PRODUCT_CATALOGUE) → Emoji
 *
 * Ausnahmen für Produkte, deren Emoji stark vom Subcategory-Emoji abweicht,
 * werden in PRODUCT_EMOJI_OVERRIDES gepflegt.
 */

import PRODUCT_CATALOGUE from './productCatalogue.js'
import { getSubcategoryEmoji, getSubcategoryIcon, getCategoryIcon, CATEGORY_EMOJI } from './subcategories.js'
import { normaliseIcon } from '../utils/emojiCodepoint.js'

// ─── Product-level emoji overrides ───────────────────────────────────────────
// Only needed when a product's icon differs significantly from its subcategory.
// Organized by subcategory for maintainability. Products not listed here fall
// back to their subcategory's emoji (see data/subcategories.js).
const PRODUCT_EMOJI_OVERRIDES = {
    // ─── Dairy & Eggs ──────────────────────────────────────────────────────
    // Milch
    'Kakaotrunk / Schokomilch': '🍫',
    'Bananenmilch': '🍌',
    'Buttermilch': '🥛',
    'Kondensmilch': '🥫',
    'Milchpulver': '🥄',
    'Ziegenmilch': '🐐',
    // Quark & Desserts
    'Kräuterquark': '🌿',
    'Fruchtquark': '🍓',
    'Grießpudding': '🍮',
    'Milchreis (Becher)': '🍮',
    'Pudding (Becher)': '🍮',
    // Käse specifics
    'Mozzarella': '⚪',
    'Burrata': '⚪',
    'Feta / Hirtenkäse': '🧀',
    'Halloumi': '🧀',
    'Ziegenkäse': '🐐',
    'Reibekäse / Streukäse': '🧀',
    'Pizza-Käse (gerieben)': '🍕',
    'Veganer Käse': '🌱',
    // Butter & sahne
    'Butterschmalz / Ghee': '🫕',
    'Margarine': '🧈',
    'Pflanzenmargarine': '🌱',
    'Schlagsahne': '🥛',
    'Crème fraîche': '🥛',
    'Sprühsahne': '🥛',
    // Eier
    'Wachteleier': '🥚',
    'Flüssiges Eiweiß': '🥚',

    // ─── Fruits & Veg — fresh fruits ───────────────────────────────────────
    'Äpfel': '🍎',
    'Birnen': '🍐',
    'Orangen': '🍊',
    'Zitronen': '🍋',
    'Limetten': '🍋',
    'Grapefruits': '🍊',
    'Clementinen / Mandarinen': '🍊',
    'Blutorangen': '🍊',
    'Bananen': '🍌',
    'Mango': '🥭',
    'Ananas': '🍍',
    'Papaya': '🥭',
    'Kokosnuss (frisch)': '🥥',
    'Passionsfrucht / Maracuja': '🥭',
    'Drachenfrucht / Pitaya': '🐉',
    'Litschis': '🍒',
    'Kaki / Sharon-Frucht': '🍊',
    'Sternfrucht / Karambole': '⭐',
    'Guave': '🥭',
    'Kochbanane': '🍌',
    'Physalis': '🍊',
    'Erdbeeren': '🍓',
    'Heidelbeeren': '🫐',
    'Blaubeeren': '🫐',
    'Himbeeren': '🍓',
    'Brombeeren': '🫐',
    'Johannisbeeren': '🍒',
    'Stachelbeeren': '🍇',
    'Cranberries (frisch)': '🍒',
    'Pfirsiche': '🍑',
    'Nektarinen': '🍑',
    'Pflaumen': '🍑',
    'Aprikosen': '🍑',
    'Kirschen': '🍒',
    'Mirabellen': '🍑',
    'Zwetschgen': '🍑',
    'Weintrauben (hell)': '🍇',
    'Weintrauben (dunkel)': '🍇',
    'Wassermelone': '🍉',
    'Honigmelone': '🍈',
    'Galiamelone': '🍈',
    'Granatapfel': '🍎',
    'Feigen (frisch)': '🫐',
    'Kiwi': '🥝',
    'Rhabarber': '🌿',
    'Avocado': '🥑',

    // Obstkonserven & trockenfrüchte
    'Apfelmus': '🍎',
    'Rosinen': '🍇',
    'Sultaninen': '🍇',
    'Datteln': '🫘',
    'Bananenchips': '🍌',
    'Kokosraspeln': '🥥',
    'Gojibeeren': '🫐',

    // Wurzelgemüse
    'Kartoffeln (festkochend)': '🥔',
    'Kartoffeln (mehligkochend)': '🥔',
    'Kartoffeln (vorwiegend festkochend)': '🥔',
    'Süßkartoffeln': '🍠',
    'Karotten / Möhren': '🥕',
    'Rote Bete': '🥬',
    'Radieschen': '🥬',
    'Rettich': '🥬',
    'Ingwer': '🫚',
    'Kurkuma (frisch)': '🫚',

    // Zwiebeln & Knoblauch
    'Zwiebeln': '🧅',
    'Rote Zwiebeln': '🧅',
    'Frühlingszwiebeln': '🌱',
    'Schalotten': '🧅',
    'Knoblauch': '🧄',
    'Lauch / Porree': '🌱',
    'Bärlauch': '🌿',

    // Tomaten & Paprika
    'Tomaten': '🍅',
    'Kirschtomaten': '🍅',
    'Strauchtomaten / Rispentomaten': '🍅',
    'Roma-Tomaten / Eiertomaten': '🍅',
    'Paprika rot': '🫑',
    'Paprika gelb': '🫑',
    'Paprika grün': '🫑',
    'Spitzpaprika': '🫑',
    'Paprika-Mix': '🫑',
    'Chilischoten': '🌶️',
    'Peperoni': '🌶️',
    'Aubergine': '🍆',

    // Kürbis & Gurke
    'Gurke (Salatgurke)': '🥒',
    'Minigurken / Snackgurken': '🥒',
    'Zucchini': '🥒',
    'Butternut-Kürbis': '🎃',
    'Hokkaido-Kürbis': '🎃',

    // Kohl & Salate (mostly 🥬 already; add distinct ones)
    'Brokkoli': '🥦',
    'Blumenkohl': '🥦',
    'Romanesco': '🥦',
    'Kohlrabi': '🥬',

    // Hülsenfrüchte & Mais
    'Maiskolben': '🌽',
    'Grüne Bohnen': '🫛',
    'Erbsen (frisch / Zuckerschoten)': '🫛',
    'Zuckerschoten': '🫛',
    'Sojasprossen': '🌱',
    'Bambussprossen': '🎋',

    // Pilze
    'Shiitake-Pilze': '🍄',
    'Steinpilze (getrocknet)': '🍄',

    // Hülsenfrüchte (trocken & Dose)
    'Kichererbsen (Dose)': '🫘',
    'Kichererbsen (trocken)': '🫘',
    'Rote Linsen': '🫘',
    'Grüne Linsen': '🫘',
    'Braune Linsen': '🫘',
    'Beluga-Linsen': '🫘',
    'Kidneybohnen (Dose)': '🫘',
    'Schwarze Bohnen (Dose)': '🫘',
    'Weiße Bohnen (Dose)': '🫘',
    'Dicke Bohnen (Dose)': '🫘',
    'Bohnenmischung (Dose)': '🫘',
    'Edamame': '🫛',
    'Gelbe Erbsen (trocken)': '🫛',
    'Mungobohnen (trocken)': '🫘',

    // Gemüsekonserven
    'Mais (Dose)': '🌽',
    'Erbsen (Dose)': '🫛',
    'Erbsen & Möhren (Dose)': '🥕',
    'Geschälte Tomaten (Dose)': '🍅',
    'Gehackte Tomaten (Dose)': '🍅',
    'Getrocknete Tomaten': '🍅',
    'Kokosmilch (Dose)': '🥥',
    'Kokoscreme (Dose)': '🥥',

    // Nüsse & Kerne (all distinct)
    'Mandeln': '🥜',
    'Walnüsse': '🌰',
    'Cashewkerne': '🥜',
    'Erdnüsse': '🥜',
    'Pistazien': '🥜',
    'Haselnüsse': '🌰',
    'Paranüsse': '🌰',
    'Pekannüsse': '🌰',
    'Macadamia-Nüsse': '🥜',
    'Walnusskerne': '🌰',
    'Pinienkerne': '🌰',
    'Maronen / Esskastanien': '🌰',
    'Sonnenblumenkerne': '🌻',
    'Kürbiskerne': '🎃',
    'Sesam': '🌱',
    'Chiasamen': '🌱',
    'Leinsamen': '🌱',
    'Hanfsamen': '🌱',
    'Mohnsamen': '🌱',

    // Tofu & Soja
    'Tofu (Natur)': '🧊',
    'Seidentofu': '🧊',
    'Räuchertofu': '🧊',
    'Tempeh': '🌱',
    'Seitan': '🌱',

    // ─── Meat & Fish ──────────────────────────────────────────────────────
    // Geflügel
    'Hähnchenbrustfilet': '🍗',
    'Hähnchenschenkel': '🍗',
    'Hähnchenkeulen': '🍗',
    'Hähnchenflügel': '🍗',
    'Ganzes Hähnchen': '🐔',
    'Ganze Ente': '🦆',
    'Entenbrust': '🦆',
    // Rind / Schwein / Lamm — 🥩 for steaks, 🍖 for roasts, 🥓 for bacon
    'Rinderbraten': '🍖',
    'Schweinebauch': '🥓',
    'Schweinerippchen / Spareribs': '🍖',
    'Schweinebraten': '🍖',
    'Lammkeule': '🍖',
    'Lammhaxe': '🍖',
    'Kaninchen': '🐰',
    // Wurst & Würstchen
    'Bratwurst': '🌭',
    'Nürnberger Rostbratwürstchen': '🌭',
    'Thüringer Rostbratwurst': '🌭',
    'Frankfurter / Wiener Würstchen': '🌭',
    'Bockwurst': '🌭',
    'Weißwurst': '🌭',
    'Currywurst': '🌭',
    'Geflügelwürstchen': '🌭',
    'Chorizo': '🌭',
    'Merguez': '🌭',
    'Speck (Frühstücksspeck)': '🥓',
    'Speck (geräuchert)': '🥓',
    'Bauchspeck / Pancetta': '🥓',
    'Speckwürfel': '🥓',
    'Frikadellen / Bouletten': '🍖',
    'Burger-Patties (Rind)': '🍔',
    'Hackbällchen / Fleischbällchen': '🍖',
    'Leberkäse / Fleischkäse': '🍖',
    // Aufschnitt
    'Salami': '🌭',
    'Ungarische Salami': '🌭',
    'Peperoni-Salami': '🌭',
    'Mortadella': '🥓',
    'Kochschinken': '🥓',
    'Schwarzwälder Schinken': '🥓',
    'Parmaschinken / Prosciutto': '🥓',
    'Serranoschinken': '🥓',
    'Lachsschinken': '🥓',
    'Schinkenspeck': '🥓',
    // Frischer Fisch
    'Lachsfilet': '🐟',
    'Thunfischsteak': '🐟',
    'Forelle (ganz)': '🐟',
    'Makrele (ganz)': '🐟',
    'Hering (frisch)': '🐟',
    'Sardinen (frisch)': '🐟',
    // Meeresfrüchte
    'Garnelen / Shrimps (roh)': '🦐',
    'Garnelen / Shrimps (gekocht)': '🦐',
    'Riesengarnelen': '🦐',
    'Tintenfisch / Calamari': '🦑',
    'Miesmuscheln': '🦪',
    'Venusmuscheln': '🦪',
    'Jakobsmuscheln': '🦪',
    'Oktopus': '🐙',
    'Hummer': '🦞',
    'Flusskrebse': '🦞',
    'Nordseekrabben': '🦀',
    // Fisch Dose
    'Thunfisch (Dose)': '🥫',
    'Sardinen (Dose)': '🥫',
    'Sardinen in Öl': '🥫',
    'Lachs (Dose)': '🥫',
    'Fischstäbchen': '🐟',
    // Vegan
    'Vegane Burger-Patties': '🌱',
    'Veganes Hackfleisch': '🌱',
    'Vegane Würstchen': '🌱',
    'Vegane Nuggets': '🌱',
    'Veganes Schnitzel': '🌱',
    'Veganer Aufschnitt': '🌱',

    // ─── Drinks ────────────────────────────────────────────────────────────
    // Wasser
    'Stilles Wasser': '💧',
    'Sprudel / Mineralwasser (mit Kohlensäure)': '💧',
    'Mineralwasser medium': '💧',
    'Heilwasser': '💧',
    // Saft
    'Orangensaft': '🍊',
    'Apfelsaft': '🍎',
    'Traubensaft': '🍇',
    'Kirschsaft': '🍒',
    'Tomatensaft': '🍅',
    'Ananassaft': '🍍',
    'Mangosaft': '🥭',
    'Karottensaft': '🥕',
    'Zitronensaft': '🍋',
    // Schorle & Limo
    'Apfelschorle': '🍎',
    'Cola': '🥤',
    'Cola Zero / Light': '🥤',
    'Limonade (Zitrone)': '🍋',
    'Limonade (Orange)': '🍊',
    'Energy-Drink': '⚡',
    'Iso-Drink / Sportgetränk': '⚡',
    'Eistee': '🧊',
    // Smoothies
    'Frucht-Smoothie': '🥤',
    'Grüner Smoothie': '🥬',
    'Protein-Smoothie': '💪',
    // Kaffee
    'Kaffeebohnen': '☕',
    'Gemahlener Kaffee (Filterkaffee)': '☕',
    'Espresso (gemahlen)': '☕',
    'Instantkaffee / löslicher Kaffee': '☕',
    'Kaffeekapseln': '☕',
    'Kaffeepads': '☕',
    'Entkoffeinierter Kaffee': '☕',
    'Eiskaffee (Fertiggetränk)': '🧊',
    'Kaffeefiltertüten': '📄',
    // Tee
    'Schwarztee': '🍵',
    'Grüntee': '🍵',
    'Matcha-Pulver': '🍵',
    'Chai-Tee': '🍵',
    'Ingwertee': '🫚',
    // Kakao
    'Kakaopulver': '🍫',
    'Trinkschokolade': '🍫',
    // Pflanzenmilch
    'Hafermilch / Haferdrink': '🌾',
    'Sojamilch / Sojadrink': '🌱',
    'Mandelmilch / Mandeldrink': '🥜',
    'Reismilch / Reisdrink': '🍚',
    'Kokosmilch-Drink': '🥥',
    'Cashewdrink': '🥜',
    'Dinkeldrink': '🌾',
    'Haferdrink Barista': '🌾',
    // Bier / Wein
    'Malzbier': '🍺',
    'Alkoholfreies Bier': '🍺',
    'Rotwein': '🍷',
    'Weißwein': '🍷',
    'Roséwein': '🍷',
    'Sekt': '🥂',
    'Prosecco': '🥂',
    'Glühwein': '🍷',
    // Spirituosen
    'Wodka': '🍸',
    'Gin': '🍸',
    'Rum': '🥃',
    'Whisky / Whiskey': '🥃',
    'Tequila': '🥃',
    'Weinbrand / Cognac': '🥃',
    'Likör': '🍸',
    // Sonstiges
    'Kokoswasser': '🥥',
    'Proteinpulver / Eiweißpulver': '💪',

    // ─── Bread & Grains ───────────────────────────────────────────────────
    // Brot — most use 🍞 subcategory default; special ones:
    'Toastbrot': '🍞',
    'Vollkorntoast': '🍞',
    // Brötchen & Kleingebäck
    'Laugenbrötchen': '🥨',
    'Laugenstange': '🥨',
    'Brezel / Breze': '🥨',
    'Baguette': '🥖',
    'Ciabatta': '🥖',
    'Focaccia': '🥖',
    // Fladenbrot
    'Bagels': '🥯',
    'Taco-Schalen': '🌮',
    'Tortilla-Wraps (Weizen)': '🌯',
    'Tortilla-Wraps (Mais)': '🌯',
    // Feingebäck
    'Croissants': '🥐',
    'Schoko-Croissants': '🥐',
    'Brioche': '🥐',
    'Pizzateig (fertig)': '🍕',
    // Nudeln (🍝 default, emphasise shapes)
    'Spaghetti': '🍝',
    'Penne': '🍝',
    'Fusilli / Spiralnudeln': '🍝',
    'Tagliatelle / Bandnudeln': '🍝',
    'Farfalle / Schmetterlingsnudeln': '🦋',
    'Gnocchi': '🥟',
    'Tortellini (frisch)': '🥟',
    'Ravioli (frisch)': '🥟',
    'Maultaschen (frisch)': '🥟',
    'Couscous': '🌾',
    // Asiatische Nudeln
    'Ramen-Nudeln': '🍜',
    'Udon-Nudeln': '🍜',
    'Soba-Nudeln': '🍜',
    'Mie-Nudeln': '🍜',
    'Reisnudeln': '🍜',
    'Reispapier': '📄',
    // Reis
    'Langkornreis': '🍚',
    'Naturreis / Vollkornreis': '🍚',
    'Basmatireis': '🍚',
    'Jasminreis': '🍚',
    'Risotto-Reis / Arborio': '🍚',
    'Wildreis': '🍚',
    'Sushi-Reis': '🍣',
    // Getreide
    'Haferflocken (zart)': '🌾',
    'Haferflocken (kernig)': '🌾',
    'Müsli': '🥣',
    'Knuspermüsli / Granola': '🥣',
    'Cornflakes': '🥣',
    'Schoko-Cerealien': '🍫',
    'Porridge (Instant)': '🥣',
    // Cracker
    'Reiswaffeln': '🍘',
    'Maiswaffeln': '🌽',

    // ─── Snacks & Sweets ──────────────────────────────────────────────────
    // Schokolade
    'Vollmilchschokolade': '🍫',
    'Zartbitterschokolade': '🍫',
    'Weiße Schokolade': '🍫',
    'Nussschokolade': '🍫',
    'Pralinen': '🍫',
    'Schokoriegel': '🍫',
    'Nuss-Nougat-Creme': '🍫',
    // Süßigkeiten
    'Gummibärchen': '🐻',
    'Fruchtgummi': '🍬',
    'Weingummi': '🍬',
    'Lakritz': '🍬',
    'Bonbons': '🍬',
    'Lutscher / Lollipops': '🍭',
    'Marshmallows': '🍡',
    'Kaugummi': '🍬',
    'Pfefferminzbonbons': '🍬',
    'Karamellbonbons / Toffees': '🍬',
    'Nougat': '🍬',
    'Marzipan': '🍬',
    'Lebkuchen': '🍪',
    'Spekulatius': '🍪',
    // Salzige Snacks
    'Kartoffelchips': '🍟',
    'Paprikachips': '🍟',
    'Ungarisch-Chips': '🍟',
    'Tortilla-Chips': '🍟',
    'Salzstangen': '🥨',
    'Mini-Brezeln / Salzbrezel': '🥨',
    'Popcorn': '🍿',
    'Mikrowellen-Popcorn': '🍿',
    'Erdnussflips': '🥜',
    'Gesalzene Nüsse': '🥜',
    // Kekse & Kuchen
    'Butterkekse': '🍪',
    'Vollkornkekse': '🍪',
    'Schokoladenkekse': '🍪',
    'Doppelkekse': '🍪',
    'Haferflockenkekse': '🍪',
    'Waffeln': '🧇',
    'Zwieback': '🍪',
    'Muffins': '🧁',
    'Brownies': '🍫',
    'Berliner / Krapfen': '🍩',
    'Apfelstrudel': '🥧',
    'Käsekuchen': '🍰',
    'Schwarzwälder Kirschtorte': '🍰',
    // Desserts & Eis
    'Vanillesoße': '🍮',
    'Wackelpudding / Götterspeise': '🍮',
    'Panna Cotta': '🍮',
    'Mousse au Chocolat': '🍫',
    'Tiramisu': '🍰',
    'Crème brûlée': '🍮',
    'Eiscreme (Becher)': '🍨',
    'Eis am Stiel': '🍦',
    'Eishörnchen / Cornetto': '🍦',
    'Frozen Yogurt': '🍨',
    'Sorbet': '🍧',
    'Wassereis': '🍧',
    'Mochi-Eis': '🍡',
    // Aufstriche
    'Erdnussbutter': '🥜',
    'Mandelmus': '🥜',
    'Cashewmus': '🥜',
    'Tahini / Sesammus': '🌱',

    // ─── Frozen (TK) ──────────────────────────────────────────────────────
    'TK-Erbsen': '🫛',
    'TK-Blattspinat': '🥬',
    'TK-Rahmspinat': '🥬',
    'TK-Brokkoli': '🥦',
    'TK-Blumenkohl': '🥦',
    'TK-Mais': '🌽',
    'TK-Edamame': '🫛',
    'TK-Zwiebeln (gewürfelt)': '🧅',
    'TK-Erdbeeren': '🍓',
    'TK-Himbeeren': '🍓',
    'TK-Heidelbeeren': '🫐',
    'TK-Mango (Stücke)': '🥭',
    'TK-Sauerkirschen': '🍒',
    'TK-Ananas (Stücke)': '🍍',
    'TK-Pommes frites': '🍟',
    'TK-Süßkartoffel-Pommes': '🍠',
    'TK-Kartoffelecken / Wedges': '🥔',
    'TK-Rösti': '🥔',
    'TK-Kroketten': '🥔',
    'TK-Pizza': '🍕',
    'TK-Lasagne': '🍝',
    'TK-Chicken Nuggets': '🍗',
    'TK-Hähnchen-Strips': '🍗',
    'TK-Hähnchenflügel': '🍗',
    'TK-Burger-Patties': '🍔',
    'TK-Bratwurst': '🌭',
    'TK-Fischstäbchen': '🐟',
    'TK-Lachsfilet': '🐟',
    'TK-Kabeljaufilet': '🐟',
    'TK-Seelachsfilet': '🐟',
    'TK-Garnelen': '🦐',
    'TK-Calamari-Ringe': '🦑',
    'TK-Frühlingsrollen': '🥟',
    'TK-Gyoza / Teigtaschen': '🥟',
    'TK-Dim Sum': '🥟',
    'TK-Samosas': '🥟',
    'TK-Falafel': '🧆',
    'TK-Brötchen': '🥖',
    'TK-Baguette': '🥖',
    'TK-Croissants': '🥐',
    'TK-Waffeln': '🧇',
    'TK-Pfannkuchen': '🥞',
    'TK-Laugenbrezel': '🥨',
    'TK-Naan / Fladenbrot': '🥙',

    // ─── Ready Meals ──────────────────────────────────────────────────────
    'Tomatensuppe (Dose)': '🍅',
    'Hühnersuppe (Dose)': '🍗',
    'Pilzsuppe (Dose)': '🍄',
    'Miso-Suppe (Instant)': '🍜',
    'Instant-Nudeln / Cup-Nudeln': '🍜',
    'Instant-Ramen': '🍜',
    'Kartoffelpüree (Instant)': '🥔',
    'Tomatensoße (Glas)': '🍅',
    'Bolognese-Soße (Glas)': '🍝',
    'Arrabbiata-Soße (Glas)': '🌶️',
    'Pesto Genovese (grün)': '🌿',
    'Pesto Rosso (rot)': '🍅',
    'Ravioli (Dose)': '🥟',
    'Chili con Carne (Dose)': '🌶️',
    'Spaghetti (Dose)': '🍝',
    // Dips
    'Hummus': '🫘',
    'Guacamole': '🥑',
    'Tzatziki': '🥒',
    'Salsa': '🍅',
    'Aioli-Dip': '🧄',
    // Fertigsalate
    'Frische Pizza (gekühlt)': '🍕',
    'Belegtes Brötchen / Sandwich': '🥪',
    'Wrap (fertig)': '🌯',
    'Sushi (fertig)': '🍣',
    'Kartoffelsalat': '🥔',
    'Nudelsalat': '🍝',
    'Falafel (fertig)': '🧆',
    // Kochsets
    'Taco-Set': '🌮',
    'Fajita-Set': '🌯',
    // Tomatenprodukte
    'Passierte Tomaten / Passata': '🍅',
    'Tomatenmark': '🍅',
    'Pizzasoße': '🍕',

    // ─── Condiments ───────────────────────────────────────────────────────
    // Öle
    'Olivenöl (extra vergine)': '🫒',
    'Olivenöl (zum Braten)': '🫒',
    'Sonnenblumenöl': '🌻',
    'Rapsöl': '🌼',
    'Kokosöl': '🥥',
    'Sesamöl': '🌱',
    'Walnussöl': '🌰',
    'Kürbiskernöl': '🎃',
    // Essig
    'Apfelessig': '🍎',
    'Reisessig': '🍚',
    // Tischsoßen
    'Ketchup': '🍅',
    'Senf (mittelscharf)': '🌭',
    'Senf (süß / bayerisch)': '🌭',
    'Senf (Dijon)': '🌭',
    'Senf (Körniger)': '🌭',
    'Mayonnaise': '🥚',
    'Leichte Mayonnaise': '🥚',
    'Sriracha': '🌶️',
    'Tabasco': '🌶️',
    'Chilisoße / Scharfe Soße': '🌶️',
    'Knoblauchsoße / Aioli': '🧄',
    // Asiatisch
    'Sojasoße': '🥢',
    'Sojasoße (hell)': '🥢',
    'Sojasoße (dunkel)': '🥢',
    'Teriyaki-Soße': '🥢',
    'Süße Chilisoße': '🌶️',
    'Sambal Oelek': '🌶️',
    'Wasabi-Paste': '🌶️',
    'Harissa': '🌶️',
    'Gochujang (koreanische Chilipaste)': '🌶️',
    'Thai-Currypaste (grün)': '🌿',
    'Thai-Currypaste (rot)': '🌶️',
    'Thai-Currypaste (gelb)': '🌶️',
    'Miso-Paste': '🥢',
    // Gewürze (subset — the important distinctive ones)
    'Salz': '🧂',
    'Meersalz': '🧂',
    'Fleur de Sel': '🧂',
    'Kräutersalz': '🌿',
    'Schwarzer Pfeffer (gemahlen)': '🧂',
    'Pfefferkörner (ganz)': '🧂',
    'Weißer Pfeffer': '🧂',
    'Paprika edelsüß': '🌶️',
    'Paprika geräuchert': '🌶️',
    'Paprika rosenscharf': '🌶️',
    'Chiliflocken': '🌶️',
    'Chilipulver': '🌶️',
    'Cayennepfeffer': '🌶️',
    'Currypulver': '🌶️',
    'Zimt (gemahlen)': '🌿',
    'Zimtstangen': '🌿',
    'Vanilleschoten': '🌿',
    'Vanilleextrakt': '🍼',
    'Vanillezucker': '🍬',
    'Safran': '🌸',
    'Lorbeerblätter': '🍃',
    'Knoblauchpulver': '🧄',
    'Zwiebelpulver': '🧅',
    // Süßungsmittel
    'Weißer Zucker': '🍬',
    'Brauner Zucker': '🍬',
    'Puderzucker': '🍬',
    'Rohrzucker': '🍬',
    'Gelierzucker (2:1)': '🍬',
    'Gelierzucker (3:1)': '🍬',
    'Kokosblütenzucker': '🥥',
    'Honig': '🍯',
    'Ahornsirup': '🍁',
    'Agavendicksaft': '🌵',
    'Zuckerrübensirup': '🍯',
    'Dattelsirup': '🍯',
    // Marmelade
    'Erdbeermarmelade / -konfitüre': '🍓',
    'Aprikosenmarmelade': '🍑',
    'Himbeermarmelade': '🍓',
    'Kirschmarmelade': '🍒',
    'Orangenmarmelade': '🍊',
    'Pflaumenmus': '🍑',
    'Gelee (Johannisbeere)': '🍇',
    // Brühe
    'Gemüsebrühwürfel': '🥬',
    'Hühnerbrühwürfel': '🍗',
    'Rinderbrühwürfel': '🥩',
    // Backzutaten
    'Backpulver': '🥣',
    'Natron': '🥣',
    'Trockenhefe': '🍞',
    'Frische Hefe': '🍞',
    'Gelatine (Blatt / Pulver)': '🥣',
    'Kakaopulver (Back)': '🍫',
    'Puddingpulver': '🍮',
    // Eingelegtes
    'Gewürzgurken': '🥒',
    'Cornichons': '🥒',
    'Senfgurken': '🥒',
    'Oliven (grün)': '🫒',
    'Oliven (schwarz)': '🫒',
    'Oliven (Kalamata)': '🫒',
    'Kapern': '🫒',
    'Peperoni (eingelegt)': '🌶️',
    'Silberzwiebeln': '🧅',
    'Mango-Chutney': '🥭',

    // ─── Baby Food ────────────────────────────────────────────────────────
    // Mostly use 🍼 default; emphasise specifics
    'Quetschbeutel / Fruchtpüree': '🍎',
    'Baby-Reiswaffeln': '🍘',
    'Babywasser': '💧',
    'Baby-Tee (Fenchel / Kamille)': '🍵',
    'Baby-Joghurt': '🥛',

    // ─── Other / Household ────────────────────────────────────────────────
    // Küche
    'Spülmittel': '🧽',
    'Geschirrspültabs': '🧼',
    'Klarspüler': '🧼',
    'Spülmaschinensalz': '🧂',
    'Küchenschwämme': '🧽',
    'Topfreiniger / Stahlwolle': '🧽',
    'Küchenrolle': '🧻',
    'Frischhaltefolie': '📜',
    'Alufolie': '📜',
    'Backpapier': '📄',
    'Gefrierbeutel': '🛍️',
    'Butterbrotbeutel / Frühstückstüten': '🛍️',
    'Vorratsdosen': '🥡',
    // Reinigung
    'Allzweckreiniger': '🧴',
    'Glasreiniger': '🪟',
    'Badreiniger': '🛁',
    'WC-Reiniger': '🚽',
    'Scheuermilch': '🧴',
    'Bodenreiniger': '🧴',
    'Entkalker': '🧴',
    'Desinfektionsspray': '🧴',
    'Feuchte Reinigungstücher': '🧻',
    'Backofenreiniger': '🧴',
    'Rohrreiniger': '🧴',
    'Raumduft / Lufterfrischer': '🌸',
    'Essigessenz (Reinigung)': '🧴',
    // Wäschepflege
    'Waschmittel (flüssig)': '🧴',
    'Waschmittel (Pulver)': '🧺',
    'Waschmittel-Pods / -Caps': '🧺',
    'Colorwaschmittel': '🧺',
    'Feinwaschmittel': '🧺',
    'Weichspüler': '🧴',
    'Fleckenentferner': '🧴',
    'Hygienespüler': '🧴',
    // Papierprodukte
    'Toilettenpapier': '🧻',
    'Taschentücher': '🤧',
    'Servietten': '🧻',
    'Müllbeutel / Mülltüten': '🗑️',
    'Bio-Müllbeutel': '🗑️',
    // Körperpflege
    'Handseife (flüssig)': '🧼',
    'Handseife (Nachfüller)': '🧼',
    'Desinfektionsmittel (Hand)': '🧴',
    'Duschgel': '🧴',
    'Stückseife / Seife': '🧼',
    'Shampoo': '🧴',
    'Spülung / Conditioner': '🧴',
    'Zahnpasta': '🪥',
    'Zahnbürste': '🪥',
    'Mundspülung': '🪥',
    'Zahnseide': '🪥',
    'Deodorant / Deo': '🧴',
    'Bodylotion / Körperlotion': '🧴',
    'Gesichtscreme': '🧴',
    'Handcreme': '🧴',
    'Lippenpflege': '💄',
    'Sonnencreme': '☀️',
    'Rasierer / Rasierklingen': '🪒',
    'Rasierschaum / Rasiergel': '🧴',
    'Wattepads': '🤍',
    'Wattestäbchen': '🦽',
    // Damenhygiene
    'Damenbinden': '🩸',
    'Tampons': '🩸',
    'Slipeinlagen': '🩸',
    // Baby & Kind
    'Windeln': '👶',
    'Feuchttücher (Baby)': '🧻',
    'Wundschutzcreme': '🧴',
    'Babyshampoo': '🧴',
    'Babybadezusatz': '🛁',
    // Gesundheit
    'Multivitamin-Tabletten': '💊',
    'Vitamin C': '💊',
    'Vitamin D': '💊',
    'Eisentabletten': '💊',
    'Omega-3 / Fischöl-Kapseln': '💊',
    'Magnesium': '💊',
    'Zink-Tabletten': '💊',
    'Probiotika': '💊',
    'Pflaster': '🩹',
    'Schmerzmittel (Ibuprofen / Paracetamol)': '💊',
    'Halstabletten / Lutschtabletten': '💊',
    'Nasenspray': '👃',
    'Hustensaft': '🧴',
    'Augentropfen': '👁️',
    'Mückenschutz / Insektenschutz': '🦟',
    'Wundsalbe / Heilsalbe': '🧴',
    // Tierbedarf
    'Katzenfutter (Nassfutter)': '🐱',
    'Katzenfutter (Trockenfutter)': '🐱',
    'Hundefutter (Nassfutter)': '🐶',
    'Hundefutter (Trockenfutter)': '🐶',
    'Katzenstreu': '🐱',
    'Leckerlis / Snacks (Tier)': '🦴',
    // Haushalt Sonstiges
    'Batterien (AA / Mignon)': '🔋',
    'Batterien (AAA / Micro)': '🔋',
    'Glühbirnen / Leuchtmittel': '💡',
    'Kerzen / Teelichter': '🕯️',
    'Streichhölzer / Feuerzeug': '🔥',
    'Gummihandschuhe': '🧤',
    'Wäscheklammern': '🧺',
}

// ─── Pre-built lookup: product name → subcategory name ───────────────────────
const PRODUCT_TO_SUBCATEGORY = new Map()
for (const p of PRODUCT_CATALOGUE) {
    if (p.subcategory) {
        PRODUCT_TO_SUBCATEGORY.set(p.name, p.subcategory)
    }
}

// Also build: product name → category (for fallback)
const PRODUCT_TO_CATEGORY = new Map()
for (const p of PRODUCT_CATALOGUE) {
    PRODUCT_TO_CATEGORY.set(p.name, p.category)
}

// ─── Export ──────────────────────────────────────────────────────────────────

/**
 * Emoji für ein Produkt abrufen.
 *
 * Resolution order:
 *  1. Product-level override (PRODUCT_EMOJI_OVERRIDES)
 *  2. Subcategory emoji (via subcategories.js registry)
 *  3. Category fallback emoji
 *  4. 🛒
 *
 * @param {string} productName — exakter Name aus PRODUCT_CATALOGUE
 * @param {string} [category]  — Kategorie als Fallback
 * @returns {string} Emoji
 */
export function getProductEmoji(productName, category) {
    // 1. Override
    const override = PRODUCT_EMOJI_OVERRIDES[productName]
    if (override) return override

    // 2. Subcategory
    const subName = PRODUCT_TO_SUBCATEGORY.get(productName)
    if (subName) return getSubcategoryEmoji(subName, category)

    // 3. Category fallback
    const cat = category || PRODUCT_TO_CATEGORY.get(productName)
    if (cat) return CATEGORY_EMOJI[cat] || '🛒'

    return '🛒'
}

// ─── OpenMoji hex resolution ────────────────────────────────────────────────
//
// Optional product-level OpenMoji hex overrides. Use when a specific product
// benefits from a different OpenMoji glyph than its subcategory default.
// Values are OpenMoji hex codes (e.g. '1F34E') — not emoji characters.
const PRODUCT_ICON_OVERRIDES = {
    // 'Parmesan / Parmigiano': '1F9C0',
}

/**
 * OpenMoji hex code for a product. Resolution order:
 *   1. PRODUCT_ICON_OVERRIDES (explicit hex)
 *   2. PRODUCT_EMOJI_OVERRIDES (emoji → hex)
 *   3. Subcategory icon (registry)
 *   4. Category icon
 *   5. '1F6D2' (🛒)
 */
export function getProductIcon(productName, category) {
    // 1. Explicit hex override
    const hexOverride = PRODUCT_ICON_OVERRIDES[productName]
    if (hexOverride) return hexOverride.toUpperCase()

    // 2. Emoji override → hex
    const emojiOverride = PRODUCT_EMOJI_OVERRIDES[productName]
    if (emojiOverride) {
        const hex = normaliseIcon(emojiOverride)
        if (hex) return hex
    }

    // 3. Subcategory
    const subName = PRODUCT_TO_SUBCATEGORY.get(productName)
    if (subName) return getSubcategoryIcon(subName, category)

    // 4. Category
    const cat = category || PRODUCT_TO_CATEGORY.get(productName)
    if (cat) return getCategoryIcon(cat)

    return '1F6D2'
}

export { CATEGORY_EMOJI, PRODUCT_EMOJI_OVERRIDES, PRODUCT_ICON_OVERRIDES }
