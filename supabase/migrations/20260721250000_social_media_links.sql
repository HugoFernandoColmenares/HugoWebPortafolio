-- Social media links managed from admin area
create table public.social_media_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform text not null,
  url text not null,
  display_order integer not null default 0,
  show_in_hero boolean not null default true,
  show_in_about boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint social_media_links_platform_check
    check (platform in (
      'github',
      'linkedin',
      'twitter',
      'instagram',
      'facebook',
      'youtube',
      'website',
      'other'
    ))
);

create index social_media_links_display_order_idx
  on public.social_media_links (display_order)
  where deleted_at is null;

create trigger social_media_links_set_updated_at
  before update on public.social_media_links
  for each row
  execute function public.set_updated_at();

alter table public.social_media_links enable row level security;

create policy "Anyone can read active social media links"
  on public.social_media_links
  for select
  using (deleted_at is null and is_active = true);

create policy "Admins can read all social media links"
  on public.social_media_links
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert social media links"
  on public.social_media_links
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update social media links"
  on public.social_media_links
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.social_media_links to anon, authenticated;
grant insert, update on public.social_media_links to authenticated;

insert into public.social_media_links (name, platform, url, display_order, show_in_hero, show_in_about)
values
  ('GitHub', 'github', 'https://github.com/HugoFernandoColmenares', 1, true, true),
  ('LinkedIn', 'linkedin', 'https://www.linkedin.com/in/hugofcolmenaresc/', 2, true, true);
