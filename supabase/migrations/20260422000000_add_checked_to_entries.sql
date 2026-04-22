-- Add `checked` flag to product_entries for marking listed items as purchased
-- (ticked off on the shopping list) before they are moved to pantry or deleted.
alter table public.product_entries
    add column if not exists checked boolean not null default false;

create index if not exists idx_product_entries_checked
    on public.product_entries (user_id, status, checked);
