-- Helper to check if the current user is an ADMIN
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.auth_user_id = auth.uid()
      and u.deleted_at is null
      and r.deleted_at is null
      and r.name = 'ADMIN'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Users: allow profile self-update and admin management
drop policy if exists "Users can read own profile" on public.users;

create policy "Users can read profiles"
  on public.users
  for select
  to authenticated
  using (
    deleted_at is null
    and (
      auth_user_id = auth.uid()
      or public.is_admin()
    )
  );

create policy "Users can update own profile"
  on public.users
  for update
  to authenticated
  using (
    auth_user_id = auth.uid()
    and deleted_at is null
  )
  with check (
    auth_user_id = auth.uid()
    and deleted_at is null
  );

create policy "Admins can update users"
  on public.users
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant update on public.users to authenticated;

-- Portfolio images storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,
  array['image/webp', 'image/jpeg', 'image/png', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Authenticated users can upload portfolio images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

create policy "Authenticated users can update own portfolio images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-images' and owner = auth.uid())
  with check (bucket_id = 'portfolio-images' and owner = auth.uid());

create policy "Anyone can read portfolio images"
  on storage.objects
  for select
  using (bucket_id = 'portfolio-images');

create policy "Authenticated users can delete own portfolio images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-images' and owner = auth.uid());
