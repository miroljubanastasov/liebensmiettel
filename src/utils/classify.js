/**
 * Product category classification — three-level cascade:
 * 1. Open Food Facts taxonomy lookup (instant, ~70% coverage)
 * 2. Keyword rules (instant, ~20% more)
 * 3. Falls back to 'Other'
 */

const OFF_CATEGORY_MAP = {
  'en:milks': 'Dairy & Eggs',
  'en:cheeses': 'Dairy & Eggs',
  'en:yogurts': 'Dairy & Eggs',
  'en:eggs': 'Dairy & Eggs',
  'en:butters': 'Dairy & Eggs',
  'en:creams': 'Dairy & Eggs',
  'en:meats': 'Meat & Fish',
  'en:fishes': 'Meat & Fish',
  'en:seafood': 'Meat & Fish',
  'en:poultry': 'Meat & Fish',
  'en:sausages': 'Meat & Fish',
  'en:waters': 'Drinks',
  'en:fruit-juices': 'Drinks',
  'en:coffees': 'Drinks',
  'en:teas': 'Drinks',
  'en:beers': 'Drinks',
  'en:wines': 'Drinks',
  'en:soft-drinks': 'Drinks',
  'en:breads': 'Bread & Grains',
  'en:pastas': 'Bread & Grains',
  'en:rices': 'Bread & Grains',
  'en:cereals': 'Bread & Grains',
  'en:flours': 'Bread & Grains',
  'en:chocolates': 'Snacks & Sweets',
  'en:biscuits-and-cakes': 'Snacks & Sweets',
  'en:chips-and-crisps': 'Snacks & Sweets',
  'en:candies': 'Snacks & Sweets',
  'en:fruits': 'Fruit & Veg',
  'en:vegetables': 'Fruit & Veg',
  'en:frozen-foods': 'Frozen',
  'en:baby-foods': 'Baby Food',
  'en:sauces': 'Pantry',
  'en:oils': 'Pantry',
  'en:vinegars': 'Pantry',
  'en:jams': 'Pantry',
  'en:spices': 'Pantry',
  'en:canned-foods': 'Pantry',
}

const KEYWORD_RULES = [
  { keywords: ['milch', 'milk', 'käse', 'cheese', 'joghurt', 'yogurt', 'butter', 'sahne', 'quark', 'ei', 'egg'], category: 'Dairy & Eggs' },
  { keywords: ['fleisch', 'meat', 'wurst', 'sausage', 'fisch', 'fish', 'lachs', 'salmon', 'huhn', 'chicken', 'hack', 'schinken'], category: 'Meat & Fish' },
  { keywords: ['wasser', 'water', 'saft', 'juice', 'kaffee', 'coffee', 'tee', 'tea', 'bier', 'beer', 'wein', 'wine', 'limonade', 'cola'], category: 'Drinks' },
  { keywords: ['brot', 'bread', 'pasta', 'nudel', 'reis', 'rice', 'mehl', 'flour', 'müsli', 'cereal', 'haferflocken'], category: 'Bread & Grains' },
  { keywords: ['schokolade', 'chocolate', 'keks', 'cookie', 'chips', 'snack', 'süß', 'candy', 'gummi', 'eis', 'ice cream'], category: 'Snacks & Sweets' },
  { keywords: ['apfel', 'apple', 'banane', 'banana', 'tomate', 'tomato', 'salat', 'lettuce', 'karotte', 'carrot', 'obst', 'gemüse', 'fruit', 'vegetable'], category: 'Fruit & Veg' },
  { keywords: ['tiefkühl', 'frozen', 'gefroren'], category: 'Frozen' },
  { keywords: ['baby', 'säugling', 'hipp', 'aptamil', 'humana'], category: 'Baby Food' },
  { keywords: ['öl', 'oil', 'essig', 'vinegar', 'sauce', 'soße', 'gewürz', 'spice', 'salz', 'salt', 'zucker', 'sugar', 'senf', 'mustard', 'ketchup', 'marmelade', 'jam', 'honig', 'honey'], category: 'Pantry' },
]

export function classifyProduct({ name = '', brand = '', categories = [] }) {
  // Step 1: OFF taxonomy
  for (const tag of categories) {
    if (OFF_CATEGORY_MAP[tag]) return { category: OFF_CATEGORY_MAP[tag], source: 'off' }
  }

  // Step 2: keyword rules
  const text = [name, brand].join(' ').toLowerCase()
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return { category: rule.category, source: 'keyword' }
    }
  }

  return { category: 'Other', source: 'fallback' }
}
