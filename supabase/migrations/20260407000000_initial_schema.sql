-- Products from Open Food Facts (all OFF fields nullable)
create table if not exists public.products (
  ean           text primary key,
  name          text,
  brand         text,
  quantity      text,
  image_url     text,
  categories    text[],
  labels        text[],
  ingredients   text,
  nutriscore    char(1),
  ecoscore      char(1),
  nova_group    smallint,
  energy_kcal   numeric,
  fat_g         numeric,
  carbs_g       numeric,
  protein_g     numeric,
  -- our own enrichment
  category      text,
  category_source text,          -- 'off' | 'keyword' | 'fallback'
  off_complete  boolean default false,
  fetched_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- User shopping list
create table if not exists public.grocery_list_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  ean           text references public.products(ean),
  name          text not null,           -- fallback if ean unknown
  quantity      integer default 1,
  unit          text,                    -- 'g', 'ml', 'pcs'
  checked       boolean default false,
  notes         text,
  created_at    timestamptz default now()
);

-- Home inventory
create table if not exists public.inventory_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  ean           text references public.products(ean),
  name          text not null,
  quantity       numeric default 1,
  unit          text,
  expiry_date   date,
  opened_at     date,
  location      text,                    -- 'fridge', 'pantry', 'freezer'
  source        text default 'manual',   -- 'receipt' | 'barcode' | 'manual'
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Receipt uploads
create table if not exists public.receipts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  store_name    text,
  store_city    text,
  total_amount  numeric,
  purchase_date date,
  image_path    text,                    -- path in Supabase Storage
  raw_text      text,                    -- OCR output
  parsed_json   jsonb,                   -- Claude structured output
  status        text default 'pending',  -- 'pending' | 'processed' | 'failed'
  created_at    timestamptz default now()
);

-- Price observations (crowdsourced from receipts)
create table if not exists public.price_observations (
  id            uuid primary key default gen_random_uuid(),
  ean           text references public.products(ean) not null,
  user_id       uuid references auth.users(id) on delete set null,
  receipt_id    uuid references public.receipts(id) on delete set null,
  store_name    text not null,
  store_city    text,
  price         numeric not null,
  quantity_text text,                    -- "400g" — for unit price calc
  unit_price    numeric,                 -- price per 100g/ml
  observed_at   timestamptz default now()
);

-- Row Level Security
alter table public.grocery_list_items enable row level security;
alter table public.inventory_items enable row level security;
alter table public.receipts enable row level security;
alter table public.price_observations enable row level security;

-- RLS policies: users can only see their own data
create policy "Users see own grocery list" on public.grocery_list_items
  for all using (auth.uid() = user_id);

create policy "Users see own inventory" on public.inventory_items
  for all using (auth.uid() = user_id);

create policy "Users see own receipts" on public.receipts
  for all using (auth.uid() = user_id);

-- Price observations readable by all authenticated users (community data flywheel)
create policy "Auth users can read prices" on public.price_observations
  for select using (auth.role() = 'authenticated');

create policy "Users can insert their prices" on public.price_observations
  for insert with check (auth.uid() = user_id);

-- Products table is public read
alter table public.products enable row level security;
create policy "Products are publicly readable" on public.products
  for select using (true);
create policy "Auth users can upsert products" on public.products
  for all using (auth.role() = 'authenticated');
