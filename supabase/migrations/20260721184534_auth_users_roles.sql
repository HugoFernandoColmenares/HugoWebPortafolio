-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Roles
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint roles_name_unique unique (name),
  constraint roles_name_check check (name in ('ADMIN', 'MODERATOR', 'USER'))
);

create trigger roles_set_updated_at
  before update on public.roles
  for each row
  execute function public.set_updated_at();

insert into public.roles (name) values
  ('ADMIN'),
  ('MODERATOR'),
  ('USER');

-- Users (custom profile linked to auth.users)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  role_id uuid not null references public.roles (id),
  email text not null,
  full_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create index users_auth_user_id_idx on public.users (auth_user_id) where deleted_at is null;
create index users_role_id_idx on public.users (role_id) where deleted_at is null;

create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();

-- Auto-create profile when email is confirmed
create or replace function public.handle_user_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_role_id uuid;
begin
  if exists (
    select 1
    from public.users
    where auth_user_id = new.id
      and deleted_at is null
  ) then
    return new;
  end if;

  select id
  into default_role_id
  from public.roles
  where name = 'USER'
    and deleted_at is null
  limit 1;

  insert into public.users (auth_user_id, role_id, email, full_name)
  values (
    new.id,
    default_role_id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  when (new.email_confirmed_at is not null)
  execute function public.handle_user_confirmed();

create trigger on_auth_user_email_confirmed
  after update on auth.users
  for each row
  when (
    old.email_confirmed_at is null
    and new.email_confirmed_at is not null
  )
  execute function public.handle_user_confirmed();

-- RLS
alter table public.roles enable row level security;
alter table public.users enable row level security;

create policy "Authenticated users can read active roles"
  on public.roles
  for select
  to authenticated
  using (deleted_at is null);

create policy "Users can read own profile"
  on public.users
  for select
  to authenticated
  using (
    auth_user_id = (select auth.uid())
    and deleted_at is null
  );

grant select on public.roles to authenticated;
grant select on public.users to authenticated;
