-- ---------------------------------------------------------------------------
-- Invite tokens: enable shareable invite links
-- ---------------------------------------------------------------------------
-- - Adds a unique token to each invite so it can be redeemed via URL.
-- - Makes email nullable (link-only invites).
-- - Adds SECURITY DEFINER RPCs so any signed-in user can look up and redeem
--   an invite by token, bypassing the email-match policy.
-- ---------------------------------------------------------------------------

alter table public.household_invites
    add column if not exists token uuid not null default gen_random_uuid() unique;

alter table public.household_invites
    alter column email drop not null;

-- ---------------------------------------------------------------------------
-- get_invite_by_token: returns the invite + household name, no auth required.
-- ---------------------------------------------------------------------------
create or replace function public.get_invite_by_token(t uuid)
returns table (
    id           uuid,
    household_id uuid,
    household_name text,
    email        text,
    status       text,
    expires_at   timestamptz,
    created_at   timestamptz
)
language sql stable security definer set search_path = ''
as $$
    select i.id, i.household_id, h.name as household_name,
           i.email, i.status, i.expires_at, i.created_at
    from public.household_invites i
    join public.households h on h.id = i.household_id
    where i.token = t;
$$;

grant execute on function public.get_invite_by_token(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- accept_invite_by_token: redeem an invite as the current authenticated user.
-- ---------------------------------------------------------------------------
create or replace function public.accept_invite_by_token(t uuid)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
    uid          uuid := auth.uid();
    user_email   text;
    inv          public.household_invites%rowtype;
begin
    if uid is null then
        raise exception 'not_authenticated';
    end if;

    select * into inv from public.household_invites where token = t;
    if not found then
        raise exception 'invite_not_found';
    end if;
    if inv.status <> 'pending' then
        raise exception 'invite_not_pending';
    end if;
    if inv.expires_at < now() then
        raise exception 'invite_expired';
    end if;

    -- Mark accepted
    update public.household_invites
        set status = 'accepted'
        where id = inv.id;

    -- Move user to the new household
    update public.profiles
        set household_id = inv.household_id
        where id = uid;

    -- Auto-decline this user's other pending invites (single-household rule)
    select email into user_email from auth.users where id = uid;
    if user_email is not null then
        update public.household_invites
            set status = 'declined'
            where status = 'pending'
              and email = user_email
              and id <> inv.id;
    end if;

    return inv.household_id;
end;
$$;

grant execute on function public.accept_invite_by_token(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- decline_invite_by_token: anyone with the link can decline (rare flow).
-- ---------------------------------------------------------------------------
create or replace function public.decline_invite_by_token(t uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
    if auth.uid() is null then
        raise exception 'not_authenticated';
    end if;

    update public.household_invites
        set status = 'declined'
        where token = t and status = 'pending';
end;
$$;

grant execute on function public.decline_invite_by_token(uuid) to authenticated;
