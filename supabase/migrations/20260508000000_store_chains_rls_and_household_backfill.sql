-- =============================================================================
-- store_chains: enable RLS (Supabase advisor flagged this table as exposed
-- via PostgREST without RLS). The catalogue is a fixed list of public German
-- retail chains, so reads stay open to everyone; writes are restricted to
-- authenticated users (matches the policy used by the `stores` table).
-- =============================================================================

alter table public.store_chains enable row level security;

create policy "Anyone reads store_chains"
    on public.store_chains for select using (true);

create policy "Authenticated insert store_chains"
    on public.store_chains for insert
    with check (auth.uid() is not null);

create policy "Authenticated update store_chains"
    on public.store_chains for update
    using (auth.uid() is not null);

-- ---------------------------------------------------------------------------
-- Household backfill: any product_entries / receipts that were created
-- before household membership existed (or before the client started writing
-- household_id) are still attached only to the original user. Once that
-- user joins a household, share their existing rows with the household so
-- invited members actually see them.
-- ---------------------------------------------------------------------------
update public.product_entries pe
set household_id = p.household_id
from public.profiles p
where pe.user_id = p.id
  and pe.household_id is null
  and p.household_id is not null;

update public.receipts r
set household_id = p.household_id
from public.profiles p
where r.user_id = p.id
  and r.household_id is null
  and p.household_id is not null;
