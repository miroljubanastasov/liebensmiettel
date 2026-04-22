-- Add user rating (1–5 stars) directly to product_entries
alter table public.product_entries
    add column if not exists rating smallint check (rating between 1 and 5);
