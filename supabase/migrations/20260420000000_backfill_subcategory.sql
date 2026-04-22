-- ============================================================================
-- Backfill category + subcategory on the `products` table.
--
-- The categories column contains either:
--   A) OFF taxonomy tags: {'en:dairies','en:yogurts'}
--   B) German keywords from seed/scripts: '{Milch}', '{Käse,Frischkäse}'
--
-- This migration handles BOTH formats using array overlap (&&) checks.
-- ============================================================================

-- Helper: convert categories array to a single lowercase string for keyword matching
-- We use this for German keyword fallback when OFF tags aren't present.

-- Step 1: Backfill products.category
UPDATE products SET category = sub.cat
FROM (
    SELECT p.ean,
        CASE
            -- === OFF taxonomy tags (en:*) ===
            -- Baby Food (highest priority)
            WHEN p.categories && ARRAY['en:baby-foods','en:infant-formulas','en:baby-cereals','en:baby-snacks','en:baby-drinks'] THEN 'Baby Food'
            -- Dairy & Eggs
            WHEN p.categories && ARRAY['en:dairies','en:dairy-products','en:milks','en:cheeses','en:yogurts','en:eggs','en:butters','en:creams','en:quark','en:kefirs','en:fermented-milk-products'] THEN 'Dairy & Eggs'
            -- Meat & Fish
            WHEN p.categories && ARRAY['en:meats','en:red-meats','en:white-meats','en:poultry','en:fishes','en:seafood','en:sausages','en:cold-cuts','en:hams','en:delicatessen'] THEN 'Meat & Fish'
            -- Fruits & Veg
            WHEN p.categories && ARRAY['en:fruits','en:fresh-fruits','en:vegetables','en:fresh-vegetables','en:legumes','en:nuts','en:mushrooms','en:herbs','en:seeds','en:salads'] THEN 'Fruits & Veg'
            -- Frozen
            WHEN p.categories && ARRAY['en:frozen-foods','en:frozen-meals','en:frozen-pizzas'] THEN 'Frozen'
            -- Bread & Grains
            WHEN p.categories && ARRAY['en:breads','en:pastas','en:rices','en:cereals','en:breakfast-cereals','en:flours','en:oats','en:tortillas'] THEN 'Bread & Grains'
            -- Ready Meals
            WHEN p.categories && ARRAY['en:meals','en:prepared-meals','en:soups','en:pizzas','en:sandwiches'] THEN 'Ready Meals'
            -- Condiments
            WHEN p.categories && ARRAY['en:sauces','en:condiments','en:oils','en:spices','en:sugars','en:vinegars','en:honeys','en:jams','en:bouillons'] THEN 'Condiments'
            -- Snacks & Sweets
            WHEN p.categories && ARRAY['en:chocolates','en:biscuits','en:chips-and-crisps','en:candies','en:ice-creams','en:confectioneries','en:snacks'] THEN 'Snacks & Sweets'
            -- Drinks
            WHEN p.categories && ARRAY['en:beverages','en:waters','en:fruit-juices','en:sodas','en:coffees','en:teas','en:beers','en:wines','en:spirits','en:plant-based-beverages'] THEN 'Drinks'

            -- === German keywords (seed data / scripts) ===
            WHEN p.categories && ARRAY['Baby','Babynahrung'] THEN 'Baby Food'
            WHEN p.categories && ARRAY['Milch','Käse','Frischkäse','Mozzarella','Quark','Joghurt','Butter','Sahne','Eier'] THEN 'Dairy & Eggs'
            WHEN p.categories && ARRAY['Fleisch','Geflügel','Fisch','Thunfisch','Schinken','Wurst','Lachs','Garnelen'] THEN 'Meat & Fish'
            WHEN p.categories && ARRAY['Obst','Gemüse','Salat','Pilze','Kräuter','Nüsse'] THEN 'Fruits & Veg'
            WHEN p.categories && ARRAY['Tiefkühl','TK','Fischstäbchen'] THEN 'Frozen'
            WHEN p.categories && ARRAY['Brot','Vollkorn','Pasta','Nudeln','Reis','Cerealien','Mehl'] THEN 'Bread & Grains'
            WHEN p.categories && ARRAY['Pizza','Fertiggericht','Hummus','Suppe'] THEN 'Ready Meals'
            WHEN p.categories && ARRAY['Ketchup','Senf','Sojasauce','Chilisauce','Öl','Essig','Gewürz','Soße','Aufstrich'] THEN 'Condiments'
            WHEN p.categories && ARRAY['Schokolade','Chips','Fruchtgummi','Kekse','Eis','Süßigkeit'] THEN 'Snacks & Sweets'
            WHEN p.categories && ARRAY['Wasser','Getränke','Cola','Saft','Tee','Kaffee','Bier','Wein'] THEN 'Drinks'
            ELSE NULL
        END AS cat
    FROM products p
    WHERE p.categories IS NOT NULL
      AND array_length(p.categories, 1) > 0
) sub
WHERE products.ean = sub.ean
  AND products.category IS NULL
  AND sub.cat IS NOT NULL;

-- Step 2: Backfill products.subcategory (more specific)
UPDATE products SET subcategory = sub.subcat
FROM (
    SELECT p.ean,
        CASE
            -- === OFF taxonomy tags ===
            -- Baby Food
            WHEN p.categories && ARRAY['en:infant-formulas']        THEN 'Baby-Milchnahrung'
            WHEN p.categories && ARRAY['en:baby-cereals']           THEN 'Baby-Brei'
            WHEN p.categories && ARRAY['en:baby-snacks']            THEN 'Baby-Snacks'
            WHEN p.categories && ARRAY['en:baby-drinks']            THEN 'Baby-Getränke & Sonstiges'
            -- Dairy specific
            WHEN p.categories && ARRAY['en:fresh-cheeses','en:cream-cheeses'] THEN 'Käse — Frischkäse & Aufstrich'
            WHEN p.categories && ARRAY['en:hard-cheeses']           THEN 'Käse — Schnitt- & Hartkäse'
            WHEN p.categories && ARRAY['en:soft-cheeses']           THEN 'Käse — Weichkäse'
            WHEN p.categories && ARRAY['en:blue-cheeses']           THEN 'Käse — Sonstiges'
            WHEN p.categories && ARRAY['en:processed-cheeses']      THEN 'Käse — Sonstiges'
            WHEN p.categories && ARRAY['en:cheeses']                THEN 'Käse — Schnitt- & Hartkäse'
            WHEN p.categories && ARRAY['en:yogurts']                THEN 'Joghurt'
            WHEN p.categories && ARRAY['en:quark','en:fromage-frais'] THEN 'Quark'
            WHEN p.categories && ARRAY['en:kefirs','en:fermented-milk-products'] THEN 'Fermentierte Milch'
            WHEN p.categories && ARRAY['en:milks']                  THEN 'Milch'
            WHEN p.categories && ARRAY['en:butters']                THEN 'Butter & Margarine'
            WHEN p.categories && ARRAY['en:creams','en:sour-creams','en:whipping-creams'] THEN 'Sahne & Crème'
            WHEN p.categories && ARRAY['en:eggs','en:egg-products'] THEN 'Eier'
            -- Fruits & Veg
            WHEN p.categories && ARRAY['en:dried-fruits']           THEN 'Trockenfrüchte'
            WHEN p.categories && ARRAY['en:legumes','en:beans','en:lentils','en:chickpeas'] THEN 'Hülsenfrüchte (trocken & Dose)'
            WHEN p.categories && ARRAY['en:peas']                   THEN 'Gemüse — Hülsenfrüchte & Mais'
            WHEN p.categories && ARRAY['en:mushrooms']              THEN 'Pilze'
            WHEN p.categories && ARRAY['en:nuts','en:seeds']        THEN 'Nüsse & Kerne'
            WHEN p.categories && ARRAY['en:herbs']                  THEN 'Frische Kräuter'
            WHEN p.categories && ARRAY['en:salads']                 THEN 'Gemüse — Blattsalate & Grün'
            WHEN p.categories && ARRAY['en:root-vegetables']        THEN 'Gemüse — Wurzelgemüse'
            WHEN p.categories && ARRAY['en:leafy-vegetables']       THEN 'Gemüse — Blattsalate & Grün'
            WHEN p.categories && ARRAY['en:fruits','en:fresh-fruits'] THEN 'Frisches Obst — Sonstiges'
            WHEN p.categories && ARRAY['en:vegetables','en:fresh-vegetables'] THEN 'Gemüse — Sonstiges'
            -- Meat & Fish
            WHEN p.categories && ARRAY['en:poultry','en:white-meats'] THEN 'Geflügel'
            WHEN p.categories && ARRAY['en:red-meats']              THEN 'Rindfleisch'
            WHEN p.categories && ARRAY['en:smoked-fish']            THEN 'Fisch aus der Dose / geräuchert'
            WHEN p.categories && ARRAY['en:canned-fish']            THEN 'Fisch aus der Dose / geräuchert'
            WHEN p.categories && ARRAY['en:fishes','en:fat-fishes'] THEN 'Frischer Fisch'
            WHEN p.categories && ARRAY['en:crustaceans','en:molluscs','en:seafood'] THEN 'Meeresfrüchte'
            WHEN p.categories && ARRAY['en:sausages','en:cold-cuts','en:hams','en:delicatessen'] THEN 'Aufschnitt & Wurstwaren'
            -- Drinks
            WHEN p.categories && ARRAY['en:waters','en:sparkling-waters','en:mineral-waters'] THEN 'Wasser'
            WHEN p.categories && ARRAY['en:fruit-juices','en:vegetable-juices','en:nectars'] THEN 'Saft'
            WHEN p.categories && ARRAY['en:colas','en:sodas','en:soft-drinks'] THEN 'Schorle & Limonaden'
            WHEN p.categories && ARRAY['en:energy-drinks','en:sports-drinks'] THEN 'Sonstige Getränke'
            WHEN p.categories && ARRAY['en:coffees']                THEN 'Kaffee'
            WHEN p.categories && ARRAY['en:teas','en:herbal-teas']  THEN 'Tee'
            WHEN p.categories && ARRAY['en:beers']                  THEN 'Bier'
            WHEN p.categories && ARRAY['en:wines']                  THEN 'Wein & Sekt'
            WHEN p.categories && ARRAY['en:spirits']                THEN 'Spirituosen'
            WHEN p.categories && ARRAY['en:soy-milks','en:oat-milks','en:almond-milks','en:plant-based-beverages'] THEN 'Pflanzenmilch'
            -- Bread & Grains
            WHEN p.categories && ARRAY['en:breads','en:sliced-breads'] THEN 'Brot'
            WHEN p.categories && ARRAY['en:rolls']                  THEN 'Brötchen & Kleingebäck'
            WHEN p.categories && ARRAY['en:pastas']                 THEN 'Nudeln'
            WHEN p.categories && ARRAY['en:rices']                  THEN 'Reis'
            WHEN p.categories && ARRAY['en:breakfast-cereals','en:oats'] THEN 'Frühstückscerealien'
            WHEN p.categories && ARRAY['en:flours']                 THEN 'Mehl'
            WHEN p.categories && ARRAY['en:tortillas','en:pizza-doughs'] THEN 'Fladenbrot, Wraps & Spezialbrote'
            -- Snacks & Sweets
            WHEN p.categories && ARRAY['en:chocolates','en:chocolate-confectioneries'] THEN 'Schokolade'
            WHEN p.categories && ARRAY['en:biscuits','en:biscuits-and-cakes'] THEN 'Kekse & Gebäck'
            WHEN p.categories && ARRAY['en:chips-and-crisps','en:salty-snacks'] THEN 'Salzige Snacks'
            WHEN p.categories && ARRAY['en:candies','en:confectioneries'] THEN 'Süßigkeiten'
            WHEN p.categories && ARRAY['en:ice-creams','en:frozen-desserts'] THEN 'Eis'
            -- Condiments
            WHEN p.categories && ARRAY['en:sauces','en:ketchups','en:mustards','en:mayonnaises'] THEN 'Tischsoßen'
            WHEN p.categories && ARRAY['en:dressings']              THEN 'Salatdressing'
            WHEN p.categories && ARRAY['en:olive-oils','en:sunflower-oils','en:oils'] THEN 'Speiseöle'
            WHEN p.categories && ARRAY['en:vinegars']               THEN 'Essig'
            WHEN p.categories && ARRAY['en:spices','en:salt']       THEN 'Gewürze (getrocknet)'
            WHEN p.categories && ARRAY['en:sugars','en:sweeteners'] THEN 'Zucker & Süßungsmittel'
            WHEN p.categories && ARRAY['en:honeys','en:jams','en:marmalades','en:spreads'] THEN 'Marmelade & Aufstrich'
            WHEN p.categories && ARRAY['en:bouillons','en:broths']  THEN 'Brühe, Fond & Kochhilfen'

            -- === German keywords (seed data) ===
            WHEN p.categories && ARRAY['Frischkäse']   THEN 'Käse — Frischkäse & Aufstrich'
            WHEN p.categories && ARRAY['Mozzarella']    THEN 'Käse — Italienisch'
            WHEN p.categories && ARRAY['Käse']          THEN 'Käse — Schnitt- & Hartkäse'
            WHEN p.categories && ARRAY['Joghurt']       THEN 'Joghurt'
            WHEN p.categories && ARRAY['Quark']         THEN 'Quark'
            WHEN p.categories && ARRAY['Milch']         THEN 'Milch'
            WHEN p.categories && ARRAY['Butter']        THEN 'Butter & Margarine'
            WHEN p.categories && ARRAY['Sahne']         THEN 'Sahne & Crème'
            WHEN p.categories && ARRAY['Eier']          THEN 'Eier'
            WHEN p.categories && ARRAY['Geflügel']      THEN 'Geflügel'
            WHEN p.categories && ARRAY['Schinken']      THEN 'Aufschnitt & Wurstwaren'
            WHEN p.categories && ARRAY['Wurst']         THEN 'Aufschnitt & Wurstwaren'
            WHEN p.categories && ARRAY['Thunfisch']     THEN 'Fisch aus der Dose / geräuchert'
            WHEN p.categories && ARRAY['Lachs']         THEN 'Frischer Fisch'
            WHEN p.categories && ARRAY['Fisch']         THEN 'Frischer Fisch'
            WHEN p.categories && ARRAY['Garnelen']      THEN 'Meeresfrüchte'
            WHEN p.categories && ARRAY['Fleisch']       THEN 'Rindfleisch'
            WHEN p.categories && ARRAY['Wasser']        THEN 'Wasser'
            WHEN p.categories && ARRAY['Cola']          THEN 'Schorle & Limonaden'
            WHEN p.categories && ARRAY['Saft']          THEN 'Saft'
            WHEN p.categories && ARRAY['Tee']           THEN 'Tee'
            WHEN p.categories && ARRAY['Kaffee']        THEN 'Kaffee'
            WHEN p.categories && ARRAY['Bier']          THEN 'Bier'
            WHEN p.categories && ARRAY['Wein']          THEN 'Wein & Sekt'
            WHEN p.categories && ARRAY['Getränke']      THEN 'Sonstige Getränke'
            WHEN p.categories && ARRAY['Brot','Vollkorn'] THEN 'Brot'
            WHEN p.categories && ARRAY['Pasta','Nudeln'] THEN 'Nudeln'
            WHEN p.categories && ARRAY['Reis']          THEN 'Reis'
            WHEN p.categories && ARRAY['Cerealien']     THEN 'Frühstückscerealien'
            WHEN p.categories && ARRAY['Mehl']          THEN 'Mehl'
            WHEN p.categories && ARRAY['Schokolade']    THEN 'Schokolade'
            WHEN p.categories && ARRAY['Chips']         THEN 'Salzige Snacks'
            WHEN p.categories && ARRAY['Fruchtgummi']   THEN 'Süßigkeiten'
            WHEN p.categories && ARRAY['Aufstrich']     THEN 'Marmelade & Aufstrich'
            WHEN p.categories && ARRAY['Kekse']         THEN 'Kekse & Gebäck'
            WHEN p.categories && ARRAY['Eis']           THEN 'Eis'
            WHEN p.categories && ARRAY['Pizza']         THEN 'TK-Fertiggerichte'
            WHEN p.categories && ARRAY['Fischstäbchen'] THEN 'TK-Fisch'
            WHEN p.categories && ARRAY['Hummus']        THEN 'Dips & Aufstriche (herzhaft)'
            WHEN p.categories && ARRAY['Ketchup']       THEN 'Tischsoßen'
            WHEN p.categories && ARRAY['Sojasauce']     THEN 'Asiatische Soßen & Pasten'
            WHEN p.categories && ARRAY['Chilisauce']    THEN 'Asiatische Soßen & Pasten'
            ELSE NULL
        END AS subcat
    FROM products p
    WHERE p.categories IS NOT NULL
      AND array_length(p.categories, 1) > 0
) sub
WHERE products.ean = sub.ean
  AND products.subcategory IS NULL
  AND sub.subcat IS NOT NULL;

-- Step 3: Backfill product_entries from products table (for entries with EAN)
UPDATE product_entries pe
SET category    = COALESCE(pe.category, pr.category),
    subcategory = COALESCE(pe.subcategory, pr.subcategory)
FROM products pr
WHERE pe.ean = pr.ean
  AND pe.ean IS NOT NULL
  AND (pe.category IS NULL OR pe.subcategory IS NULL)
  AND (pr.category IS NOT NULL OR pr.subcategory IS NOT NULL);
