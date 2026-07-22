-- Add project category/type for grouping (web, mobile, desktop, etc.)
alter table public.portfolio_projects
  add column if not exists category text;

update public.portfolio_projects
set category = 'web-backend'
where id = 'a1000001-0000-4000-8000-000000000001';

update public.portfolio_projects
set category = 'web-frontend'
where id = 'a1000001-0000-4000-8000-000000000002';

update public.portfolio_projects
set category = 'desktop'
where id = 'a1000001-0000-4000-8000-000000000003';

update public.portfolio_projects
set category = 'mobile'
where id = 'a1000001-0000-4000-8000-000000000004';

update public.portfolio_projects
set category = 'web-frontend'
where id = 'a1000001-0000-4000-8000-000000000005';

update public.portfolio_projects
set category = 'other'
where category is null;

alter table public.portfolio_projects
  alter column category set not null;

alter table public.portfolio_projects
  drop constraint if exists portfolio_projects_category_check;

alter table public.portfolio_projects
  add constraint portfolio_projects_category_check
  check (category in (
    'web-frontend',
    'web-backend',
    'web-fullstack',
    'mobile',
    'desktop',
    'other'
  ));

create index if not exists portfolio_projects_category_idx
  on public.portfolio_projects (category)
  where deleted_at is null;
