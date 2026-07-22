-- Add optional icon field for social media links (URL or CSS class)
alter table public.social_media_links
  add column if not exists icon text null;

update public.social_media_links
set icon = case platform
  when 'github' then 'pi pi-github'
  when 'linkedin' then 'pi pi-linkedin'
  else icon
end
where icon is null;
