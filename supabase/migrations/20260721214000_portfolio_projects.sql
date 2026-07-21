-- Portfolio projects managed from the admin area
create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text not null,
  technologies text[] not null default '{}',
  github_url text null,
  live_url text null,
  featured boolean not null default false,
  status text not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint portfolio_projects_status_check
    check (status in ('completed', 'in-progress', 'planned'))
);

create index portfolio_projects_status_idx
  on public.portfolio_projects (status)
  where deleted_at is null;

create index portfolio_projects_featured_idx
  on public.portfolio_projects (featured)
  where deleted_at is null;

create trigger portfolio_projects_set_updated_at
  before update on public.portfolio_projects
  for each row
  execute function public.set_updated_at();

alter table public.portfolio_projects enable row level security;

create policy "Anyone can read active portfolio projects"
  on public.portfolio_projects
  for select
  using (deleted_at is null);

create policy "Admins can insert portfolio projects"
  on public.portfolio_projects
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.users u
      join public.roles r on r.id = u.role_id
      where u.auth_user_id = auth.uid()
        and u.deleted_at is null
        and r.deleted_at is null
        and r.name = 'ADMIN'
    )
  );

create policy "Admins can update portfolio projects"
  on public.portfolio_projects
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.users u
      join public.roles r on r.id = u.role_id
      where u.auth_user_id = auth.uid()
        and u.deleted_at is null
        and r.deleted_at is null
        and r.name = 'ADMIN'
    )
  )
  with check (
    exists (
      select 1
      from public.users u
      join public.roles r on r.id = u.role_id
      where u.auth_user_id = auth.uid()
        and u.deleted_at is null
        and r.deleted_at is null
        and r.name = 'ADMIN'
    )
  );

grant select on public.portfolio_projects to anon, authenticated;
grant insert, update on public.portfolio_projects to authenticated;
