-- Test user for local development
-- email: test@liebensmittel.app  password: Test1234!
insert into auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_token_current,
    phone_change_token,
    reauthentication_token
) values (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000000',
    'test@liebensmittel.app',
    crypt('Test1234!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
) on conflict (id) do nothing;

-- Identity record required by GoTrue
insert into auth.identities (
    id,
    user_id,
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
) values (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'test@liebensmittel.app',
    'email',
    '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","email":"test@liebensmittel.app"}',
    now(),
    now(),
    now()
) on conflict (id) do nothing;

-- Profile for test user (trigger may not fire on raw insert)
insert into public.profiles (id, email, name)
values (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'test@liebensmittel.app',
    'Test User'
) on conflict (id) do nothing;

-- Test household
insert into public.households (id, name, created_by)
values (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Test Household',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
) on conflict (id) do nothing;

-- Assign test user to household
update public.profiles
set household_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Sample stores
insert into public.stores (id, name, chain, city) values
    ('cccccccc-cccc-cccc-cccc-cccccccccc01', 'REWE Center', 'REWE', 'Berlin'),
    ('cccccccc-cccc-cccc-cccc-cccccccccc02', 'Lidl Mitte', 'Lidl', 'Berlin'),
    ('cccccccc-cccc-cccc-cccc-cccccccccc03', 'Edeka Markt', 'Edeka', 'Berlin')
on conflict do nothing;

-- =========================================================================
-- STORE CHAINS (German retail)
-- Generated from src/data/storeChains.js — regenerate via
--   node scripts/build-store-chains-seed.js
-- >>> STORE_CHAINS_BEGIN
insert into public.store_chains (id, name, logo_url, country, color, kind, defunct, aliases) values
    ('rewe', 'REWE', 'https://commons.wikimedia.org/w/thumb.php?f=Logo_REWE.svg&w=200', 'DE', '#cc071e', 'supermarket', false, '{"rewe","rewe markt","rewe city","rewe center","rewe to go"}'),
    ('edeka', 'EDEKA', 'https://commons.wikimedia.org/w/thumb.php?f=Edeka_Logo_Aktuell.svg&w=200', 'DE', '#fff200', 'supermarket', false, '{"edeka","e center","e-center","edeka center","nahkauf","edeka neukauf"}'),
    ('kaufland', 'Kaufland', 'https://commons.wikimedia.org/w/thumb.php?f=Kaufland_201x_logo.svg&w=200', 'DE', '#e10019', 'hypermarket', false, '{"kaufland"}'),
    ('real', 'real', 'https://commons.wikimedia.org/w/thumb.php?f=Real_Logo_Clean.svg&w=200', 'DE', '#e30613', 'hypermarket', true, '{"real","real sb warenhaus"}'),
    ('globus', 'Globus', 'https://commons.wikimedia.org/w/thumb.php?f=Globus_SB-Warenhaus_logo.svg&w=200', 'DE', '#004b87', 'hypermarket', false, '{"globus","globus sb warenhaus"}'),
    ('marktkauf', 'Marktkauf', null, 'DE', '#e30613', 'hypermarket', false, '{"marktkauf"}'),
    ('hit', 'HIT', null, 'DE', '#d40000', 'supermarket', false, '{"hit","hit markt"}'),
    ('tegut', 'tegut…', 'https://commons.wikimedia.org/w/thumb.php?f=Tegut..._logo_and_claim.svg&w=200', 'DE', '#e3000f', 'supermarket', false, '{"tegut","tegut...","tegut…"}'),
    ('famila', 'famila', null, 'DE', '#e2001a', 'supermarket', false, '{"famila","familia"}'),
    ('combi', 'Combi', null, 'DE', '#e2001a', 'supermarket', false, '{"combi","combi verbrauchermarkt"}'),
    ('wasgau', 'Wasgau', null, 'DE', '#d30013', 'supermarket', false, '{"wasgau"}'),
    ('citti', 'CITTI', null, 'DE', '#e30613', 'hypermarket', false, '{"citti","citti markt"}'),
    ('v-markt', 'V-Markt', null, 'DE', '#e30613', 'hypermarket', false, '{"v-markt","v markt","vmarkt"}'),
    ('feneberg', 'Feneberg', null, 'DE', '#e30613', 'supermarket', false, '{"feneberg"}'),
    ('lidl', 'Lidl', 'https://commons.wikimedia.org/w/thumb.php?f=Lidl-Logo.svg&w=200', 'DE', '#0050aa', 'discounter', false, '{"lidl"}'),
    ('aldi-sued', 'ALDI SÜD', 'https://commons.wikimedia.org/w/thumb.php?f=Aldi_S%C3%BCd_2017_logo.svg&w=200', 'DE', '#00005f', 'discounter', false, '{"aldi süd","aldi sued","aldi s","aldisued"}'),
    ('aldi-nord', 'ALDI Nord', 'https://commons.wikimedia.org/w/thumb.php?f=Aldi_Nord_201x_logo.svg&w=200', 'DE', '#0e3386', 'discounter', false, '{"aldi nord","aldi n","aldinord"}'),
    ('aldi', 'ALDI', null, 'DE', '#00005f', 'discounter', false, '{"aldi"}'),
    ('penny', 'Penny', 'https://commons.wikimedia.org/w/thumb.php?f=Penny-Logo.svg&w=200', 'DE', '#cd1719', 'discounter', false, '{"penny","penny markt"}'),
    ('netto', 'Netto Marken-Discount', 'https://commons.wikimedia.org/w/thumb.php?f=Netto_logo.svg&w=200', 'DE', '#ffe500', 'discounter', false, '{"netto","netto marken-discount","netto marken discount","netto md"}'),
    ('netto-dansk', 'Netto (Dansk)', null, 'DE', '#ffd500', 'discounter', false, '{"netto dansk","netto scottie","netto mit hund"}'),
    ('norma', 'Norma', 'https://commons.wikimedia.org/w/thumb.php?f=Norma_Logo.svg&w=200', 'DE', '#ee7f00', 'discounter', false, '{"norma"}'),
    ('mix-markt', 'Mix Markt', null, 'DE', '#d40000', 'discounter', false, '{"mix markt","mixmarkt"}'),
    ('alnatura', 'Alnatura', null, 'DE', '#00a651', 'bio', false, '{"alnatura","alnatura super natur markt"}'),
    ('denns', 'Denn''s Biomarkt', null, 'DE', '#f29400', 'bio', false, '{"denns","denn''s","denns biomarkt","denn''s biomarkt"}'),
    ('bio-company', 'Bio Company', null, 'DE', '#009640', 'bio', false, '{"bio company","biocompany"}'),
    ('basic', 'Basic', null, 'DE', '#76b82a', 'bio', false, '{"basic","basic bio"}'),
    ('ebl-naturkost', 'ebl-naturkost', null, 'DE', '#76b82a', 'bio', false, '{"ebl","ebl naturkost","ebl-naturkost"}'),
    ('dm', 'dm-drogerie markt', 'https://commons.wikimedia.org/w/thumb.php?f=Dm_Logo.svg&w=200', 'DE', '#00703c', 'drugstore', false, '{"dm","dm drogerie","dm-drogerie","dm-drogerie markt"}'),
    ('rossmann', 'Rossmann', 'https://commons.wikimedia.org/w/thumb.php?f=Rossmann_Logo.svg&w=200', 'DE', '#e2001a', 'drugstore', false, '{"rossmann"}'),
    ('budni', 'Budnikowsky', null, 'DE', '#ec6608', 'drugstore', false, '{"budni","budnikowsky"}'),
    ('mueller', 'Müller', null, 'DE', '#e2001a', 'drugstore', false, '{"müller","mueller","müller drogerie"}'),
    ('metro', 'Metro', null, 'DE', '#003d7a', 'cash_carry', false, '{"metro","metro c+c","metro cash carry"}'),
    ('selgros', 'Selgros', null, 'DE', '#004b87', 'cash_carry', false, '{"selgros","selgros c+c"}'),
    ('handelshof', 'Handelshof', null, 'DE', '#004b87', 'cash_carry', false, '{"handelshof"}'),
    ('trinkgut', 'trinkgut', null, 'DE', '#0050aa', 'convenience', false, '{"trinkgut"}'),
    ('getraenke-hoffmann', 'Getränke Hoffmann', null, 'DE', '#e30613', 'convenience', false, '{"getränke hoffmann","getraenke hoffmann","hoffmann"}')
on conflict (id) do update set
    name = excluded.name,
    logo_url = excluded.logo_url,
    country = excluded.country,
    color = excluded.color,
    kind = excluded.kind,
    defunct = excluded.defunct,
    aliases = excluded.aliases;
-- <<< STORE_CHAINS_END
-- =========================================================================

-- Backfill chain_id on existing stores
update public.stores set chain_id = 'rewe'  where id = 'cccccccc-cccc-cccc-cccc-cccccccccc01';
update public.stores set chain_id = 'lidl'  where id = 'cccccccc-cccc-cccc-cccc-cccccccccc02';
update public.stores set chain_id = 'edeka' where id = 'cccccccc-cccc-cccc-cccc-cccccccccc03';

-- Additional sample stores
insert into public.stores (id, name, chain, chain_id, city) values
    ('cccccccc-cccc-cccc-cccc-cccccccccc04', 'ALDI SÜD Kreuzberg',  'ALDI SÜD', 'aldi-sued', 'Berlin'),
    ('cccccccc-cccc-cccc-cccc-cccccccccc05', 'Penny Friedrichshain','Penny',    'penny',     'Berlin'),
    ('cccccccc-cccc-cccc-cccc-cccccccccc06', 'Kaufland Spandau',    'Kaufland', 'kaufland',  'Berlin'),
    ('cccccccc-cccc-cccc-cccc-cccccccccc07', 'dm Charlottenburg',   'dm',       'dm',        'Berlin')
on conflict do nothing;
