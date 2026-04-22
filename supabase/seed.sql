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
-- =========================================================================
insert into public.store_chains (id, name, logo_url, color) values
    ('rewe',        'REWE',             'https://commons.wikimedia.org/w/thumb.php?f=Logo_REWE.svg&w=200',                           '#cc071e'),
    ('lidl',        'Lidl',             'https://commons.wikimedia.org/w/thumb.php?f=Lidl-Logo.svg&w=200',                           '#0050aa'),
    ('edeka',       'EDEKA',            'https://commons.wikimedia.org/w/thumb.php?f=Edeka_Logo_Aktuell.svg&w=200',                  '#fff200'),
    ('aldi-sued',   'ALDI SÜD',        'https://commons.wikimedia.org/w/thumb.php?f=Aldi_S%C3%BCd_2017_logo.svg&w=200',             '#00005f'),
    ('aldi-nord',   'ALDI Nord',        'https://commons.wikimedia.org/w/thumb.php?f=Aldi_Nord_201x_logo.svg&w=200',                 '#0e3386'),
    ('penny',       'Penny',            'https://commons.wikimedia.org/w/thumb.php?f=Penny-Logo.svg&w=200',                          '#cd1719'),
    ('netto',       'Netto Marken-Discount', 'https://commons.wikimedia.org/w/thumb.php?f=Netto_logo.svg&w=200',                     '#ffe500'),
    ('kaufland',    'Kaufland',         'https://commons.wikimedia.org/w/thumb.php?f=Kaufland_201x_logo.svg&w=200',                  '#e10019'),
    ('dm',          'dm-drogerie markt','https://commons.wikimedia.org/w/thumb.php?f=Dm_Logo.svg&w=200',                             '#00703c'),
    ('rossmann',    'Rossmann',         'https://commons.wikimedia.org/w/thumb.php?f=Rossmann_Logo.svg&w=200',                       '#e2001a'),
    ('real',        'real',             'https://commons.wikimedia.org/w/thumb.php?f=Real_Logo_Clean.svg&w=200',                     '#e30613'),
    ('norma',       'Norma',            'https://commons.wikimedia.org/w/thumb.php?f=Norma_Logo.svg&w=200',                          '#ee7f00'),
    ('tegut',       'tegut…',           'https://commons.wikimedia.org/w/thumb.php?f=Tegut..._logo_and_claim.svg&w=200',             '#e3000f'),
    ('globus',      'Globus',           'https://commons.wikimedia.org/w/thumb.php?f=Globus_SB-Warenhaus_logo.svg&w=200',            '#004b87'),
    ('hit',         'HIT',              null,                                                                                        '#d40000')
on conflict (id) do nothing;

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
