-- =============================================================================
-- Liebensmittel — Initial Schema
-- =============================================================================
-- Tables:
--   1. profiles        — app users (extends auth.users)
--   2. households       — household groups
--   3. household_members — family members (non-auth people in the household)
--   4. household_invites — invite links to join a household
--   5. stores           — community store directory
--   6. products         — canonical product data (EAN lookup + OFF cache)
--   7. product_entries  — unified lifecycle ledger (list → basket → pantry → consumed)
--   8. product_reviews  — per-user structured reviews
--   9. price_observations — crowdsourced price intelligence
--  10. receipts         — uploaded receipt images + OCR
--  11. receipt_items    — parsed line items from receipts
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES
-- ---------------------------------------------------------------------------
create table public.profiles (
    id          uuid primary key references auth.users(id) on delete cascade,
    email       text,
    name        text,
    avatar_url  text,
    household_id uuid,                         -- FK added after households exists
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
    insert into public.profiles (id, email, name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
    );
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. HOUSEHOLDS
-- ---------------------------------------------------------------------------
create table public.households (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    created_by  uuid references auth.users(id) on delete set null,
    created_at  timestamptz not null default now()
);

-- Now add the FK from profiles → households
alter table public.profiles
    add constraint profiles_household_id_fkey
    foreign key (household_id) references public.households(id) on delete set null;

-- Helper: get household_id for a given user
create or replace function public.user_household_id(uid uuid)
returns uuid language sql stable security definer set search_path = ''
as $$
    select household_id from public.profiles where id = uid;
$$;

-- ---------------------------------------------------------------------------
-- 3. HOUSEHOLD MEMBERS (family members, not auth users)
-- ---------------------------------------------------------------------------
create table public.household_members (
    id              uuid primary key default gen_random_uuid(),
    household_id    uuid not null references public.households(id) on delete cascade,
    name            text not null,
    gender          text,               -- 'male', 'female', 'other', null
    birth_year      int,
    recorded_at     timestamptz,        -- when this info was last confirmed
    created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. HOUSEHOLD INVITES
-- ---------------------------------------------------------------------------
create table public.household_invites (
    id              uuid primary key default gen_random_uuid(),
    household_id    uuid not null references public.households(id) on delete cascade,
    email           text not null,
    invited_by      uuid not null references auth.users(id) on delete cascade,
    status          text not null default 'pending'
                        check (status in ('pending', 'accepted', 'declined')),
    created_at      timestamptz not null default now(),
    expires_at      timestamptz not null default (now() + interval '7 days')
);

-- ---------------------------------------------------------------------------
-- 5. STORES (community-verified)
-- ---------------------------------------------------------------------------
create table public.stores (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    chain       text,                   -- e.g. 'REWE', 'Lidl', 'Edeka'
    address     text,
    city        text,
    country     text not null default 'DE',
    logo_url    text,
    created_at  timestamptz not null default now(),
    unique (name, address)
);

-- ---------------------------------------------------------------------------
-- 6. PRODUCTS (canonical EAN lookup + OFF cache + community data)
-- ---------------------------------------------------------------------------
create table public.products (
    ean                     text primary key,

    -- Identity
    name                    text,
    brand                   text,
    quantity                text,           -- package size text, e.g. "500 ml"
    serving_size            text,
    origin                  text,

    -- Images (from OFF)
    image_url               text,
    image_ingredients_url   text,
    image_nutrition_url     text,

    -- Classification
    categories              text[],
    labels                  text[],
    allergens               text[],

    -- Scores
    nutriscore              text,           -- a–e
    ecoscore                text,           -- a–e
    nova_group              smallint,       -- 1–4

    -- Nutrients per 100 g
    energy_kcal             numeric,
    fat_g                   numeric,
    saturated_fat_g         numeric,
    carbs_g                 numeric,
    sugars_g                numeric,
    fiber_g                 numeric,
    protein_g               numeric,
    salt_g                  numeric,

    -- Ingredients
    ingredients             text,

    -- OFF metadata
    off_complete            boolean default false,
    fetched_at              timestamptz,

    -- Community corrections (user-improved data)
    community_name          text,
    community_image_url     text,

    -- Aggregated community stats (denormalized, updated by triggers/cron)
    avg_rating              numeric(3,2),       -- 1.00–5.00
    review_count            int not null default 0,
    buy_again_pct           numeric(5,2),       -- 0.00–100.00

    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 7. PRODUCT ENTRIES (unified lifecycle ledger)
-- ---------------------------------------------------------------------------
create table public.product_entries (
    id              uuid primary key default gen_random_uuid(),

    -- Ownership
    user_id         uuid references auth.users(id) on delete set null,
    household_id    uuid references public.households(id) on delete set null,

    -- Lifecycle status
    status          text not null default 'listed'
                        check (status in ('listed', 'in_basket', 'in_pantry', 'consumed')),

    -- Lifecycle timestamps
    listed_at       timestamptz,
    purchased_at    timestamptz,
    shelved_at      timestamptz,
    consumed_at     timestamptz,

    -- Entry source
    entry_source    text not null default 'manual'
                        check (entry_source in ('manual', 'receipt', 'barcode', 'list')),

    -- Product identity (soft ref — no FK to products)
    ean             text,
    name            text not null,
    brand           text,
    image_url       text,
    category        text,

    -- Quantity
    quantity        numeric not null default 1,
    unit            text not null default 'pc',

    -- Purchase data (folded from purchase_history)
    store_id        uuid references public.stores(id) on delete set null,
    price           numeric(10,2),
    unit_price      numeric(10,2),
    receipt_id      uuid,                   -- FK added after receipts table
    receipt_item_id uuid,                   -- FK added after receipt_items table

    -- Pantry data
    location        text,                   -- 'fridge', 'freezer', 'pantry', 'cellar'
    expiry_date     date,
    opened_at       date,

    -- List data
    notes           text,
    sort_order      int not null default 0,

    -- Timestamps
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- Indexes for common queries
create index idx_product_entries_household_status
    on public.product_entries (household_id, status);
create index idx_product_entries_user
    on public.product_entries (user_id);
create index idx_product_entries_ean
    on public.product_entries (ean)
    where ean is not null;
create index idx_product_entries_status
    on public.product_entries (status);
create index idx_product_entries_expiry
    on public.product_entries (expiry_date)
    where expiry_date is not null and status = 'in_pantry';

-- ---------------------------------------------------------------------------
-- 8. PRODUCT REVIEWS
-- ---------------------------------------------------------------------------
create table public.product_reviews (
    id              uuid primary key default gen_random_uuid(),
    product_ean     text,                   -- soft ref to products
    user_id         uuid references auth.users(id) on delete set null,
    household_id    uuid references public.households(id) on delete set null,
    entry_id        uuid references public.product_entries(id) on delete set null,

    rating          smallint not null check (rating between 1 and 5),
    buy_again       boolean,
    tags            text[],                 -- e.g. 'good-value', 'tasty', 'poor-quality'
    comment         text,

    created_at      timestamptz not null default now()
);

create index idx_product_reviews_ean
    on public.product_reviews (product_ean)
    where product_ean is not null;

-- ---------------------------------------------------------------------------
-- 9. PRICE OBSERVATIONS (crowdsourced)
-- ---------------------------------------------------------------------------
create table public.price_observations (
    id              uuid primary key default gen_random_uuid(),
    product_ean     text,                   -- soft ref to products
    store_id        uuid references public.stores(id) on delete set null,
    user_id         uuid references auth.users(id) on delete set null,

    price           numeric(10,2) not null,
    unit_price      numeric(10,2),
    quantity_text   text,                   -- e.g. "500 ml", "6x 0.33 L"

    observed_at     timestamptz not null default now(),
    source          text not null default 'manual'
                        check (source in ('receipt', 'manual', 'barcode')),
    entry_id        uuid references public.product_entries(id) on delete set null,

    created_at      timestamptz not null default now()
);

create index idx_price_observations_ean
    on public.price_observations (product_ean)
    where product_ean is not null;
create index idx_price_observations_store
    on public.price_observations (store_id);

-- ---------------------------------------------------------------------------
-- 10. RECEIPTS
-- ---------------------------------------------------------------------------
create table public.receipts (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid references auth.users(id) on delete cascade,
    household_id    uuid references public.households(id) on delete set null,

    image_path      text,                   -- storage path: user_id/{uuid}.ext
    store_name      text,
    store_address   text,
    store_city      text,
    purchase_date   date,
    purchase_time   time,
    total_amount    numeric(10,2),

    raw_text        text,                   -- OCR output
    parsed_json     jsonb,                  -- structured parse result

    status          text not null default 'pending'
                        check (status in ('pending', 'processed', 'failed')),
    created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 11. RECEIPT ITEMS
-- ---------------------------------------------------------------------------
create table public.receipt_items (
    id              uuid primary key default gen_random_uuid(),
    receipt_id      uuid not null references public.receipts(id) on delete cascade,

    line_text       text,                   -- raw line from receipt
    name            text,
    quantity        numeric,
    unit            text not null default 'pc',
    unit_price      numeric(10,2),
    total_price     numeric(10,2),

    ean             text,                   -- matched barcode (nullable)
    matched         boolean not null default false,

    created_at      timestamptz not null default now()
);

-- Now add FKs from product_entries → receipts/receipt_items
alter table public.product_entries
    add constraint product_entries_receipt_id_fkey
    foreign key (receipt_id) references public.receipts(id) on delete set null;

alter table public.product_entries
    add constraint product_entries_receipt_item_id_fkey
    foreign key (receipt_item_id) references public.receipt_items(id) on delete set null;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.household_invites enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.product_entries enable row level security;
alter table public.product_reviews enable row level security;
alter table public.price_observations enable row level security;
alter table public.receipts enable row level security;
alter table public.receipt_items enable row level security;

-- ── Profiles ──
create policy "Users read own profile"
    on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile"
    on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile"
    on public.profiles for insert with check (auth.uid() = id);

-- ── Households ──
create policy "Members read own household"
    on public.households for select
    using (id = public.user_household_id(auth.uid()) or created_by = auth.uid());
create policy "Authenticated create household"
    on public.households for insert
    with check (auth.uid() = created_by);
create policy "Creator updates household"
    on public.households for update
    using (created_by = auth.uid());

-- ── Household Members ──
create policy "Members read household members"
    on public.household_members for select
    using (household_id = public.user_household_id(auth.uid()));
create policy "Members manage household members"
    on public.household_members for insert
    with check (household_id = public.user_household_id(auth.uid()));
create policy "Members update household members"
    on public.household_members for update
    using (household_id = public.user_household_id(auth.uid()));
create policy "Members delete household members"
    on public.household_members for delete
    using (household_id = public.user_household_id(auth.uid()));

-- ── Household Invites ──
create policy "Inviter manages invites"
    on public.household_invites for select
    using (household_id = public.user_household_id(auth.uid()));
create policy "Inviter creates invites"
    on public.household_invites for insert
    with check (invited_by = auth.uid());
create policy "Invitee sees own invites"
    on public.household_invites for select
    using (email = (select email from auth.users where id = auth.uid()));
create policy "Invitee updates invite"
    on public.household_invites for update
    using (email = (select email from auth.users where id = auth.uid()));

-- ── Stores (community: anyone reads, authenticated insert/update) ──
create policy "Anyone reads stores"
    on public.stores for select using (true);
create policy "Authenticated insert stores"
    on public.stores for insert
    with check (auth.uid() is not null);
create policy "Authenticated update stores"
    on public.stores for update
    using (auth.uid() is not null);

-- ── Products (community: anyone reads, authenticated insert/update) ──
create policy "Anyone reads products"
    on public.products for select using (true);
create policy "Authenticated insert products"
    on public.products for insert
    with check (auth.uid() is not null);
create policy "Authenticated update products"
    on public.products for update
    using (auth.uid() is not null);

-- ── Product Entries (household-scoped) ──
create policy "Household reads entries"
    on public.product_entries for select
    using (
        household_id = public.user_household_id(auth.uid())
        or (household_id is null and user_id = auth.uid())
    );
create policy "Users insert entries"
    on public.product_entries for insert
    with check (auth.uid() = user_id);
create policy "Household updates entries"
    on public.product_entries for update
    using (
        household_id = public.user_household_id(auth.uid())
        or (household_id is null and user_id = auth.uid())
    );
create policy "Household deletes entries"
    on public.product_entries for delete
    using (
        household_id = public.user_household_id(auth.uid())
        or (household_id is null and user_id = auth.uid())
    );

-- ── Product Reviews (own + community reads) ──
create policy "Anyone reads reviews"
    on public.product_reviews for select using (true);
create policy "Users insert own reviews"
    on public.product_reviews for insert
    with check (auth.uid() = user_id);
create policy "Users update own reviews"
    on public.product_reviews for update
    using (auth.uid() = user_id);

-- ── Price Observations (community reads, authenticated insert) ──
create policy "Anyone reads prices"
    on public.price_observations for select using (true);
create policy "Authenticated insert prices"
    on public.price_observations for insert
    with check (auth.uid() is not null);

-- ── Receipts (household-scoped) ──
create policy "Household reads receipts"
    on public.receipts for select
    using (
        household_id = public.user_household_id(auth.uid())
        or (household_id is null and user_id = auth.uid())
    );
create policy "Users insert receipts"
    on public.receipts for insert
    with check (auth.uid() = user_id);
create policy "Users update own receipts"
    on public.receipts for update
    using (user_id = auth.uid());
create policy "Users delete own receipts"
    on public.receipts for delete
    using (user_id = auth.uid());

-- ── Receipt Items (access inherited from parent receipt) ──
create policy "Receipt owners read items"
    on public.receipt_items for select
    using (
        receipt_id in (
            select id from public.receipts
            where user_id = auth.uid()
               or household_id = public.user_household_id(auth.uid())
        )
    );
create policy "Receipt owners insert items"
    on public.receipt_items for insert
    with check (
        receipt_id in (select id from public.receipts where user_id = auth.uid())
    );
create policy "Receipt owners update items"
    on public.receipt_items for update
    using (
        receipt_id in (select id from public.receipts where user_id = auth.uid())
    );
create policy "Receipt owners delete items"
    on public.receipt_items for delete
    using (
        receipt_id in (select id from public.receipts where user_id = auth.uid())
    );

-- ---------------------------------------------------------------------------
-- STORAGE BUCKET: receipts
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

create policy "Users upload receipt images"
    on storage.objects for insert
    with check (
        bucket_id = 'receipts'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Users read own receipt images"
    on storage.objects for select
    using (
        bucket_id = 'receipts'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Users delete own receipt images"
    on storage.objects for delete
    using (
        bucket_id = 'receipts'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- ---------------------------------------------------------------------------
-- STORAGE BUCKET: product-images (public — anyone can view)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Anyone reads product images"
    on storage.objects for select
    using (bucket_id = 'product-images');

create policy "Authenticated upload product images"
    on storage.objects for insert
    with check (
        bucket_id = 'product-images'
        and auth.uid() is not null
    );

create policy "Authenticated update product images"
    on storage.objects for update
    using (
        bucket_id = 'product-images'
        and auth.uid() is not null
    );

-- ---------------------------------------------------------------------------
-- STORAGE BUCKET: store-logos (public — anyone can view)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('store-logos', 'store-logos', true)
on conflict (id) do nothing;

create policy "Anyone reads store logos"
    on storage.objects for select
    using (bucket_id = 'store-logos');

create policy "Authenticated upload store logos"
    on storage.objects for insert
    with check (
        bucket_id = 'store-logos'
        and auth.uid() is not null
    );

create policy "Authenticated update store logos"
    on storage.objects for update
    using (
        bucket_id = 'store-logos'
        and auth.uid() is not null
    );

-- ---------------------------------------------------------------------------
-- GRANTS (for authenticated + anon roles)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.stores to anon, authenticated;
grant insert, update on public.stores to authenticated;

grant select on public.products to anon, authenticated;
grant insert, update on public.products to authenticated;

grant select on public.price_observations to anon, authenticated;
grant insert on public.price_observations to authenticated;

grant select on public.product_reviews to anon, authenticated;
grant insert, update on public.product_reviews to authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.households to authenticated;
grant select, insert, update, delete on public.household_members to authenticated;
grant select, insert, update, delete on public.household_invites to authenticated;
grant select, insert, update, delete on public.product_entries to authenticated;
grant select, insert, update, delete on public.receipts to authenticated;
grant select, insert, update, delete on public.receipt_items to authenticated;
