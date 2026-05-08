-- =============================================================================
-- store_chains: add kind / defunct / aliases columns referenced by seed.sql
-- =============================================================================
alter table public.store_chains
    add column if not exists kind     text,
    add column if not exists defunct  boolean not null default false,
    add column if not exists aliases  text[]  not null default '{}';
