/**
 * Product category classification — three-level cascade:
 * 1. Open Food Facts taxonomy (instant, ~70–80% coverage)
 * 2. Keyword rules — German + English (instant, ~15% more)
 * 3. Falls back to 'Other'
 */
import EggAltIcon from '@mui/icons-material/EggAlt'
import GrassIcon from '@mui/icons-material/Grass'
import SetMealIcon from '@mui/icons-material/SetMeal'
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'
import CakeIcon from '@mui/icons-material/Cake'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import DinnerDiningIcon from '@mui/icons-material/DinnerDining'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import CategoryIcon from '@mui/icons-material/Category'

// ── Category list ─────────────────────────────────────────────────────────────
export const CATEGORIES = [
    'Dairy & Eggs',
    'Fruits & Veg',
    'Meat & Fish',
    'Drinks',
    'Bread & Grains',
    'Snacks & Sweets',
    'Frozen',
    'Ready Meals',
    'Condiments',
    'Baby Food',
    'Other',
]

// ── Category icons for the UI ─────────────────────────────────────────────────
export const CATEGORY_ICONS = {
    'Dairy & Eggs': EggAltIcon,
    'Fruits & Veg': GrassIcon,
    'Meat & Fish': SetMealIcon,
    'Drinks': LocalDrinkIcon,
    'Bread & Grains': BakeryDiningIcon,
    'Snacks & Sweets': CakeIcon,
    'Frozen': AcUnitIcon,
    'Ready Meals': DinnerDiningIcon,
    'Condiments': LocalDiningIcon,
    'Baby Food': ChildCareIcon,
    'Other': CategoryIcon,
}



// ── OFF taxonomy → category (comprehensive, sourced from OFF taxonomy) ────────
const OFF_CATEGORY_MAP = {
    // Dairy & Eggs
    'en:dairies': 'Dairy & Eggs',
    'en:dairy-products': 'Dairy & Eggs',
    'en:milks': 'Dairy & Eggs',
    'en:milks-and-their-substitutes': 'Dairy & Eggs',
    'en:whole-milks': 'Dairy & Eggs',
    'en:semi-skimmed-milks': 'Dairy & Eggs',
    'en:skimmed-milks': 'Dairy & Eggs',
    'en:fresh-milks': 'Dairy & Eggs',
    'en:buttermilks': 'Dairy & Eggs',
    'en:flavoured-milks': 'Dairy & Eggs',
    'en:chocolate-milks': 'Dairy & Eggs',
    'en:cheeses': 'Dairy & Eggs',
    'en:fresh-cheeses': 'Dairy & Eggs',
    'en:hard-cheeses': 'Dairy & Eggs',
    'en:soft-cheeses': 'Dairy & Eggs',
    'en:blue-cheeses': 'Dairy & Eggs',
    'en:blue-veined-cheeses': 'Dairy & Eggs',
    'en:processed-cheeses': 'Dairy & Eggs',
    'en:cream-cheeses': 'Dairy & Eggs',
    'en:cow-cheeses': 'Dairy & Eggs',
    'en:goat-cheeses': 'Dairy & Eggs',
    'en:sheep-cheeses': 'Dairy & Eggs',
    'en:italian-cheeses': 'Dairy & Eggs',
    'en:german-cheeses': 'Dairy & Eggs',
    'en:brined-cheeses': 'Dairy & Eggs',
    'en:cheese-spreads': 'Dairy & Eggs',
    'en:grated-cheese': 'Dairy & Eggs',
    'en:grilling-cheeses': 'Dairy & Eggs',
    'en:yogurts': 'Dairy & Eggs',
    'en:fruit-yogurts': 'Dairy & Eggs',
    'en:greek-yogurts': 'Dairy & Eggs',
    'en:drinking-yogurts': 'Dairy & Eggs',
    'en:skyrs': 'Dairy & Eggs',
    'en:fermented-milk-products': 'Dairy & Eggs',
    'en:kefirs': 'Dairy & Eggs',
    'en:fromage-frais': 'Dairy & Eggs',
    'en:quark': 'Dairy & Eggs',
    'en:quarks': 'Dairy & Eggs',
    'en:dairy-desserts': 'Dairy & Eggs',
    'en:fermented-dairy-desserts': 'Dairy & Eggs',
    'en:rice-puddings': 'Dairy & Eggs',
    'en:eggs': 'Dairy & Eggs',
    'en:egg-products': 'Dairy & Eggs',
    'en:butters': 'Dairy & Eggs',
    'en:salted-butters': 'Dairy & Eggs',
    'en:unsalted-butters': 'Dairy & Eggs',
    'en:margarines': 'Dairy & Eggs',
    'en:dairy-spreads': 'Dairy & Eggs',
    'en:creams': 'Dairy & Eggs',
    'en:sour-creams': 'Dairy & Eggs',
    'en:whipping-creams': 'Dairy & Eggs',
    'en:milk-powders': 'Dairy & Eggs',
    'en:evaporated-milks': 'Dairy & Eggs',
    'en:condensed-milks': 'Dairy & Eggs',

    // Fruits & Veg
    'en:fruits': 'Fruits & Veg',
    'en:fresh-fruits': 'Fruits & Veg',
    'en:dried-fruits': 'Fruits & Veg',
    'en:canned-fruits': 'Fruits & Veg',
    'en:frozen-fruits': 'Fruits & Veg',
    'en:fruits-based-foods': 'Fruits & Veg',
    'en:apples': 'Fruits & Veg',
    'en:citrus': 'Fruits & Veg',
    'en:oranges': 'Fruits & Veg',
    'en:lemons': 'Fruits & Veg',
    'en:bananas': 'Fruits & Veg',
    'en:tropical-fruits': 'Fruits & Veg',
    'en:berries': 'Fruits & Veg',
    'en:grapes': 'Fruits & Veg',
    'en:melons': 'Fruits & Veg',
    'en:vegetables': 'Fruits & Veg',
    'en:fresh-vegetables': 'Fruits & Veg',
    'en:frozen-vegetables': 'Fruits & Veg',
    'en:canned-vegetables': 'Fruits & Veg',
    'en:dried-vegetables': 'Fruits & Veg',
    'en:vegetables-based-foods': 'Fruits & Veg',
    'en:root-vegetables': 'Fruits & Veg',
    'en:leaf-vegetables': 'Fruits & Veg',
    'en:leafy-vegetables': 'Fruits & Veg',
    'en:potatoes': 'Fruits & Veg',
    'en:carrots': 'Fruits & Veg',
    'en:tomatoes': 'Fruits & Veg',
    'en:onions': 'Fruits & Veg',
    'en:cabbages': 'Fruits & Veg',
    'en:legumes': 'Fruits & Veg',
    'en:beans': 'Fruits & Veg',
    'en:lentils': 'Fruits & Veg',
    'en:chickpeas': 'Fruits & Veg',
    'en:peas': 'Fruits & Veg',
    'en:mushrooms': 'Fruits & Veg',
    'en:mushrooms-and-their-products': 'Fruits & Veg',
    'en:herbs': 'Fruits & Veg',
    'en:aromatic-plants': 'Fruits & Veg',
    'en:spice-plants': 'Fruits & Veg',
    'en:salads': 'Fruits & Veg',
    'en:nuts': 'Fruits & Veg',
    'en:seeds': 'Fruits & Veg',
    'en:plant-based-foods': 'Fruits & Veg',
    'en:tofu': 'Fruits & Veg',
    'en:soy-products': 'Fruits & Veg',

    // Meat & Fish
    'en:meats': 'Meat & Fish',
    'en:meats-and-their-products': 'Meat & Fish',
    'en:red-meats': 'Meat & Fish',
    'en:white-meats': 'Meat & Fish',
    'en:poultry': 'Meat & Fish',
    'en:chickens': 'Meat & Fish',
    'en:turkeys': 'Meat & Fish',
    'en:beef': 'Meat & Fish',
    'en:pork': 'Meat & Fish',
    'en:lamb': 'Meat & Fish',
    'en:lamb-meat': 'Meat & Fish',
    'en:veal': 'Meat & Fish',
    'en:veal-meat': 'Meat & Fish',
    'en:game-meats': 'Meat & Fish',
    'en:offals': 'Meat & Fish',
    'en:fishes': 'Meat & Fish',
    'en:fat-fishes': 'Meat & Fish',
    'en:lean-fishes': 'Meat & Fish',
    'en:salmons': 'Meat & Fish',
    'en:cods': 'Meat & Fish',
    'en:smoked-fish': 'Meat & Fish',
    'en:canned-fish': 'Meat & Fish',
    'en:canned-tunas': 'Meat & Fish',
    'en:salted-fish': 'Meat & Fish',
    'en:seafood': 'Meat & Fish',
    'en:crustaceans': 'Meat & Fish',
    'en:molluscs': 'Meat & Fish',
    'en:shrimps': 'Meat & Fish',
    'en:sausages': 'Meat & Fish',
    'en:delicatessen': 'Meat & Fish',
    'en:prepared-meats': 'Meat & Fish',
    'en:cold-cuts': 'Meat & Fish',
    'en:hams': 'Meat & Fish',
    'en:pates': 'Meat & Fish',
    'en:terrines': 'Meat & Fish',
    'en:meat-alternatives': 'Meat & Fish',

    // Drinks
    'en:beverages': 'Drinks',
    'en:non-alcoholic-beverages': 'Drinks',
    'en:alcoholic-beverages': 'Drinks',
    'en:waters': 'Drinks',
    'en:sparkling-waters': 'Drinks',
    'en:mineral-waters': 'Drinks',
    'en:spring-waters': 'Drinks',
    'en:flavored-waters': 'Drinks',
    'en:fruit-juices': 'Drinks',
    'en:vegetable-juices': 'Drinks',
    'en:nectars': 'Drinks',
    'en:fruit-nectars': 'Drinks',
    'en:sodas': 'Drinks',
    'en:soft-drinks': 'Drinks',
    'en:energy-drinks': 'Drinks',
    'en:sports-drinks': 'Drinks',
    'en:colas': 'Drinks',
    'en:lemonades': 'Drinks',
    'en:iced-teas': 'Drinks',
    'en:smoothies': 'Drinks',
    'en:coffees': 'Drinks',
    'en:instant-coffees': 'Drinks',
    'en:ground-coffees': 'Drinks',
    'en:teas': 'Drinks',
    'en:herbal-teas': 'Drinks',
    'en:infusions': 'Drinks',
    'en:green-teas': 'Drinks',
    'en:black-teas': 'Drinks',
    'en:hot-chocolates': 'Drinks',
    'en:cocoa-powders': 'Drinks',
    'en:beers': 'Drinks',
    'en:lagers': 'Drinks',
    'en:ales': 'Drinks',
    'en:wines': 'Drinks',
    'en:red-wines': 'Drinks',
    'en:white-wines': 'Drinks',
    'en:sparkling-wines': 'Drinks',
    'en:spirits': 'Drinks',
    'en:whiskeys': 'Drinks',
    'en:vodkas': 'Drinks',
    'en:gins': 'Drinks',
    'en:rums': 'Drinks',
    'en:liqueurs': 'Drinks',
    'en:brandys': 'Drinks',
    'en:eaux-de-vie': 'Drinks',
    'en:ciders': 'Drinks',
    'en:plant-based-beverages': 'Drinks',
    'en:soy-milks': 'Drinks',
    'en:oat-milks': 'Drinks',
    'en:almond-milks': 'Drinks',
    'en:rice-milks': 'Drinks',
    'en:coconut-milks': 'Drinks',

    // Bread & Grains
    'en:breads': 'Bread & Grains',
    'en:sliced-breads': 'Bread & Grains',
    'en:rye-breads': 'Bread & Grains',
    'en:rolls': 'Bread & Grains',
    'en:baked-goods': 'Bread & Grains',
    'en:bakery-products': 'Bread & Grains',
    'en:pastries': 'Bread & Grains',
    'en:croissants': 'Bread & Grains',
    'en:brioches': 'Bread & Grains',
    'en:pastas': 'Bread & Grains',
    'en:dry-pastas': 'Bread & Grains',
    'en:fresh-pastas': 'Bread & Grains',
    'en:stuffed-pastas': 'Bread & Grains',
    'en:durum-wheat-pasta': 'Bread & Grains',
    'en:noodles': 'Bread & Grains',
    'en:chinese-noodles': 'Bread & Grains',
    'en:rices': 'Bread & Grains',
    'en:basmati-rices': 'Bread & Grains',
    'en:cereals': 'Bread & Grains',
    'en:cereals-and-their-products': 'Bread & Grains',
    'en:cereal-grains': 'Bread & Grains',
    'en:breakfast-cereals': 'Bread & Grains',
    'en:mueslis': 'Bread & Grains',
    'en:porridge': 'Bread & Grains',
    'en:oats': 'Bread & Grains',
    'en:flours': 'Bread & Grains',
    'en:wheat-flours': 'Bread & Grains',
    'en:starches': 'Bread & Grains',
    'en:tortillas': 'Bread & Grains',
    'en:wraps': 'Bread & Grains',
    'en:crackers': 'Bread & Grains',
    'en:crispbreads': 'Bread & Grains',
    'en:pizza-doughs': 'Bread & Grains',
    'en:grains': 'Bread & Grains',
    'en:quinoa': 'Bread & Grains',
    'en:couscous': 'Bread & Grains',
    'en:bulgur': 'Bread & Grains',

    // Snacks & Sweets
    'en:snacks': 'Snacks & Sweets',
    'en:chocolates': 'Snacks & Sweets',
    'en:chocolate-confectioneries': 'Snacks & Sweets',
    'en:dark-chocolates': 'Snacks & Sweets',
    'en:milk-chocolates': 'Snacks & Sweets',
    'en:white-chocolates': 'Snacks & Sweets',
    'en:biscuits-and-cakes': 'Snacks & Sweets',
    'en:biscuits': 'Snacks & Sweets',
    'en:cakes': 'Snacks & Sweets',
    'en:chips-and-crisps': 'Snacks & Sweets',
    'en:salty-snacks': 'Snacks & Sweets',
    'en:sweet-snacks': 'Snacks & Sweets',
    'en:candies': 'Snacks & Sweets',
    'en:confectioneries': 'Snacks & Sweets',
    'en:gummi-candies': 'Snacks & Sweets',
    'en:ice-creams': 'Snacks & Sweets',
    'en:frozen-desserts': 'Snacks & Sweets',
    'en:desserts': 'Snacks & Sweets',
    'en:muesli-bars': 'Snacks & Sweets',
    'en:cereal-bars': 'Snacks & Sweets',
    'en:bars': 'Snacks & Sweets',
    'en:popcorn': 'Snacks & Sweets',
    'en:pretzels': 'Snacks & Sweets',
    'en:wafers': 'Snacks & Sweets',
    'en:chocolate-spreads': 'Snacks & Sweets',
    'en:puffed-salty-snacks': 'Snacks & Sweets',
    'en:appetizers': 'Snacks & Sweets',

    // Frozen
    'en:frozen-foods': 'Frozen',
    'en:frozen-meals': 'Frozen',
    'en:frozen-pizzas': 'Frozen',
    'en:frozen-meat-products': 'Frozen',
    'en:frozen-fish-products': 'Frozen',
    'en:frozen-vegetables': 'Frozen',
    'en:frozen-fruits': 'Frozen',
    'en:frozen-potatoes': 'Frozen',
    'en:frozen-snacks': 'Frozen',
    'en:frozen-baked-goods': 'Frozen',
    'en:frozen-herbs': 'Frozen',

    // Ready Meals
    'en:meals': 'Ready Meals',
    'en:prepared-meals': 'Ready Meals',
    'en:prepared-foods': 'Ready Meals',
    'en:soups': 'Ready Meals',
    'en:canned-soups': 'Ready Meals',
    'en:vegetable-soups': 'Ready Meals',
    'en:pizzas': 'Ready Meals',
    'en:sandwiches': 'Ready Meals',
    'en:hamburgers': 'Ready Meals',
    'en:salads-and-salad-preparations': 'Ready Meals',
    'en:prepared-salads': 'Ready Meals',
    'en:pasta-sauces': 'Ready Meals',
    'en:tomato-sauces': 'Ready Meals',
    'en:meal-sauces': 'Ready Meals',
    'en:instant-noodles': 'Ready Meals',
    'en:pot-noodles': 'Ready Meals',
    'en:stews': 'Ready Meals',
    'en:dips': 'Ready Meals',
    'en:hummus': 'Ready Meals',
    'en:pasta-dishes': 'Ready Meals',
    'en:rice-dishes': 'Ready Meals',

    // Condiments
    'en:sauces': 'Condiments',
    'en:condiments': 'Condiments',
    'en:dressings': 'Condiments',
    'en:vinaigrettes': 'Condiments',
    'en:mayonnaises': 'Condiments',
    'en:ketchups': 'Condiments',
    'en:mustards': 'Condiments',
    'en:hot-sauces': 'Condiments',
    'en:barbecue-sauces': 'Condiments',
    'en:soy-sauces': 'Condiments',
    'en:oils': 'Condiments',
    'en:olive-oils': 'Condiments',
    'en:extra-virgin-olive-oils': 'Condiments',
    'en:sunflower-oils': 'Condiments',
    'en:rapeseed-oils': 'Condiments',
    'en:coconut-oils': 'Condiments',
    'en:vinegars': 'Condiments',
    'en:balsamic-vinegars': 'Condiments',
    'en:wine-vinegars': 'Condiments',
    'en:jams': 'Condiments',
    'en:marmalades': 'Condiments',
    'en:honeys': 'Condiments',
    'en:spices': 'Condiments',
    'en:salt': 'Condiments',
    'en:peppers': 'Condiments',
    'en:sugars': 'Condiments',
    'en:sweeteners': 'Condiments',
    'en:syrups': 'Condiments',
    'en:spreads': 'Condiments',
    'en:canned-foods': 'Condiments',
    'en:bouillons': 'Condiments',
    'en:broths': 'Condiments',
    'en:cooking-helpers': 'Condiments',
    'en:baking-aids': 'Condiments',
    'en:pickles': 'Condiments',
    'en:olives': 'Condiments',
    'en:gherkins': 'Condiments',
    'en:fermented-foods': 'Condiments',

    // Baby Food
    'en:baby-foods': 'Baby Food',
    'en:infant-formulas': 'Baby Food',
    'en:baby-cereals': 'Baby Food',
    'en:baby-drinks': 'Baby Food',
    'en:baby-snacks': 'Baby Food',
}

// ── Keyword rules (German + English) ─────────────────────────────────────────
const KEYWORD_RULES = [
    {
        category: 'Dairy & Eggs',
        keywords: ['milch', 'milk', 'käse', 'cheese', 'joghurt', 'yogurt', 'yoghurt',
            'butter', 'sahne', 'cream', 'quark', 'ei', 'egg', 'kefir', 'skyr',
            'mozzarella', 'gouda', 'cheddar', 'brie', 'camembert', 'fromage',
            'frischkäse', 'schlagsahne', 'kondensmilch', 'buttermilch',
            'philadelphia', 'beurre'],
    },
    {
        category: 'Fruits & Veg',
        keywords: ['apfel', 'apple', 'banane', 'banana', 'tomate', 'tomato', 'salat',
            'lettuce', 'karotte', 'carrot', 'obst', 'gemüse', 'fruit', 'vegetable',
            'zwiebel', 'onion', 'knoblauch', 'garlic', 'gurke', 'cucumber',
            'paprika', 'pepper', 'spinat', 'spinach', 'brokkoli', 'broccoli',
            'blumenkohl', 'cauliflower', 'erbsen', 'peas', 'bohnen', 'beans',
            'linsen', 'lentils', 'pilze', 'mushroom', 'nuss', 'nuts', 'mandel',
            'almond', 'erdnuss', 'peanut', 'zitrone', 'lemon', 'orange', 'beere',
            'berry', 'erdbeere', 'strawberry', 'heidelbeere', 'blueberry',
            'walnuss', 'walnusskern', 'nussmix', 'cashew', 'haselnuss', 'pistazie'],
    },
    {
        category: 'Meat & Fish',
        keywords: ['fleisch', 'meat', 'wurst', 'sausage', 'fisch', 'fish', 'lachs',
            'salmon', 'huhn', 'chicken', 'hähnchen', 'hack', 'rind', 'beef',
            'schwein', 'pork', 'lamm', 'lamb', 'schinken', 'ham', 'speck', 'bacon',
            'thunfisch', 'tuna', 'garnele', 'shrimp', 'salami', 'leberwurst',
            'bratwurst', 'schnitzel', 'filet', 'steak', 'sardine', 'sardinen'],
    },
    {
        category: 'Drinks',
        keywords: ['wasser', 'water', 'saft', 'juice', 'kaffee', 'coffee', 'tee', 'tea',
            'bier', 'beer', 'wein', 'wine', 'limonade', 'cola', 'fanta', 'sprite',
            'getränk', 'drink', 'soda', 'smoothie', 'milchshake', 'kakao',
            'protein shake', 'energy drink', 'sprudel', 'mineralwasser',
            'nesquik'],
    },
    {
        category: 'Bread & Grains',
        keywords: ['brot', 'bread', 'pasta', 'nudel', 'reis', 'rice', 'mehl', 'flour',
            'müsli', 'muesli', 'cereal', 'haferflocken', 'oat', 'brötchen', 'roll',
            'toast', 'knäckebrot', 'cracker', 'quinoa', 'couscous', 'bulgur',
            'polenta', 'tortilla', 'fladen', 'vollkorn', 'weizen', 'wheat',
            'roggen', 'rye', 'dinkel', 'spelt', 'weetabix', 'cornflakes'],
    },
    {
        category: 'Snacks & Sweets',
        keywords: ['schokolade', 'chocolate', 'keks', 'cookie', 'chips', 'snack',
            'riegel', 'bar', 'gummi', 'bonbon', 'candy', 'eis', 'ice cream',
            'kuchen', 'cake', 'torte', 'muffin', 'brownie', 'praline', 'popcorn',
            'waffel', 'waffle', 'nutella',
            'süßigkeit', 'sweet', 'haribo',
            'snickers', 'twix', 'bounty', 'kitkat', 'mars',
            'edelbitter', 'biscuit', 'chocolat', 'croquant', 'cacao'],
    },
    {
        category: 'Frozen',
        keywords: ['tiefkühl', 'frozen', 'gefroren', 'tk-', 'tk '],
    },
    {
        category: 'Ready Meals',
        keywords: ['fertiggericht', 'ready meal', 'ready to eat', 'pizza', 'suppe',
            'soup', 'eintopf', 'stew', 'lasagne', 'lasagna', 'döner', 'wrap',
            'burger', 'sandwich', 'sushi'],
    },
    {
        category: 'Condiments',
        keywords: ['öl', 'oil', 'essig', 'vinegar', 'sauce', 'soße', 'gewürz', 'spice',
            'salz', 'salt', 'zucker', 'sugar', 'senf', 'mustard', 'ketchup',
            'mayonnaise', 'mayo', 'marmelade', 'jam', 'honig', 'honey', 'sirup',
            'syrup', 'pesto', 'brühe', 'bouillon', 'würze', 'dressing',
            'moutarde', 'confiture', 'konfitüre'],
    },
    {
        category: 'Baby Food',
        keywords: ['baby', 'säugling', 'kleinkind', 'hipp', 'aptamil', 'humana',
            'bebivita', 'beikost', 'breifrei', 'karicare'],
    },
]

// ── Category priority (lower = wins) ──────────────────────────────────────────
// When a product matches multiple categories (e.g. milk → Dairy + Drinks),
// the category with the lowest priority number wins.
const CATEGORY_PRIORITY = {
    'Baby Food': 0,
    'Dairy & Eggs': 1,
    'Meat & Fish': 2,
    'Fruits & Veg': 3,
    'Frozen': 4,
    'Bread & Grains': 5,
    'Ready Meals': 6,
    'Condiments': 7,
    'Snacks & Sweets': 8,
    'Drinks': 9,
    'Other': 99,
}

// ── OFF taxonomy → subcategory (comprehensive, sourced from OFF categories) ──
// Tags ordered general → specific per subcategory.
// classifyProduct() picks the LAST match, so specific tags override generic ones.
const OFF_SUBCATEGORY_MAP = {
    // ── Dairy & Eggs ─────────────────────────────────────────────────────────
    // Milch
    'en:milks': 'Milch',
    'en:milks-and-their-substitutes': 'Milch',
    'en:whole-milks': 'Milch',
    'en:semi-skimmed-milks': 'Milch',
    'en:skimmed-milks': 'Milch',
    'en:fresh-milks': 'Milch',
    'en:buttermilks': 'Milch',
    'en:flavoured-milks': 'Milch',
    'en:chocolate-milks': 'Milch',
    'en:milk-powders': 'Milch',
    'en:evaporated-milks': 'Milch',
    'en:condensed-milks': 'Milch',
    'en:lactose-free-milks': 'Milch',
    'en:microfiltered-milks': 'Milch',
    // Joghurt
    'en:yogurts': 'Joghurt',
    'en:fruit-yogurts': 'Joghurt',
    'en:plain-yogurts': 'Joghurt',
    'en:drinking-yogurts': 'Joghurt',
    'en:greek-yogurts': 'Joghurt',
    'en:fruit-bifidus-yogurts': 'Joghurt',
    'en:raspberry-yogurts': 'Joghurt',
    'en:skyrs': 'Joghurt',
    // Quark
    'en:quark': 'Quark',
    'en:quarks': 'Quark',
    'en:fromage-frais': 'Quark',
    'en:fromages-blancs-petit-suisses-and-skyr': 'Quark',
    'en:lean-quark': 'Quark',
    // Milchdesserts
    'en:dairy-desserts': 'Milchdesserts',
    'en:fermented-dairy-desserts': 'Milchdesserts',
    'en:rice-puddings': 'Milchdesserts',
    'en:chocolate-mousse': 'Milchdesserts',
    // Fermentierte Milch
    'en:fermented-milk-products': 'Fermentierte Milch',
    'en:kefirs': 'Fermentierte Milch',
    // Käse — Schnitt- & Hartkäse (generic fallback for cheese)
    'en:cheeses': 'Käse — Schnitt- & Hartkäse',
    'en:hard-cheeses': 'Käse — Schnitt- & Hartkäse',
    'en:half-cooked-pressed-cheeses': 'Käse — Schnitt- & Hartkäse',
    'en:uncooked-pressed-cheeses': 'Käse — Schnitt- & Hartkäse',
    'en:cow-cheeses': 'Käse — Schnitt- & Hartkäse',
    'en:german-cheeses': 'Käse — Schnitt- & Hartkäse',
    'en:emmental-slices': 'Käse — Schnitt- & Hartkäse',
    // Käse — Weichkäse
    'en:soft-cheeses': 'Käse — Weichkäse',
    // Käse — Frischkäse & Aufstrich
    'en:fresh-cheeses': 'Käse — Frischkäse & Aufstrich',
    'en:cream-cheeses': 'Käse — Frischkäse & Aufstrich',
    'en:cheese-spreads': 'Käse — Frischkäse & Aufstrich',
    'en:spreadable-goat-cheese': 'Käse — Frischkäse & Aufstrich',
    // Käse — Italienisch
    'en:italian-cheeses': 'Käse — Italienisch',
    'en:provolone': 'Käse — Italienisch',
    'en:scamorza': 'Käse — Italienisch',
    'en:tomino': 'Käse — Italienisch',
    // Käse — Sonstiges
    'en:blue-cheeses': 'Käse — Sonstiges',
    'en:blue-veined-cheeses': 'Käse — Sonstiges',
    'en:processed-cheeses': 'Käse — Sonstiges',
    'en:goat-cheeses': 'Käse — Sonstiges',
    'en:sheep-cheeses': 'Käse — Sonstiges',
    'en:brined-cheeses': 'Käse — Sonstiges',
    'en:feta-type-cheese': 'Käse — Sonstiges',
    'en:grated-cheese': 'Käse — Sonstiges',
    'en:grilling-cheeses': 'Käse — Sonstiges',
    'en:balkan-cheese': 'Käse — Sonstiges',
    'en:cubed-appetizer-cheese': 'Käse — Sonstiges',
    // Butter & Margarine
    'en:butters': 'Butter & Margarine',
    'en:salted-butters': 'Butter & Margarine',
    'en:unsalted-butters': 'Butter & Margarine',
    'en:margarines': 'Butter & Margarine',
    'en:dairy-spreads': 'Butter & Margarine',
    // Sahne & Crème
    'en:creams': 'Sahne & Crème',
    'en:sour-creams': 'Sahne & Crème',
    'en:whipping-creams': 'Sahne & Crème',
    // Eier
    'en:eggs': 'Eier',
    'en:egg-products': 'Eier',

    // ── Fruits & Veg ─────────────────────────────────────────────────────────
    // Frisches Obst — Kernobst
    'en:apples': 'Frisches Obst — Kernobst',
    'en:fresh-apples': 'Frisches Obst — Kernobst',
    'en:pears': 'Frisches Obst — Kernobst',
    // Frisches Obst — Zitrusfrüchte
    'en:citrus': 'Frisches Obst — Zitrusfrüchte',
    'en:oranges': 'Frisches Obst — Zitrusfrüchte',
    'en:fresh-oranges': 'Frisches Obst — Zitrusfrüchte',
    'en:lemons': 'Frisches Obst — Zitrusfrüchte',
    'en:limes': 'Frisches Obst — Zitrusfrüchte',
    'en:mandarins': 'Frisches Obst — Zitrusfrüchte',
    'en:grapefruits': 'Frisches Obst — Zitrusfrüchte',
    'en:pomelos': 'Frisches Obst — Zitrusfrüchte',
    // Frisches Obst — Bananen & Tropisch
    'en:bananas': 'Frisches Obst — Bananen & Tropisch',
    'en:tropical-fruits': 'Frisches Obst — Bananen & Tropisch',
    'en:mangoes': 'Frisches Obst — Bananen & Tropisch',
    'en:pineapples': 'Frisches Obst — Bananen & Tropisch',
    'en:papayas': 'Frisches Obst — Bananen & Tropisch',
    'en:coconuts': 'Frisches Obst — Bananen & Tropisch',
    'en:passion-fruits': 'Frisches Obst — Bananen & Tropisch',
    'en:litchis': 'Frisches Obst — Bananen & Tropisch',
    'en:avocados': 'Frisches Obst — Bananen & Tropisch',
    'en:pitayas': 'Frisches Obst — Bananen & Tropisch',
    'en:guavas': 'Frisches Obst — Bananen & Tropisch',
    // Frisches Obst — Beeren
    'en:berries': 'Frisches Obst — Beeren',
    'en:strawberries': 'Frisches Obst — Beeren',
    'en:raspberries': 'Frisches Obst — Beeren',
    'en:blueberries': 'Frisches Obst — Beeren',
    'en:blackberries': 'Frisches Obst — Beeren',
    'en:cranberries': 'Frisches Obst — Beeren',
    'en:redcurrants': 'Frisches Obst — Beeren',
    'en:blackcurrants': 'Frisches Obst — Beeren',
    'en:gooseberries': 'Frisches Obst — Beeren',
    'en:fresh-redcurrants': 'Frisches Obst — Beeren',
    // Frisches Obst — Steinobst
    'en:peaches': 'Frisches Obst — Steinobst',
    'en:cherries': 'Frisches Obst — Steinobst',
    'en:plums': 'Frisches Obst — Steinobst',
    'en:apricots': 'Frisches Obst — Steinobst',
    'en:nectarines': 'Frisches Obst — Steinobst',
    // Frisches Obst — Trauben & Melonen
    'en:grapes': 'Frisches Obst — Trauben & Melonen',
    'en:melons': 'Frisches Obst — Trauben & Melonen',
    'en:watermelons': 'Frisches Obst — Trauben & Melonen',
    'en:muskmelons': 'Frisches Obst — Trauben & Melonen',
    'en:cantaloupe-melons': 'Frisches Obst — Trauben & Melonen',
    // Frisches Obst — Sonstiges (generic fruit fallback)
    'en:fruits': 'Frisches Obst — Sonstiges',
    'en:fresh-fruits': 'Frisches Obst — Sonstiges',
    'en:fresh-pomegranates': 'Frisches Obst — Sonstiges',
    'en:dates': 'Frisches Obst — Sonstiges',
    // Obstkonserven
    'en:canned-fruits': 'Obstkonserven',
    'en:fruits-in-syrup': 'Obstkonserven',
    'en:compotes': 'Obstkonserven',
    // Trockenfrüchte
    'en:dried-fruits': 'Trockenfrüchte',
    'en:raisins': 'Trockenfrüchte',
    'en:prunes': 'Trockenfrüchte',
    'en:whole-dates': 'Trockenfrüchte',
    'en:dried-mulberries': 'Trockenfrüchte',
    // Gemüse — Wurzelgemüse
    'en:root-vegetables': 'Gemüse — Wurzelgemüse',
    'en:carrots': 'Gemüse — Wurzelgemüse',
    'en:potatoes': 'Gemüse — Wurzelgemüse',
    'en:beets': 'Gemüse — Wurzelgemüse',
    'en:parsnip': 'Gemüse — Wurzelgemüse',
    'en:turnips': 'Gemüse — Wurzelgemüse',
    'en:radishes': 'Gemüse — Wurzelgemüse',
    'en:sweet-potatoes': 'Gemüse — Wurzelgemüse',
    // Gemüse — Zwiebeln & Knoblauch
    'en:onions': 'Gemüse — Zwiebeln & Knoblauch',
    'en:onions-and-their-products': 'Gemüse — Zwiebeln & Knoblauch',
    'en:fresh-onions': 'Gemüse — Zwiebeln & Knoblauch',
    'en:garlic': 'Gemüse — Zwiebeln & Knoblauch',
    'en:shallots': 'Gemüse — Zwiebeln & Knoblauch',
    'en:leeks': 'Gemüse — Zwiebeln & Knoblauch',
    // Gemüse — Tomaten & Paprika
    'en:tomatoes': 'Gemüse — Tomaten & Paprika',
    'en:sweet-peppers': 'Gemüse — Tomaten & Paprika',
    'en:chili-peppers': 'Gemüse — Tomaten & Paprika',
    'en:aubergines': 'Gemüse — Tomaten & Paprika',
    // Gemüse — Kürbis & Gurke
    'en:cucumbers': 'Gemüse — Kürbis & Gurke',
    'en:squashes': 'Gemüse — Kürbis & Gurke',
    // Gemüse — Kohl
    'en:cabbages': 'Gemüse — Kohl',
    'en:broccoli': 'Gemüse — Kohl',
    'en:cauliflower': 'Gemüse — Kohl',
    'en:kohlrabi': 'Gemüse — Kohl',
    'en:curly-kale': 'Gemüse — Kohl',
    'en:red-cabbage': 'Gemüse — Kohl',
    'en:white-cabbage': 'Gemüse — Kohl',
    'en:bok-choy': 'Gemüse — Kohl',
    // Gemüse — Blattsalate & Grün
    'en:leafy-vegetables': 'Gemüse — Blattsalate & Grün',
    'en:leaf-vegetables': 'Gemüse — Blattsalate & Grün',
    'en:salads': 'Gemüse — Blattsalate & Grün',
    'en:spinach': 'Gemüse — Blattsalate & Grün',
    // Gemüse — Stängel & Stiele
    'en:asparagus': 'Gemüse — Stängel & Stiele',
    'en:celery': 'Gemüse — Stängel & Stiele',
    'en:celery-stalk': 'Gemüse — Stängel & Stiele',
    'en:fennel': 'Gemüse — Stängel & Stiele',
    'en:rhubarb': 'Gemüse — Stängel & Stiele',
    'en:artichokes': 'Gemüse — Stängel & Stiele',
    // Gemüse — Hülsenfrüchte & Mais
    'en:peas': 'Gemüse — Hülsenfrüchte & Mais',
    'en:green-peas': 'Gemüse — Hülsenfrüchte & Mais',
    'en:green-beans': 'Gemüse — Hülsenfrüchte & Mais',
    'en:corn': 'Gemüse — Hülsenfrüchte & Mais',
    // Gemüse — Sonstiges (generic vegetable fallback)
    'en:vegetables': 'Gemüse — Sonstiges',
    'en:fresh-vegetables': 'Gemüse — Sonstiges',
    // Pilze
    'en:mushrooms': 'Pilze',
    'en:fresh-mushrooms': 'Pilze',
    'en:dried-mushrooms': 'Pilze',
    // Hülsenfrüchte (trocken & Dose)
    'en:legumes': 'Hülsenfrüchte (trocken & Dose)',
    'en:beans': 'Hülsenfrüchte (trocken & Dose)',
    'en:lentils': 'Hülsenfrüchte (trocken & Dose)',
    'en:chickpeas': 'Hülsenfrüchte (trocken & Dose)',
    'en:canned-legumes': 'Hülsenfrüchte (trocken & Dose)',
    'en:broad-beans': 'Hülsenfrüchte (trocken & Dose)',
    'en:edamame': 'Hülsenfrüchte (trocken & Dose)',
    // Gemüsekonserven & Glas
    'en:canned-vegetables': 'Gemüsekonserven & Glas',
    'en:pickled-vegetables': 'Gemüsekonserven & Glas',
    // Frische Kräuter
    'en:herbs': 'Frische Kräuter',
    'en:aromatic-plants': 'Frische Kräuter',
    'en:basil': 'Frische Kräuter',
    'en:lemon-grass': 'Frische Kräuter',
    'en:coriander-leaves': 'Frische Kräuter',
    // Nüsse & Kerne
    'en:nuts': 'Nüsse & Kerne',
    'en:seeds': 'Nüsse & Kerne',
    'en:almonds': 'Nüsse & Kerne',
    'en:walnuts': 'Nüsse & Kerne',
    'en:hazelnuts': 'Nüsse & Kerne',
    'en:cashews': 'Nüsse & Kerne',
    'en:pistachios': 'Nüsse & Kerne',
    'en:peanuts': 'Nüsse & Kerne',
    'en:sunflower-seeds': 'Nüsse & Kerne',
    'en:pumpkin-seeds': 'Nüsse & Kerne',
    'en:chia-seeds': 'Nüsse & Kerne',
    'en:flax-seeds': 'Nüsse & Kerne',
    'en:sesame-seeds': 'Nüsse & Kerne',
    'en:pine-nuts': 'Nüsse & Kerne',
    'en:mixed-nuts': 'Nüsse & Kerne',
    'en:brazil-nuts': 'Nüsse & Kerne',
    'en:macadamia-nuts': 'Nüsse & Kerne',
    'en:pecans': 'Nüsse & Kerne',
    'en:tiger-nuts': 'Nüsse & Kerne',
    // Tofu & Soja
    'en:tofu': 'Tofu & Soja',
    'en:soy-products': 'Tofu & Soja',
    'en:tempeh': 'Tofu & Soja',

    // ── Meat & Fish ──────────────────────────────────────────────────────────
    // Geflügel
    'en:poultry': 'Geflügel',
    'en:white-meats': 'Geflügel',
    'en:chickens': 'Geflügel',
    'en:turkeys': 'Geflügel',
    'en:cooked-turkey-breast-slices': 'Geflügel',
    // Rindfleisch
    'en:red-meats': 'Rindfleisch',
    'en:beef': 'Rindfleisch',
    'en:beef-steaks': 'Rindfleisch',
    'en:ground-beef-steaks': 'Rindfleisch',
    'en:beef-stew-meat': 'Rindfleisch',
    'en:beef-shoulder': 'Rindfleisch',
    'en:beef-chuck': 'Rindfleisch',
    // Schweinefleisch
    'en:pork': 'Schweinefleisch',
    // Lamm
    'en:lamb': 'Lamm',
    'en:lamb-meat': 'Lamm',
    // Kalb & Wild
    'en:veal': 'Kalb & Wild',
    'en:veal-meat': 'Kalb & Wild',
    'en:game-meats': 'Kalb & Wild',
    // Wurst & Würstchen
    'en:sausages': 'Wurst & Würstchen',
    'en:frankfurters': 'Wurst & Würstchen',
    // Aufschnitt & Wurstwaren
    'en:cold-cuts': 'Aufschnitt & Wurstwaren',
    'en:hams': 'Aufschnitt & Wurstwaren',
    'en:delicatessen': 'Aufschnitt & Wurstwaren',
    'en:prepared-meats': 'Aufschnitt & Wurstwaren',
    'en:cured-meats': 'Aufschnitt & Wurstwaren',
    'en:pork-and-beef-mortadella': 'Aufschnitt & Wurstwaren',
    'en:bacon': 'Aufschnitt & Wurstwaren',
    'en:pates': 'Aufschnitt & Wurstwaren',
    'en:terrines': 'Aufschnitt & Wurstwaren',
    'en:pepperoni': 'Aufschnitt & Wurstwaren',
    // Frischer Fisch
    'en:fishes': 'Frischer Fisch',
    'en:fat-fishes': 'Frischer Fisch',
    'en:lean-fishes': 'Frischer Fisch',
    'en:salmons': 'Frischer Fisch',
    'en:cods': 'Frischer Fisch',
    'en:hake': 'Frischer Fisch',
    'en:atlantic-bass': 'Frischer Fisch',
    'en:pollack': 'Frischer Fisch',
    // Meeresfrüchte
    'en:seafood': 'Meeresfrüchte',
    'en:crustaceans': 'Meeresfrüchte',
    'en:molluscs': 'Meeresfrüchte',
    'en:shrimps': 'Meeresfrüchte',
    'en:jumbo-shrimps': 'Meeresfrüchte',
    // Fisch aus der Dose / geräuchert
    'en:smoked-fish': 'Fisch aus der Dose / geräuchert',
    'en:canned-fish': 'Fisch aus der Dose / geräuchert',
    'en:canned-tunas': 'Fisch aus der Dose / geräuchert',
    'en:tunas-in-oil': 'Fisch aus der Dose / geräuchert',
    'en:smoked-salmons': 'Fisch aus der Dose / geräuchert',
    'en:salted-fish': 'Fisch aus der Dose / geräuchert',
    'en:sardine-rillettes': 'Fisch aus der Dose / geräuchert',
    // Vegane Fleischalternativen
    'en:meat-alternatives': 'Vegane Fleischalternativen',

    // ── Drinks ───────────────────────────────────────────────────────────────
    // Wasser
    'en:waters': 'Wasser',
    'en:sparkling-waters': 'Wasser',
    'en:mineral-waters': 'Wasser',
    'en:spring-waters': 'Wasser',
    'en:flavored-waters': 'Wasser',
    'en:mountain-waters': 'Wasser',
    // Saft
    'en:fruit-juices': 'Saft',
    'en:vegetable-juices': 'Saft',
    'en:nectars': 'Saft',
    'en:fruit-nectars': 'Saft',
    // Schorle & Limonaden
    'en:sodas': 'Schorle & Limonaden',
    'en:soft-drinks': 'Schorle & Limonaden',
    'en:colas': 'Schorle & Limonaden',
    'en:lemonades': 'Schorle & Limonaden',
    'en:iced-teas': 'Schorle & Limonaden',
    // Smoothies
    'en:smoothies': 'Smoothies',
    // Kaffee
    'en:coffees': 'Kaffee',
    'en:instant-coffees': 'Kaffee',
    'en:ground-coffees': 'Kaffee',
    // Tee
    'en:teas': 'Tee',
    'en:herbal-teas': 'Tee',
    'en:infusions': 'Tee',
    'en:green-teas': 'Tee',
    'en:black-teas': 'Tee',
    'en:rooibos': 'Tee',
    // Kakao & Heißgetränke
    'en:hot-chocolates': 'Kakao & Heißgetränke',
    'en:cocoa-powders': 'Kakao & Heißgetränke',
    'en:drinking-chocolates': 'Kakao & Heißgetränke',
    // Pflanzenmilch
    'en:plant-based-beverages': 'Pflanzenmilch',
    'en:soy-milks': 'Pflanzenmilch',
    'en:oat-milks': 'Pflanzenmilch',
    'en:almond-milks': 'Pflanzenmilch',
    'en:rice-milks': 'Pflanzenmilch',
    'en:coconut-milks': 'Pflanzenmilch',
    // Bier
    'en:beers': 'Bier',
    'en:lagers': 'Bier',
    'en:ales': 'Bier',
    'en:wheat-beers': 'Bier',
    'en:non-alcoholic-beers': 'Bier',
    'en:stouts': 'Bier',
    'en:irish-red-ales': 'Bier',
    'en:corsican-beers': 'Bier',
    // Wein & Sekt
    'en:wines': 'Wein & Sekt',
    'en:red-wines': 'Wein & Sekt',
    'en:white-wines': 'Wein & Sekt',
    'en:rose-wines': 'Wein & Sekt',
    'en:sparkling-wines': 'Wein & Sekt',
    'en:ciders': 'Wein & Sekt',
    // Spirituosen
    'en:spirits': 'Spirituosen',
    'en:whiskeys': 'Spirituosen',
    'en:vodkas': 'Spirituosen',
    'en:gins': 'Spirituosen',
    'en:rums': 'Spirituosen',
    'en:liqueurs': 'Spirituosen',
    'en:brandys': 'Spirituosen',
    'en:eaux-de-vie': 'Spirituosen',
    // Sonstige Getränke
    'en:energy-drinks': 'Sonstige Getränke',
    'en:sports-drinks': 'Sonstige Getränke',

    // ── Bread & Grains ───────────────────────────────────────────────────────
    // Brot
    'en:breads': 'Brot',
    'en:sliced-breads': 'Brot',
    'en:rye-breads': 'Brot',
    'en:white-breads': 'Brot',
    'en:country-style-french-baguette-bread': 'Brot',
    // Brötchen & Kleingebäck
    'en:rolls': 'Brötchen & Kleingebäck',
    'en:bagels': 'Brötchen & Kleingebäck',
    // Fladenbrot, Wraps & Spezialbrote
    'en:tortillas': 'Fladenbrot, Wraps & Spezialbrote',
    'en:wraps': 'Fladenbrot, Wraps & Spezialbrote',
    'en:pizza-doughs': 'Fladenbrot, Wraps & Spezialbrote',
    // Feingebäck & Blätterteig
    'en:pastries': 'Feingebäck & Blätterteig',
    'en:croissants': 'Feingebäck & Blätterteig',
    'en:brioches': 'Feingebäck & Blätterteig',
    'en:puff-pastry': 'Feingebäck & Blätterteig',
    'en:pie-dough': 'Feingebäck & Blätterteig',
    // Nudeln
    'en:pastas': 'Nudeln',
    'en:dry-pastas': 'Nudeln',
    'en:fresh-pastas': 'Nudeln',
    'en:durum-wheat-pasta': 'Nudeln',
    'en:dry-durum-wheat-pasta': 'Nudeln',
    'en:stuffed-pastas': 'Nudeln',
    'en:ravioli': 'Nudeln',
    'en:italian-pasta': 'Nudeln',
    // Asiatische Nudeln
    'en:noodles': 'Asiatische Nudeln',
    'en:chinese-noodles': 'Asiatische Nudeln',
    'en:rice-noodles': 'Asiatische Nudeln',
    // Reis
    'en:rices': 'Reis',
    'en:basmati-rices': 'Reis',
    'en:white-basmati-rices': 'Reis',
    'en:long-grain-rices': 'Reis',
    'en:brown-rices': 'Reis',
    'en:white-rices': 'Reis',
    // Andere Getreide
    'en:grains': 'Andere Getreide',
    'en:cereal-grains': 'Andere Getreide',
    'en:quinoa': 'Andere Getreide',
    'en:couscous': 'Andere Getreide',
    'en:bulgur': 'Andere Getreide',
    'en:polenta': 'Andere Getreide',
    'en:millet': 'Andere Getreide',
    'en:buckwheat': 'Andere Getreide',
    'en:oat': 'Andere Getreide',
    'en:spelts': 'Andere Getreide',
    // Frühstückscerealien
    'en:breakfast-cereals': 'Frühstückscerealien',
    'en:cereals': 'Frühstückscerealien',
    'en:oats': 'Frühstückscerealien',
    'en:mueslis': 'Frühstückscerealien',
    'en:bircher-style-mueslis': 'Frühstückscerealien',
    'en:crunchy-mueslis': 'Frühstückscerealien',
    'en:porridge': 'Frühstückscerealien',
    // Mehl
    'en:flours': 'Mehl',
    'en:wheat-flours': 'Mehl',
    'en:rye-flours': 'Mehl',
    'en:spelt-flours': 'Mehl',
    'en:starches': 'Mehl',
    'en:potato-starches': 'Mehl',
    // Cracker & Knäckebrot
    'en:crackers': 'Cracker & Knäckebrot',
    'en:crispbreads': 'Cracker & Knäckebrot',
    'en:puffed-cereal-cakes': 'Cracker & Knäckebrot',

    // ── Snacks & Sweets ──────────────────────────────────────────────────────
    // Schokolade
    'en:chocolates': 'Schokolade',
    'en:chocolate-confectioneries': 'Schokolade',
    'en:dark-chocolates': 'Schokolade',
    'en:milk-chocolates': 'Schokolade',
    'en:white-chocolates': 'Schokolade',
    'en:dark-chocolate-bar': 'Schokolade',
    'en:chocolate-truffles': 'Schokolade',
    'en:filled-chocolates': 'Schokolade',
    // Süßigkeiten
    'en:candies': 'Süßigkeiten',
    'en:confectioneries': 'Süßigkeiten',
    'en:gummi-candies': 'Süßigkeiten',
    'en:marshmallows': 'Süßigkeiten',
    'en:calissons': 'Süßigkeiten',
    // Salzige Snacks
    'en:chips-and-crisps': 'Salzige Snacks',
    'en:salty-snacks': 'Salzige Snacks',
    'en:pretzels': 'Salzige Snacks',
    'en:popcorn': 'Salzige Snacks',
    'en:puffed-salty-snacks': 'Salzige Snacks',
    'en:appetizers': 'Salzige Snacks',
    'en:panzerotti': 'Salzige Snacks',
    // Kekse & Gebäck
    'en:biscuits': 'Kekse & Gebäck',
    'en:biscuits-and-cakes': 'Kekse & Gebäck',
    'en:wafers': 'Kekse & Gebäck',
    'en:plain-wafers': 'Kekse & Gebäck',
    // Kuchen & Gebäck
    'en:cakes': 'Kuchen & Gebäck',
    'en:doughnuts': 'Kuchen & Gebäck',
    'en:sponge-cakes': 'Kuchen & Gebäck',
    'en:cheesecakes': 'Kuchen & Gebäck',
    'en:financiers': 'Kuchen & Gebäck',
    'en:apple-pies': 'Kuchen & Gebäck',
    // Riegel
    'en:muesli-bars': 'Riegel',
    'en:cereal-bars': 'Riegel',
    'en:bars': 'Riegel',
    'en:curd-snacks': 'Riegel',
    // Aufstriche (süß)
    'en:chocolate-spreads': 'Aufstriche (süß)',
    'en:hazelnut-spreads': 'Aufstriche (süß)',
    'en:peanut-butters': 'Aufstriche (süß)',
    'en:nut-butters': 'Aufstriche (süß)',
    'en:sweet-bean-paste': 'Aufstriche (süß)',
    // Desserts (gekühlt / ungekühlt)
    'en:desserts': 'Desserts (gekühlt / ungekühlt)',
    'en:puddings': 'Desserts (gekühlt / ungekühlt)',
    // Eis
    'en:ice-creams': 'Eis',
    'en:frozen-desserts': 'Eis',
    'en:sorbets': 'Eis',
    'en:ice-cream-bars': 'Eis',
    'en:luxury-ice-cream-in-a-box': 'Eis',

    // ── Frozen ───────────────────────────────────────────────────────────────
    // TK-Gemüse
    'en:frozen-vegetables': 'TK-Gemüse',
    'en:frozen-green-peas': 'TK-Gemüse',
    'en:frozen-spinach': 'TK-Gemüse',
    'en:frozen-broccoli': 'TK-Gemüse',
    'en:frozen-cardoons': 'TK-Gemüse',
    // TK-Obst
    'en:frozen-fruits': 'TK-Obst',
    'en:frozen-berries': 'TK-Obst',
    'en:frozen-mixed-tropical-fruits': 'TK-Obst',
    // TK-Kartoffelprodukte
    'en:frozen-potatoes': 'TK-Kartoffelprodukte',
    // TK-Fertiggerichte
    'en:frozen-meals': 'TK-Fertiggerichte',
    'en:frozen-pizzas': 'TK-Fertiggerichte',
    // TK-Fleischprodukte
    'en:frozen-meat-products': 'TK-Fleischprodukte',
    'en:frozen-turkey-meat': 'TK-Fleischprodukte',
    // TK-Fisch
    'en:frozen-fish-products': 'TK-Fisch',
    'en:frozen-crustaceans': 'TK-Fisch',
    'en:frozen-shrimps': 'TK-Fisch',
    // TK-Snacks & Vorspeisen
    'en:frozen-snacks': 'TK-Snacks & Vorspeisen',
    // TK-Backwaren
    'en:frozen-baked-goods': 'TK-Backwaren',
    'en:frozen-pizza-dough': 'TK-Backwaren',
    'en:frozen-stuffing': 'TK-Backwaren',
    // TK-Kräuter
    'en:frozen-herbs': 'TK-Kräuter',

    // ── Ready Meals ──────────────────────────────────────────────────────────
    // Suppen
    'en:soups': 'Suppen',
    'en:canned-soups': 'Suppen',
    'en:vegetable-soups': 'Suppen',
    // Instantgerichte
    'en:instant-noodles': 'Instantgerichte',
    'en:pot-noodles': 'Instantgerichte',
    // Nudelsoßen (Glas)
    'en:pasta-sauces': 'Nudelsoßen (Glas)',
    'en:tomato-sauces': 'Nudelsoßen (Glas)',
    'en:meal-sauces': 'Nudelsoßen (Glas)',
    'en:bolognese-sauces': 'Nudelsoßen (Glas)',
    'en:provencale-sauces': 'Nudelsoßen (Glas)',
    // Fertiggerichte (Dose / Glas)
    'en:meals': 'Fertiggerichte (Dose / Glas)',
    'en:prepared-meals': 'Fertiggerichte (Dose / Glas)',
    'en:prepared-foods': 'Fertiggerichte (Dose / Glas)',
    'en:stews': 'Fertiggerichte (Dose / Glas)',
    'en:goulash': 'Fertiggerichte (Dose / Glas)',
    'en:burritos': 'Fertiggerichte (Dose / Glas)',
    'en:pasta-dishes': 'Fertiggerichte (Dose / Glas)',
    'en:rice-dishes': 'Fertiggerichte (Dose / Glas)',
    'en:quinoa-dishes': 'Fertiggerichte (Dose / Glas)',
    // Dips & Aufstriche (herzhaft)
    'en:hummus': 'Dips & Aufstriche (herzhaft)',
    'en:dips': 'Dips & Aufstriche (herzhaft)',
    'en:tapenades': 'Dips & Aufstriche (herzhaft)',
    'en:salted-spreads': 'Dips & Aufstriche (herzhaft)',
    'en:plant-based-pates': 'Dips & Aufstriche (herzhaft)',
    // Fertigsalate & Deli (gekühlt)
    'en:prepared-salads': 'Fertigsalate & Deli (gekühlt)',
    'en:salads-and-salad-preparations': 'Fertigsalate & Deli (gekühlt)',
    'en:sandwiches': 'Fertigsalate & Deli (gekühlt)',
    'en:hamburgers': 'Fertigsalate & Deli (gekühlt)',
    // Kochsets & Würzpasten
    'en:curry-pastes': 'Kochsets & Würzpasten',
    'en:cooking-sauces': 'Kochsets & Würzpasten',
    'en:marinades': 'Kochsets & Würzpasten',
    // Tomatenprodukte
    'en:tomato-pastes': 'Tomatenprodukte',
    'en:tomato-purees': 'Tomatenprodukte',
    'en:tomato-pulps': 'Tomatenprodukte',
    'en:canned-tomatoes': 'Tomatenprodukte',
    'en:tomatoes-and-their-products': 'Tomatenprodukte',
    'en:peeled-tomatoes': 'Tomatenprodukte',

    // ── Condiments ───────────────────────────────────────────────────────────
    // Speiseöle
    'en:oils': 'Speiseöle',
    'en:olive-oils': 'Speiseöle',
    'en:sunflower-oils': 'Speiseöle',
    'en:extra-virgin-olive-oils': 'Speiseöle',
    'en:rapeseed-oils': 'Speiseöle',
    'en:coconut-oils': 'Speiseöle',
    'en:sesame-oils': 'Speiseöle',
    'en:walnut-oils': 'Speiseöle',
    'en:pistachio-oils': 'Speiseöle',
    'en:palm-oils': 'Speiseöle',
    // Essig
    'en:vinegars': 'Essig',
    'en:balsamic-vinegars': 'Essig',
    'en:wine-vinegars': 'Essig',
    'en:rice-vinegars': 'Essig',
    'en:alcohol-vinegars': 'Essig',
    // Tischsoßen
    'en:sauces': 'Tischsoßen',
    'en:ketchups': 'Tischsoßen',
    'en:mustards': 'Tischsoßen',
    'en:mayonnaises': 'Tischsoßen',
    'en:hot-sauces': 'Tischsoßen',
    'en:barbecue-sauces': 'Tischsoßen',
    'en:satay-sauces': 'Tischsoßen',
    // Asiatische Soßen & Pasten
    'en:soy-sauces': 'Asiatische Soßen & Pasten',
    'en:fish-sauces': 'Asiatische Soßen & Pasten',
    'en:teriyaki-sauces': 'Asiatische Soßen & Pasten',
    // Salatdressing
    'en:dressings': 'Salatdressing',
    'en:vinaigrettes': 'Salatdressing',
    // Gewürze (getrocknet)
    'en:spices': 'Gewürze (getrocknet)',
    'en:salt': 'Gewürze (getrocknet)',
    'en:peppers': 'Gewürze (getrocknet)',
    'en:cumin': 'Gewürze (getrocknet)',
    'en:sumac': 'Gewürze (getrocknet)',
    // Zucker & Süßungsmittel
    'en:sugars': 'Zucker & Süßungsmittel',
    'en:sweeteners': 'Zucker & Süßungsmittel',
    'en:syrups': 'Zucker & Süßungsmittel',
    // Marmelade & Aufstrich
    'en:jams': 'Marmelade & Aufstrich',
    'en:marmalades': 'Marmelade & Aufstrich',
    'en:honeys': 'Marmelade & Aufstrich',
    'en:spreads': 'Marmelade & Aufstrich',
    'en:flower-honeys': 'Marmelade & Aufstrich',
    'en:tahini': 'Marmelade & Aufstrich',
    // Brühe, Fond & Kochhilfen
    'en:bouillons': 'Brühe, Fond & Kochhilfen',
    'en:broths': 'Brühe, Fond & Kochhilfen',
    'en:cooking-helpers': 'Brühe, Fond & Kochhilfen',
    // Backzutaten
    'en:baking-aids': 'Backzutaten',
    'en:food-colorings': 'Backzutaten',
    'en:food-additives': 'Backzutaten',
    'en:gelatin': 'Backzutaten',
    // Eingelegtes & Konserven
    'en:pickles': 'Eingelegtes & Konserven',
    'en:olives': 'Eingelegtes & Konserven',
    'en:capers': 'Eingelegtes & Konserven',
    'en:gherkins': 'Eingelegtes & Konserven',
    'en:kimchi': 'Eingelegtes & Konserven',
    'en:fermented-foods': 'Eingelegtes & Konserven',

    // ── Baby Food ────────────────────────────────────────────────────────────
    'en:infant-formulas': 'Baby-Milchnahrung',
    'en:baby-cereals': 'Baby-Brei',
    'en:baby-foods': 'Baby-Gläschen',
    'en:baby-snacks': 'Baby-Snacks',
    'en:baby-drinks': 'Baby-Getränke & Sonstiges',
}

import { bestMatch } from './productMatcher.js'
import { semanticBestMatch, isModelReady } from '../lib/embeddings.js'
import offExpansion from '../data/offExpansion.json'
import SUBCATEGORIES from '../data/subcategories.js'
import {
    findGenericByAlias,
    getGenericByName,
    getGenericsForSubcategory,
    slugifyGenericId,
} from '../data/productCatalogue.js'

// ── OFF-expansion keyword hints (6k+ auto-generated from OFF taxonomy) ───────
// Merged with manually-curated hints below. Manual hints take priority.
const OFF_KEYWORD_HINTS = offExpansion.keywordHints || {}

// ── Subcategory → category lookup ────────────────────────────────────────────
const _subcatToCat = new Map(SUBCATEGORIES.map(s => [s.name, s.category]))
function subcatToCategory(subcatName) {
    return _subcatToCat.get(subcatName) || null
}

// ── Subcategory-by-category index ────────────────────────────────────────────
const _subcatsByCategory = new Map()
for (const s of SUBCATEGORIES) {
    if (!_subcatsByCategory.has(s.category)) _subcatsByCategory.set(s.category, [])
    _subcatsByCategory.get(s.category).push(s.name)
}

/**
 * Pick the best subcategory within a given category for a product name.
 * Used when the user manually overrides the auto-detected category.
 */
export function bestSubcategoryForCategory(name, category) {
    if (!name || !category) return null
    const allowed = _subcatsByCategory.get(category)
    if (!allowed || allowed.length === 0) return null

    // Try catalogue match filtered to category
    const match = bestMatch(name, 0.4)
    if (match && match.category === category && match.subcategory) return match.subcategory

    // Try keyword hints filtered to category
    const text = name.toLowerCase()
    for (const [kw, sub] of Object.entries(KEYWORD_SUBCATEGORY_HINTS)) {
        if (keywordInText(text, kw) && allowed.includes(sub)) return sub
    }
    for (const [kw, sub] of Object.entries(OFF_KEYWORD_HINTS)) {
        if (keywordInText(text, kw) && allowed.includes(sub)) return sub
    }

    return null
}

/**
 * Pick the best generic product within a known subcategory for a given name.
 * Used to deepen classification once category + subcategory are already known.
 *
 * @returns {{id: string, name: string}|null}
 */
export function bestGenericInSubcategory(name, subcategory) {
    if (!name || !subcategory) return null
    const generics = getGenericsForSubcategory(subcategory)
    if (!generics.length) return null

    // 1. Alias exact match, but only if the resolved generic is in this subcategory
    const alias = findGenericByAlias(name)
    if (alias && alias.subcategory === subcategory) {
        return { id: alias.id, name: alias.name }
    }

    // 2. Fuzzy catalogue match filtered to this subcategory
    const match = bestMatch(name, 0.4)
    if (match && match.subcategory === subcategory) {
        return { id: slugifyGenericId(match.name), name: match.name }
    }

    return null
}

// ── Keyword matching helper ──────────────────────────────────────────────────
// Requires keywords to appear at the start of a word in the text.
// Short keywords (≤3 chars) require exact word match to prevent
// false positives like 'ei' matching 'einem' or 'eis' matching 'reis'.
function keywordInText(text, kw) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (kw.length <= 3) {
        return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(text)
    }
    return new RegExp(`(?:^|\\s)${escaped}`).test(text)
}

// ── Keyword → subcategory hints ─────────────────────────────────────────────
// When classification falls back to keyword matching, this map provides
// a subcategory for the matched keyword.
const KEYWORD_SUBCATEGORY_HINTS = {
    // Dairy & Eggs
    'milch': 'Milch', 'milk': 'Milch', 'buttermilch': 'Milch', 'kondensmilch': 'Milch',
    'joghurt': 'Joghurt', 'yogurt': 'Joghurt', 'yoghurt': 'Joghurt', 'skyr': 'Joghurt',
    'quark': 'Quark',
    'käse': 'Käse — Schnitt- & Hartkäse', 'cheese': 'Käse — Schnitt- & Hartkäse',
    'mozzarella': 'Käse — Italienisch', 'brie': 'Käse — Weichkäse', 'camembert': 'Käse — Weichkäse',
    'frischkäse': 'Käse — Frischkäse & Aufstrich', 'fromage': 'Käse — Schnitt- & Hartkäse',
    'butter': 'Butter & Margarine', 'sahne': 'Sahne & Crème', 'cream': 'Sahne & Crème',
    'ei': 'Eier', 'egg': 'Eier', 'kefir': 'Fermentierte Milch',
    'philadelphia': 'Käse — Frischkäse & Aufstrich', 'beurre': 'Butter & Margarine',
    // Fruits & Veg
    'apfel': 'Frisches Obst — Kernobst', 'apple': 'Frisches Obst — Kernobst',
    'banane': 'Frisches Obst — Bananen & Tropisch', 'banana': 'Frisches Obst — Bananen & Tropisch',
    'tomate': 'Gemüse — Tomaten & Paprika', 'tomato': 'Gemüse — Tomaten & Paprika',
    'karotte': 'Gemüse — Wurzelgemüse', 'carrot': 'Gemüse — Wurzelgemüse',
    'zwiebel': 'Gemüse — Zwiebeln & Knoblauch', 'onion': 'Gemüse — Zwiebeln & Knoblauch',
    'knoblauch': 'Gemüse — Zwiebeln & Knoblauch', 'garlic': 'Gemüse — Zwiebeln & Knoblauch',
    'gurke': 'Gemüse — Kürbis & Gurke', 'cucumber': 'Gemüse — Kürbis & Gurke',
    'pilze': 'Pilze', 'mushroom': 'Pilze',
    'nuss': 'Nüsse & Kerne', 'nuts': 'Nüsse & Kerne', 'mandel': 'Nüsse & Kerne',
    'bohnen': 'Hülsenfrüchte (trocken & Dose)', 'beans': 'Hülsenfrüchte (trocken & Dose)',
    'linsen': 'Hülsenfrüchte (trocken & Dose)', 'lentils': 'Hülsenfrüchte (trocken & Dose)',
    'zitrone': 'Frisches Obst — Zitrusfrüchte', 'lemon': 'Frisches Obst — Zitrusfrüchte',
    'erdbeere': 'Frisches Obst — Beeren', 'strawberry': 'Frisches Obst — Beeren',
    'walnuss': 'Nüsse & Kerne', 'walnusskern': 'Nüsse & Kerne',
    'nussmix': 'Nüsse & Kerne', 'cashew': 'Nüsse & Kerne',
    'haselnuss': 'Nüsse & Kerne', 'pistazie': 'Nüsse & Kerne',
    // Meat & Fish
    'wurst': 'Wurst & Würstchen', 'sausage': 'Wurst & Würstchen',
    'fisch': 'Frischer Fisch', 'fish': 'Frischer Fisch', 'lachs': 'Frischer Fisch',
    'sardine': 'Fisch aus der Dose / geräuchert', 'sardinen': 'Fisch aus der Dose / geräuchert',
    'huhn': 'Geflügel', 'chicken': 'Geflügel', 'hähnchen': 'Geflügel',
    'rind': 'Rindfleisch', 'beef': 'Rindfleisch',
    'schwein': 'Schweinefleisch', 'pork': 'Schweinefleisch',
    'schinken': 'Aufschnitt & Wurstwaren', 'ham': 'Aufschnitt & Wurstwaren',
    'thunfisch': 'Fisch aus der Dose / geräuchert', 'tuna': 'Fisch aus der Dose / geräuchert',
    'garnele': 'Meeresfrüchte', 'shrimp': 'Meeresfrüchte',
    // Drinks
    'wasser': 'Wasser', 'water': 'Wasser', 'sprudel': 'Wasser', 'mineralwasser': 'Wasser',
    'saft': 'Saft', 'juice': 'Saft',
    'kaffee': 'Kaffee', 'coffee': 'Kaffee',
    'tee': 'Tee', 'tea': 'Tee',
    'bier': 'Bier', 'beer': 'Bier',
    'wein': 'Wein & Sekt', 'wine': 'Wein & Sekt',
    'limonade': 'Schorle & Limonaden', 'cola': 'Schorle & Limonaden',
    'smoothie': 'Smoothies', 'kakao': 'Kakao & Heißgetränke',
    'nesquik': 'Kakao & Heißgetränke',
    // Bread & Grains
    'brot': 'Brot', 'bread': 'Brot',
    'pasta': 'Nudeln', 'nudel': 'Nudeln',
    'reis': 'Reis', 'rice': 'Reis',
    'mehl': 'Mehl', 'flour': 'Mehl',
    'müsli': 'Frühstückscerealien', 'muesli': 'Frühstückscerealien', 'cereal': 'Frühstückscerealien',
    'haferflocken': 'Frühstückscerealien',
    'weetabix': 'Frühstückscerealien', 'cornflakes': 'Frühstückscerealien',
    'cracker': 'Cracker & Knäckebrot', 'knäckebrot': 'Cracker & Knäckebrot',
    'quinoa': 'Andere Getreide', 'couscous': 'Andere Getreide',
    'tortilla': 'Fladenbrot, Wraps & Spezialbrote',
    // Snacks & Sweets
    'schokolade': 'Schokolade', 'chocolate': 'Schokolade',
    'keks': 'Kekse & Gebäck', 'cookie': 'Kekse & Gebäck',
    'chips': 'Salzige Snacks', 'popcorn': 'Salzige Snacks',
    'eis': 'Eis', 'kuchen': 'Kuchen & Gebäck', 'cake': 'Kuchen & Gebäck',
    'nutella': 'Aufstriche (süß)', 'haribo': 'Süßigkeiten',
    'gummi': 'Süßigkeiten', 'bonbon': 'Süßigkeiten',
    'snickers': 'Riegel', 'twix': 'Riegel', 'bounty': 'Riegel',
    'kitkat': 'Riegel', 'mars': 'Riegel',
    'edelbitter': 'Schokolade', 'chocolat': 'Schokolade', 'cacao': 'Schokolade',
    'biscuit': 'Kekse & Gebäck',
    // Frozen
    'tiefkühl': 'TK-Fertiggerichte', 'frozen': 'TK-Fertiggerichte',
    // Ready Meals
    'suppe': 'Suppen', 'soup': 'Suppen', 'eintopf': 'Suppen',
    'pizza': 'TK-Fertiggerichte', 'lasagne': 'Fertiggerichte (Dose / Glas)',
    // Condiments
    'öl': 'Speiseöle', 'oil': 'Speiseöle',
    'essig': 'Essig', 'vinegar': 'Essig',
    'ketchup': 'Tischsoßen', 'senf': 'Tischsoßen', 'mustard': 'Tischsoßen',
    'mayo': 'Tischsoßen', 'mayonnaise': 'Tischsoßen',
    'zucker': 'Zucker & Süßungsmittel', 'sugar': 'Zucker & Süßungsmittel',
    'honig': 'Marmelade & Aufstrich', 'honey': 'Marmelade & Aufstrich',
    'pesto': 'Kochsets & Würzpasten',
    'brühe': 'Brühe, Fond & Kochhilfen', 'bouillon': 'Brühe, Fond & Kochhilfen',
    'dressing': 'Salatdressing',
    'moutarde': 'Tischsoßen', 'confiture': 'Marmelade & Aufstrich',
    'konfitüre': 'Marmelade & Aufstrich', 'marmelade': 'Marmelade & Aufstrich',
    'jam': 'Marmelade & Aufstrich',
    // Baby Food
    'baby': 'Baby-Gläschen',
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Classifies a product across the three taxonomy levels:
 *   Level 1: category     (e.g. "Dairy & Eggs")
 *   Level 2: subcategory  (e.g. "Milch")
 *   Level 3: genericId    (e.g. "h-milch-haltbar")  ← generic product slug
 *
 * All three may be null if no confident match is found.
 *
 * @returns {{
 *   category: string,
 *   subcategory: string|null,
 *   genericId: string|null,
 *   genericName: string|null,
 *   source: string,
 * }}
 */
export function classifyProduct({ name = '', brand = '', categories = [] }) {
    // Step 0: Exact generic product match (by name or alias)
    // Highest confidence — short-circuits if user typed a catalogue name or a known alias.
    if (name) {
        const exact = getGenericByName(name) || findGenericByAlias(name)
        if (exact) {
            return {
                category: exact.category,
                subcategory: exact.subcategory,
                genericId: exact.id,
                genericName: exact.name,
                source: 'generic-exact',
            }
        }
    }

    // Step 1: OFF taxonomy — scan ALL tags and pick the highest-priority match
    let bestOff = null
    let bestSubcategory = null
    for (const tag of categories) {
        const cat = OFF_CATEGORY_MAP[tag]
        if (cat && (bestOff === null || CATEGORY_PRIORITY[cat] < CATEGORY_PRIORITY[bestOff])) {
            bestOff = cat
        }
        // Also check for subcategory mapping
        const sub = OFF_SUBCATEGORY_MAP[tag]
        if (sub) bestSubcategory = sub
    }
    if (bestOff) {
        // If OFF gave a category but no subcategory, try the catalogue
        let generic = null
        if (!bestSubcategory && name) {
            const match = bestMatch(name, 0.5)
            if (match && match.subcategory) {
                bestSubcategory = match.subcategory
                generic = { id: slugifyGenericId(match.name), name: match.name }
            }
        } else if (bestSubcategory && name) {
            // Try to narrow to a generic within the OFF-detected subcategory
            generic = bestGenericInSubcategory(name, bestSubcategory)
        }
        return {
            category: bestOff,
            subcategory: bestSubcategory,
            genericId: generic?.id || null,
            genericName: generic?.name || null,
            source: 'off',
        }
    }

    // Step 2: catalogue lookup — try to match by product name (fuzzy NLP)
    if (name) {
        const match = bestMatch(name, 0.5)
        if (match) {
            return {
                category: match.category,
                subcategory: match.subcategory || null,
                genericId: slugifyGenericId(match.name),
                genericName: match.name,
                source: 'catalogue',
            }
        }
    }

    // Step 3: keyword rules — scan ALL rules, pick highest-priority match
    const text = [name, brand].join(' ').toLowerCase()
    let bestKw = null
    let matchedKeyword = null
    for (const rule of KEYWORD_RULES) {
        const hit = rule.keywords.find((kw) => keywordInText(text, kw))
        if (hit) {
            if (bestKw === null || CATEGORY_PRIORITY[rule.category] < CATEGORY_PRIORITY[bestKw]) {
                bestKw = rule.category
                // Prefer a keyword that has a subcategory hint
                const hinted = rule.keywords.find(kw => keywordInText(text, kw) && KEYWORD_SUBCATEGORY_HINTS[kw])
                matchedKeyword = hinted || hit
            }
        }
    }
    if (bestKw) {
        const hintedSub = KEYWORD_SUBCATEGORY_HINTS[matchedKeyword]
            || OFF_KEYWORD_HINTS[matchedKeyword]
            || null
        const generic = hintedSub && name ? bestGenericInSubcategory(name, hintedSub) : null
        return {
            category: bestKw,
            subcategory: hintedSub,
            genericId: generic?.id || null,
            genericName: generic?.name || null,
            source: 'keyword',
        }
    }

    // Step 4: OFF-expansion keyword hints — check normalized text against 6k+ taxonomy-derived keywords
    const normText = text
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s]/g, ' ').trim()
    const offHintSub = OFF_KEYWORD_HINTS[normText]
    if (offHintSub) {
        const cat = subcatToCategory(offHintSub)
        if (cat) {
            const generic = name ? bestGenericInSubcategory(name, offHintSub) : null
            return {
                category: cat,
                subcategory: offHintSub,
                genericId: generic?.id || null,
                genericName: generic?.name || null,
                source: 'off-expansion',
            }
        }
    }

    return {
        category: 'Other',
        subcategory: null,
        genericId: null,
        genericName: null,
        source: 'fallback',
    }
}

/**
 * Async classification using ML embeddings (cosine similarity).
 * Falls back to the synchronous classifyProduct() if the model isn't loaded yet.
 *
 * @param {{ name?: string, brand?: string, categories?: string[] }} product
 * @returns {Promise<{
 *   category: string,
 *   subcategory: string|null,
 *   genericId: string|null,
 *   genericName: string|null,
 *   source: string,
 * }>}
 */
export async function classifyProductAsync({ name = '', brand = '', categories = [] }) {
    // First try the fast synchronous pipeline
    const syncResult = classifyProduct({ name, brand, categories })

    // If we got a good result (not fallback), use it
    if (syncResult.source !== 'fallback') return syncResult

    // If the embedding model is ready, try semantic matching
    if (name && isModelReady()) {
        const match = await semanticBestMatch(name, 0.6)
        if (match) {
            // If the semantic match already resolved to a generic product, trust it.
            // Otherwise narrow within the matched subcategory via fuzzy/alias.
            let genericId = match.genericId || null
            let genericName = match.genericName || null
            if (!genericId && match.subcategory) {
                const g = bestGenericInSubcategory(name, match.subcategory)
                genericId = g?.id || null
                genericName = g?.name || null
            }
            return {
                category: match.category,
                subcategory: match.subcategory || null,
                genericId,
                genericName,
                source: match.level === 'generic' ? 'embedding-generic' : 'embedding',
            }
        }
    }

    return syncResult
}

