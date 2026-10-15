-- Seed ReImage and EchoArts App portfolio projects.
insert into public.portfolio_projects (
  id,
  title,
  description,
  image_url,
  technologies,
  github_url,
  live_url,
  featured,
  status,
  category
) values
  (
    'a1000001-0000-4000-8000-000000000013',
    'ReImage',
    'Terminal UI that renames images in a folder with a shared prefix and a stable numeric sequence. You pick folder, prefix, order, and extensions, review current → new names, then apply. Collisions disable Apply. A JSON log undoes the last run for that folder. Includes a two-step rename, PyInstaller console build, and a per-user Windows installer with an optional folder context-menu entry.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/reimage-py.png',
    array['Python', 'PyInstaller'],
    'https://github.com/HugoFernandoColmenares/ReImagePy',
    null,
    true,
    'completed',
    'desktop'
  ),
  (
    'a1000001-0000-4000-8000-000000000014',
    'EchoArts App',
    'Angular 22 suite for roleplayers and streamers: character cards, overlays, social text pages, banners, comic bubbles and panels, visual-novel promos, art calendar and progress, writing and illustration challenges, posters, power scales, battle stats, and image blending. Standalone lazy routes, signals, bilingual UI, PrimeIcons, Canvas rendering, and PNG export. No backend yet; work stays in the browser.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/echo-arts-app.png',
    array['Angular', 'TypeScript', 'PrimeIcons', 'Canvas'],
    'https://github.com/FeithNoir/EchoArtsApp',
    null,
    true,
    'completed',
    'web-frontend'
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  technologies = excluded.technologies,
  github_url = excluded.github_url,
  featured = excluded.featured,
  status = excluded.status,
  category = excluded.category,
  deleted_at = null;
