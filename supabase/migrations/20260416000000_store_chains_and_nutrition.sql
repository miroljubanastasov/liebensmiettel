-- =============================================================================
-- Store chains + product nutrition on entries
-- =============================================================================

-- ---------------------------------------------------------------------------
-- STORE CHAINS — fixed catalogue of German retail chains
-- ---------------------------------------------------------------------------
create table public.store_chains (
    id          text primary key,           -- slug: 'lidl', 'edeka', 'rewe', …
    name        text not null,
    logo_url    text,
    country     text not null default 'DE',
    color       text,                       -- brand hex colour for UI
    created_at  timestamptz not null default now()
);

-- Add chain_id FK to stores
alter table public.stores
    add column chain_id text references public.store_chains(id) on delete set null;

-- Backfill chain_id from existing chain text where possible
update public.stores set chain_id = lower(chain) where chain is not null;

-- ---------------------------------------------------------------------------
-- Nutrition snapshot on product_entries (denormalized from products for
-- offline / fast display — authoritative data stays in products table)
-- ---------------------------------------------------------------------------
alter table public.product_entries
    add column nutriscore   text,           -- a–e
    add column nova_group   smallint,       -- 1–4
    add column ecoscore     text;           -- a–e
