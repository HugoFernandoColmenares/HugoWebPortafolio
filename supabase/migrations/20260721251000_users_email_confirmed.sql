-- Sync email confirmation status from auth.users into public.users for admin reporting
alter table public.users
  add column if not exists email_confirmed_at timestamptz;

create or replace function public.sync_user_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set email_confirmed_at = new.email_confirmed_at
  where auth_user_id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_confirmed_sync on auth.users;

create trigger on_auth_user_email_confirmed_sync
  after insert or update of email_confirmed_at on auth.users
  for each row
  execute function public.sync_user_email_confirmed();

update public.users u
set email_confirmed_at = au.email_confirmed_at
from auth.users au
where au.id = u.auth_user_id;
