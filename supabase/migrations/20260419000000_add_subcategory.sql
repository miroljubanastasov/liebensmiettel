-- Add category + subcategory columns to products table (product_entries already has category)
ALTER TABLE products        ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE products        ADD COLUMN IF NOT EXISTS subcategory text;
ALTER TABLE product_entries ADD COLUMN IF NOT EXISTS subcategory text;
