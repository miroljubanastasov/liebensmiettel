-- =============================================================================
-- Dummy data for UI testing
-- 100 product_entries: 50 grocery list (listed) + 50 pantry (in_pantry)
-- User: test@liebensmittel.app  (aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa)
--
-- Run against local Supabase:
--   npx supabase db reset          (full reset + seed + this)
--   -- OR --
--   npx supabase db execute --local < supabase/snippets/dummy_data.sql
-- =============================================================================

-- Wipe any existing test entries first so re-runs are idempotent
delete from public.product_entries
where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- =============================================================================
-- GROCERY LIST  (status = 'listed')
-- =============================================================================
insert into public.product_entries
    (id, user_id, status, entry_source, name, brand, category, quantity, unit, notes, price, ean, listed_at, created_at, updated_at)
values

-- Dairy & Eggs (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Vollmilch 3,5%',          'Weihenstephan',  'Dairy & Eggs', 2,    'L',    null,              1.29, '4002600004319', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Bio-Eier Freiland',       'Denns',          'Dairy & Eggs', 6,    'pc',   'Größe M',         2.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Gouda jung, Scheiben',    'Leerdammer',     'Dairy & Eggs', 200,  'g',    null,              2.19, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Griechischer Joghurt',    'Fage',           'Dairy & Eggs', 500,  'g',    '10% Fett',        1.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Butter ungesalzen',       'Kerrygold',      'Dairy & Eggs', 250,  'g',    null,              2.79, '5000159484374', now(), now(), now()),

-- Fruits & Veg (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Äpfel Braeburn',          null,             'Fruits & Veg', 1,    'kg',   null,              1.79, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Bananen',                 null,             'Fruits & Veg', 1,    'kg',   'reif',            1.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Cherry-Tomaten',          null,             'Fruits & Veg', 500,  'g',    null,              1.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Paprika Mix (rot/gelb)',  null,             'Fruits & Veg', 3,    'pc',   null,              1.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Avocado',                 null,             'Fruits & Veg', 2,    'pc',   'möglichst reif',  0.99, null, now(), now(), now()),

-- Meat & Fish (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Hähnchenbrustfilet',      'Wiesenhof',      'Meat & Fish',  500,  'g',    null,              4.99, '4000405084106', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Lachsfilet',              'Followfish',     'Meat & Fish',  300,  'g',    'MSC-zertifiziert',5.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Hackfleisch gemischt',    null,             'Meat & Fish',  500,  'g',    null,              3.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Thunfisch in Wasser',     'Rio Mare',       'Meat & Fish',  3,    'pc',   '185 g Dose',      2.49, '4005500052029', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Kochschinken',            'Herta',          'Meat & Fish',  200,  'g',    null,              1.99, '4003171036255', now(), now(), now()),

-- Drinks (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Mineralwasser still',     'Evian',          'Drinks',       6,    'btl',  '1,5 L Flaschen',  3.99, '3068320114804', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Orangensaft 100%',        'Tropicana',      'Drinks',       1,    'L',    null,              2.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Coca-Cola',               'Coca-Cola',      'Drinks',       2,    'L',    null,              2.29, '5449000000996', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Grüntee-Beutel',          'Teekanne',       'Drinks',       1,    'pack', '20 Beutel',       1.79, '4002051008471', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Kaffeebohnen Espresso',   'Lavazza',        'Drinks',       500,  'g',    null,              6.99, '8000070038127', now(), now(), now()),

-- Bread & Grains (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Vollkornbrot',            'Mestemacher',    'Bread & Grains', 500, 'g',   null,              2.49, '4000281700701', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Cornflakes',              'Kellogg''s',     'Bread & Grains', 375, 'g',   null,              2.99, '5050083407642', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Penne Rigate',            'Barilla',        'Bread & Grains', 2,   'pack','500 g Pack',      1.49, '8076809513388', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Basmati-Reis',            'Uncle Ben''s',   'Bread & Grains', 1,   'kg',  null,              2.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Toastbrot',               'Harry',          'Bread & Grains', 1,   'pack',null,              1.29, null, now(), now(), now()),

-- Snacks & Sweets (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Vollmilch-Schokolade',    'Milka',          'Snacks & Sweets', 3,  'pc',  '100 g Tafel',     0.99, '7622300489434', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Chips Original',          'Lay''s',         'Snacks & Sweets', 1,  'pack','175 g',            1.79, '5000159461122', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Goldbären',               'Haribo',         'Snacks & Sweets', 2,  'pack','200 g',            1.29, '4001475104008', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Nuss-Nougat-Creme',       'Nutella',        'Snacks & Sweets', 1,  'pc',  '400 g Glas',      4.49, '80051828', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Butterkeks',              'Leibniz',        'Snacks & Sweets', 1,  'pack','200 g',            1.59, null, now(), now(), now()),

-- Frozen (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Tiefkühlpizza Margherita','Dr. Oetker',     'Frozen',       2,    'pc',   null,              3.49, '4001724819608', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Fischstäbchen',           'Iglo',           'Frozen',       1,    'pack', '400 g',           3.79, '4250548900010', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Gemüsemix TK',            'Iglo',           'Frozen',       1,    'pack', '750 g',           2.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Vanilleeis',              'Häagen-Dazs',    'Frozen',       1,    'L',    null,              6.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Pommes frites',           'McCain',         'Frozen',       1,    'pack', '750 g',           2.29, null, now(), now(), now()),

-- Ready Meals (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Linsensuppe',             'Heinz',          'Ready Meals',  2,    'pc',   '400 ml Dose',     1.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Hummus Natur',            'Alnatura',       'Ready Meals',  1,    'pc',   '200 g',           2.29, '1357924680135', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Instant-Nudelsuppe',      'Nissin',         'Ready Meals',  4,    'pc',   '85 g',            0.79, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Kichererbsen-Curry',      'Bio Zentrale',   'Ready Meals',  2,    'pc',   '400 g',           2.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Gulasch im Glas',         'Meica',          'Ready Meals',  1,    'pc',   '400 g',           3.49, null, now(), now(), now()),

-- Condiments (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Olivenöl extra vergine',  'Bertolio',       'Condiments',   750,  'ml',   null,              5.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Ketchup',                 'Heinz',          'Condiments',   1,    'btl',  '500 ml',          2.49, '87157256', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Sojasauce',               'Kikkoman',       'Condiments',   250,  'ml',   null,              2.99, '8715700110004', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Sriracha Sauce',          'Huy Fong',       'Condiments',   1,    'btl',  '435 ml',          3.99, '08553600710', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Mayonnaise',              'Hellmann''s',    'Condiments',   400,  'ml',   null,              2.29, null, now(), now(), now()),

-- Baby Food (3)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Fruchtpüree Apfel-Birne', 'HiPP',           'Baby Food',    4,    'pc',   '100 g',           3.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Anfangsmilch Pre',        'Aptamil',        'Baby Food',    1,    'pc',   '800 g Dose',     18.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Babygläschen Karotte',    'HiPP',           'Baby Food',    6,    'pc',   '190 g',           4.99, null, now(), now(), now()),

-- Other (2)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Spülmaschinentabs',       'Finish',         'Other',        1,    'pack', '25 Tabs',         6.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'listed', 'manual', 'Vitamin C 1000 mg',       'DM Eigenmarke',  'Other',        1,    'pack', '60 Tabletten',    3.49, null, now(), now(), now());

-- =============================================================================
-- PANTRY  (status = 'in_pantry')
-- =============================================================================
insert into public.product_entries
    (id, user_id, status, entry_source, name, brand, category, quantity, unit, location, expiry_date, price, ean, shelved_at, created_at, updated_at)
values

-- Dairy & Eggs (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'H-Milch 1,5%',           'Weihenstephan',  'Dairy & Eggs', 4,    'L',    'pantry',   '2026-09-30', 1.09, '4002600004319', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Frischkäse',             'Philadelphia',   'Dairy & Eggs', 200,  'g',    'fridge',   '2026-04-20', 2.29, '7622210399601', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Mozzarella',             'Galbani',        'Dairy & Eggs', 125,  'g',    'fridge',   '2026-04-18', 1.49, '8000430130737', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Magerquark',             'Müller',         'Dairy & Eggs', 500,  'g',    'fridge',   '2026-04-10', 0.99, '4025500157104', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Sahne 30%',              'Rama',           'Dairy & Eggs', 200,  'ml',   'fridge',   '2026-04-25', 1.19, null, now(), now(), now()),

-- Fruits & Veg (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Karotten',               null,             'Fruits & Veg', 1,    'kg',   'fridge',   '2026-04-28', 1.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Baby-Spinat',            null,             'Fruits & Veg', 200,  'g',    'fridge',   '2026-04-16', 1.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Zitronen',               null,             'Fruits & Veg', 4,    'pc',   'pantry',   '2026-05-01', 0.89, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Brokkoli',               null,             'Fruits & Veg', 1,    'pc',   'fridge',   '2026-04-17', 1.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Erdbeeren',              null,             'Fruits & Veg', 500,  'g',    'fridge',   '2026-04-12', 3.49, null, now(), now(), now()),

-- Meat & Fish (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Rindersteak',            null,             'Meat & Fish',  250,  'g',    'freezer',  '2026-10-15', 5.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Garnelen TK',            null,             'Meat & Fish',  400,  'g',    'freezer',  '2026-11-30', 6.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Sardinen in Öl',         'Nixe',           'Meat & Fish',  3,    'pc',   'pantry',   '2027-06-01', 0.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Salami, aufgeschnitten', 'Rügenwalder',   'Meat & Fish',  100,  'g',    'fridge',   '2026-04-19', 1.79, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Lachs, geräuchert',      'Followfish',     'Meat & Fish',  200,  'g',    'fridge',   '2026-04-22', 4.99, null, now(), now(), now()),

-- Drinks (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Apfelsaft trüb',         'Hohes C',        'Drinks',       1,    'L',    'pantry',   '2026-12-31', 1.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Espresso-Kapseln',       'Nespresso',      'Drinks',       10,   'pc',   'pantry',   '2027-03-01', 5.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Cranberry-Saft',         'Ocean Spray',    'Drinks',       1,    'L',    'pantry',   '2026-08-15', 3.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Kombucha Ingwer',        'Health-Ade',     'Drinks',       330,  'ml',   'fridge',   '2026-05-10', 2.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Milchkaffee Fertig',     'Nescafé',        'Drinks',       250,  'ml',   'fridge',   '2026-04-14', 1.29, null, now(), now(), now()),

-- Bread & Grains (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Haferflocken zart',      'Kölln',          'Bread & Grains', 500, 'g',  'pantry',   '2026-11-01', 1.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Muesli Früchte',         'Jordans',        'Bread & Grains', 750, 'g',  'pantry',   '2026-09-15', 4.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Couscous',               null,             'Bread & Grains', 500, 'g',  'pantry',   '2027-01-01', 1.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Dinkelmehl Type 630',    'Alnatura',       'Bread & Grains', 1,   'kg', 'pantry',   '2026-10-31', 2.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Laugenbrezel',           null,             'Bread & Grains', 4,   'pc', 'pantry',   '2026-04-18', 1.49, null, now(), now(), now()),

-- Snacks & Sweets (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Dunkle Schokolade 72%',  'Lindt',          'Snacks & Sweets', 100, 'g', 'pantry',   '2026-12-31', 1.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Pringles Original',      'Pringles',       'Snacks & Sweets', 165, 'g', 'pantry',   '2026-07-01', 2.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Erdnussbutter cremig',   'Skippy',         'Snacks & Sweets', 350, 'g', 'pantry',   '2027-02-01', 3.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Cashewkerne geröstet',   null,             'Snacks & Sweets', 200, 'g', 'pantry',   '2026-08-01', 3.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Popcorn Karamell',       null,             'Snacks & Sweets', 100, 'g', 'pantry',   '2026-06-30', 1.49, null, now(), now(), now()),

-- Frozen (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Pizza Salami TK',        'Dr. Oetker',     'Frozen',       1,    'pc',   'freezer',  '2026-09-01', 3.49, '4001724819608', now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Spinat gehackt TK',      'Iglo',           'Frozen',       750,  'g',    'freezer',  '2026-12-01', 2.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Erdbeer-Himbeermix TK',  null,             'Frozen',       500,  'g',    'freezer',  '2026-11-15', 2.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Edamame TK',             null,             'Frozen',       400,  'g',    'freezer',  '2027-01-15', 3.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Croissants TK',          'Bonne Maman',   'Frozen',       6,    'pc',   'freezer',  '2026-08-30', 3.99, null, now(), now(), now()),

-- Ready Meals (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Lasagne al Forno',       'Bertolli',       'Ready Meals',  400,  'g',    'pantry',   '2026-07-30', 3.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Tomatensuppe',           'Heinz',          'Ready Meals',  400,  'ml',   'pantry',   '2027-01-31', 1.79, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Linsen rot, Dose',       'Alnatura',       'Ready Meals',  400,  'g',    'pantry',   '2027-06-01', 1.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Kidney Bohnen, Dose',    null,             'Ready Meals',  425,  'g',    'cellar',   '2028-01-01', 0.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Mais, Dose',             null,             'Ready Meals',  340,  'g',    'cellar',   '2028-03-01', 0.89, null, now(), now(), now()),

-- Condiments (5)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Senf mittelscharf',      'Thomy',          'Condiments',   250,  'g',    'fridge',   '2026-10-01', 1.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Balsamico Essig',        'Mazzetti',       'Condiments',   500,  'ml',   'pantry',   '2027-12-31', 3.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Worcestershire Sauce',   'Lea & Perrins',  'Condiments',   150,  'ml',   'pantry',   '2027-09-01', 2.49, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Tamari dunkel',          'Clearspring',    'Condiments',   250,  'ml',   'fridge',   '2026-11-01', 4.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Honig flüssig',          'Langnese',       'Condiments',   500,  'g',    'pantry',   '2028-06-01', 4.49, null, now(), now(), now()),

-- Baby Food (3)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Kindermilch 1+',         'Bebivita',       'Baby Food',    800,  'g',    'pantry',   '2026-08-01', 12.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Reisbrei Vanille',       'HiPP',           'Baby Food',    250,  'g',    'pantry',   '2026-09-01', 3.29, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Frucht-Snack Birne',     'HiPP',           'Baby Food',    12,   'pc',   'pantry',   '2026-10-15', 5.99, null, now(), now(), now()),

-- Other (2)
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Hundefutter Adult',      'Pedigree',       'Other',        6,    'pc',   'cellar',   '2027-04-01', 4.99, null, now(), now(), now()),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'in_pantry', 'manual', 'Backpulver',             'Dr. Oetker',     'Other',        3,    'pc',   'pantry',   '2026-12-01', 0.79, null, now(), now(), now());

-- =============================================================================
-- PRODUCTS (canonical nutrition data — referenced by product_entries via EAN)
-- =============================================================================
delete from public.products;

insert into public.products
    (ean, name, brand, quantity, nutriscore, ecoscore, nova_group,
     energy_kcal, fat_g, saturated_fat_g, carbs_g, sugars_g, fiber_g, protein_g, salt_g,
     labels, allergens, ingredients, categories, fetched_at)
values
-- Dairy & Eggs
('4002600004319', 'Vollmilch 3,5%',        'Weihenstephan', '1 L',   'c', 'c', 1,  64,  3.5,  2.3, 4.8,  4.8,  0,    3.3, 0.13, '{"en:vegetarian","de:ohne-gentechnik"}', '{Milch}',          'Pasteurisierte MILCH',                                   '{Milch}',            now()),
('7622210399601', 'Philadelphia Original',  'Philadelphia',  '200 g', 'd', 'd', 3, 250, 23.0, 15.0, 3.0,  3.0,  0,    5.5, 0.80, '{"en:vegetarian"}', '{Milch}',          'Frischkäse, MILCH, Salz, Stabilisatoren',                '{Käse,Frischkäse}',  now()),
('8000430130737', 'Mozzarella',             'Galbani',       '125 g', 'd', 'c', 1, 253, 18.5, 12.7, 0.7,  0.7,  0,   18.7, 0.50, '{"en:vegetarian"}', '{Milch}',          'Pasteurisierte MILCH, Salz, Lab',                        '{Käse,Mozzarella}',  now()),
('4025500157104', 'Magerquark',             'Müller',        '500 g', 'a', 'a', 1,  67,  0.3,  0.2, 4.0,  4.0,  0,   12.0, 0.10, '{"en:vegetarian","de:ohne-gentechnik"}', '{Milch}',          'Pasteurisierte entrahmte MILCH, Lab',                    '{Quark}',            now()),
('5000159484374', 'Kerrygold Butter',       'Kerrygold',     '250 g', 'e', 'c', 2, 744, 82.0, 54.0, 0.6,  0.6,  0,    0.7, 0.04, '{"en:vegetarian"}', '{Milch}',          'Sahnebutter aus irischer Weidemilch',                    '{Butter}',           now()),

-- Fruits & Veg (no EAN for loose produce — skip)

-- Meat & Fish
('4000405084106', 'Hähnchenbrustfilet',     'Wiesenhof',     '500 g', 'a', 'c', 1, 105,  1.3,  0.3, 0.0,  0.0,  0,   23.1, 0.30, '{"en:initiative-tierwohl","en:gluten-free"}', '{}',               'Hähnchenbrust',                                          '{Fleisch,Geflügel}', now()),
('4005500052029', 'Thunfisch in Wasser',    'Rio Mare',      '185 g', 'a', 'd', 1, 103,  0.8,  0.3, 0.0,  0.0,  0,   23.5, 1.10, '{"en:msc","en:gluten-free"}', '{Fisch}',       'Thunfisch, Wasser, Salz',                                '{Fisch,Thunfisch}',  now()),
('4003171036255', 'Kochschinken',           'Herta',         '200 g', 'c', 'c', 4, 107,  3.0,  1.1, 1.0,  0.5,  0,   18.0, 2.20, '{"en:gluten-free"}', '{}',               'Schweinefleisch, Wasser, Salz, Gewürze, Dextrose',       '{Fleisch,Schinken}', now()),

-- Drinks
('3068320114804', 'Evian Mineralwasser',    'Evian',         '1.5 L', 'a', 'a', 1,   0,  0.0,  0.0, 0.0,  0.0,  0,    0.0, 0.01, '{}', '{}',               'Natürliches Mineralwasser',                              '{Wasser}',           now()),
('5449000000996', 'Coca-Cola',              'Coca-Cola',     '2 L',   'e', 'd', 4,  42,  0.0,  0.0,10.6, 10.6,  0,    0.0, 0.00, '{"en:vegan","en:vegetarian","en:gluten-free"}', '{}',               'Wasser, Zucker, Kohlensäure, Farbstoff, Aroma, Koffein', '{Getränke,Cola}',    now()),
('4002051008471', 'Grüntee-Beutel',         'Teekanne',      '20 St', 'a', 'a', 1,   1,  0.0,  0.0, 0.0,  0.0,  0,    0.2, 0.00, '{"en:vegan","en:gluten-free"}', '{}',               'Grüner Tee',                                             '{Tee}',              now()),
('8000070038127', 'Kaffeebohnen Espresso',  'Lavazza',       '500 g', 'a', 'd', 1,   2,  0.0,  0.0, 0.0,  0.0,  0,    0.3, 0.00, '{"en:rainforest-alliance","en:vegan"}', '{}', 'Röstkaffee',                                      '{Kaffee}',           now()),

-- Bread & Grains
('4000281700701', 'Vollkornbrot',           'Mestemacher',   '500 g', 'a', 'a', 1, 196,  1.3,  0.2,35.0,  3.5, 8.0,   6.8, 1.10, '{"en:whole-grain","en:vegan"}', '{Weizen}', 'Roggenvollkornschrot, Wasser, Salz, Hefe',               '{Brot,Vollkorn}',    now()),
('5050083407642', 'Cornflakes',             'Kellogg''s',    '375 g', 'b', 'c', 4, 378,  0.9,  0.2,84.0,  8.0, 3.0,   7.0, 1.13, '{"en:vegetarian"}', '{Weizen}',         'Mais, Zucker, Salz, Gerstenmalz, Vitamine',              '{Cerealien}',        now()),
('8076809513388', 'Penne Rigate',           'Barilla',       '500 g', 'a', 'a', 1, 359,  1.5,  0.5,71.0,  3.5, 3.0,  12.5, 0.01, '{"en:vegan","en:vegetarian"}', '{Weizen}',         'HARTWEIZENgriess',                                       '{Pasta}',            now()),

-- Snacks & Sweets
('7622300489434', 'Vollmilch-Schokolade',   'Milka',         '100 g', 'e', 'd', 4, 530, 30.0, 18.0,58.0, 56.0, 1.0,   6.2, 0.36, '{"en:vegetarian","en:rainforest-alliance"}', '{Milch,Soja}',     'Zucker, Kakaobutter, MAGERMILCHPULVER, Kakaomasse',      '{Schokolade}',       now()),
('5000159461122', 'Chips Original',         'Lay''s',        '175 g', 'e', 'd', 3, 536, 33.0,  3.0,52.0,  0.5, 4.5,   6.0, 1.50, '{"en:vegan","en:gluten-free"}', '{}',               'Kartoffeln, Sonnenblumenöl, Salz',                       '{Chips}',            now()),
('4001475104008', 'Goldbären',              'Haribo',        '200 g', 'd', 'd', 4, 343,  0.5,  0.1,77.0, 46.0, 0,     6.9, 0.02, '{"en:gluten-free"}', '{}',               'Glukosesirup, Zucker, Gelatine, Säuerungsmittel',        '{Fruchtgummi}',      now()),
('80051828',      'Nutella',                'Nutella',       '400 g', 'e', 'd', 4, 539, 30.9, 10.6,57.5, 56.3, 0,     6.3, 0.11, '{"en:vegetarian"}', '{Milch,Haselnuss}', 'Zucker, Palmöl, HASELNÜSSE, MAGERMILCHPULVER, Kakao',    '{Aufstrich}',        now()),

-- Frozen
('4001724819608', 'Pizza Margherita TK',    'Dr. Oetker',    '1 St',  'd', 'c', 4, 230, 10.0,  4.5,26.0,  4.0, 1.5,   8.5, 1.30, '{"en:vegetarian"}', '{Weizen,Milch}',   'Weizenmehl, Tomaten, Mozzarella, Wasser, Öl',            '{Pizza}',            now()),
('4250548900010', 'Fischstäbchen',          'Iglo',          '400 g', 'b', 'c', 3, 193,  9.0,  0.8,17.0,  0.5, 0.8,  11.3, 0.65, '{"en:msc"}', '{Weizen,Fisch}', 'Alaska-Seelachsfilet, Panade, Pflanzenöl',               '{Fischstäbchen}',    now()),

-- Ready Meals
('1357924680135', 'Hummus Natur',           'Alnatura',      '200 g', 'b', 'a', 2, 245, 15.0,  1.6,15.0,  0.4, 5.0,   8.0, 1.00, '{"en:organic","en:eu-organic","en:vegan","de:bio-siegel","de:bioland"}', '{}',      'KICHERERBSEN, Sesammus, Olivenöl, Zitronensaft, Salz',  '{Hummus}',           now()),

-- Condiments
('87157256',      'Heinz Ketchup',          'Heinz',         '500 ml','d', 'c', 4, 112,  0.1,  0.0,26.0, 23.0, 0.5,   1.2, 1.80, '{"en:vegan","en:gluten-free"}', '{}',               'Tomaten, Zucker, Essig, Salz, Gewürze',                  '{Ketchup}',          now()),
('8715700110004', 'Sojasauce',              'Kikkoman',      '250 ml','c', 'b', 2,  60,  0.0,  0.0, 5.0,  2.0, 0,    10.0,14.40, '{"en:vegan","en:vegetarian"}', '{Soja,Weizen}',    'Wasser, SOJABOHNEN, WEIZEN, Salz',                       '{Sojasauce}',        now()),
('08553600710', 'Sriracha Sauce',         'Huy Fong',      '435 ml','d', 'c', 4,  93,  0.8,  0.1,18.5, 15.0, 0.5,   2.0, 3.30, '{"en:vegan","en:gluten-free"}', '{}',               'Chili, Zucker, Salz, Knoblauch, Essig',                  '{Chilisauce}',       now())
on conflict (ean) do nothing;

-- =============================================================================
-- UPDATE product_entries with nutriscore, store_id (random assignment)
-- =============================================================================

-- Pantry items: assign nutriscore based on product name
update public.product_entries set nutriscore = 'c', nova_group = 1
where status = 'in_pantry' and name like '%Milch%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'd', nova_group = 3
where status = 'in_pantry' and name like '%Frischkäse%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'd', nova_group = 1
where status = 'in_pantry' and name like '%Mozzarella%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status = 'in_pantry' and name like '%Magerquark%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status = 'in_pantry' and name like '%Karotten%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status = 'in_pantry' and name like '%Spinat%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status = 'in_pantry' and name like '%Zitronen%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status = 'in_pantry' and name like '%Brokkoli%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status = 'in_pantry' and name like '%Erdbeeren%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status = 'in_pantry' and name like '%Haferflocken%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'e', nova_group = 4
where status in ('in_pantry','listed') and name like '%Schokolade%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'e', nova_group = 4
where status in ('in_pantry','listed') and name like '%Coca-Cola%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'e', nova_group = 3
where status in ('in_pantry','listed') and name like '%Chips%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'e', nova_group = 4
where status in ('in_pantry','listed') and name like '%Nutella%' or name like '%Nougat%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'd', nova_group = 4
where status in ('in_pantry','listed') and name like '%Pizza%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'b', nova_group = 3
where status in ('in_pantry','listed') and name like '%Fischstäbchen%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status in ('in_pantry','listed') and name like '%Penne%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'a', nova_group = 1
where status in ('in_pantry','listed') and name like '%Vollkornbrot%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'c', nova_group = 2
where status in ('in_pantry','listed') and name like '%Sojasauce%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'd', nova_group = 4
where status in ('in_pantry','listed') and name like '%Ketchup%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'd', nova_group = 4
where status in ('in_pantry','listed') and name like '%Goldbären%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'b', nova_group = 4
where status in ('in_pantry','listed') and name like '%Cornflakes%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update public.product_entries set nutriscore = 'b', nova_group = 2
where status in ('in_pantry','listed') and name like '%Hummus%' and user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Assign a random store to each entry (no relation to category)
update public.product_entries
set store_id = (
    array[
        'cccccccc-cccc-cccc-cccc-cccccccccc01',
        'cccccccc-cccc-cccc-cccc-cccccccccc02',
        'cccccccc-cccc-cccc-cccc-cccccccccc03',
        'cccccccc-cccc-cccc-cccc-cccccccccc04',
        'cccccccc-cccc-cccc-cccc-cccccccccc05',
        'cccccccc-cccc-cccc-cccc-cccccccccc06',
        'cccccccc-cccc-cccc-cccc-cccccccccc07'
    ]
)[1 + floor(random() * 7)::int]::uuid
where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Assign random ratings (1–5) to ~70% of entries
update public.product_entries
set rating = (1 + floor(random() * 5)::int)
where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  and random() < 0.7;
-- Attach all dummy entries to the test household so the household-scoped
-- queries in useProductEntries return them for the dev-login user.
update public.product_entries
set household_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
-- (EAN linkage is now inline in INSERT statements above)
