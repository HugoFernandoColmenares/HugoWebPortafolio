-- Seed Blast Knights and StrikeSoft Hub portfolio projects.
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
    'a1000001-0000-4000-8000-000000000006',
    'Blast Knights',
    'A client-side Angular 22 arcade port. Five biomes, twenty-five stages, Normal/Hard difficulty, typed bombs, a walkable themed armory, local high scores, and a thumb joystick on phones and tablets. Simulation and rendering run in the browser (Canvas 2D, fixed 60 Hz) with no gameplay backend.',
    '',
    array['Angular', 'TypeScript', 'Canvas 2D'],
    'https://github.com/FeithNoir',
    null,
    true,
    'completed',
    'web-frontend'
  ),
  (
    'a1000001-0000-4000-8000-000000000007',
    'StrikeSoft Hub',
    'Web home of Armagedón Softcombat, a group that meets every Sunday at 10:00 in Parque La Flora, Bucaramanga. Spanish visitor UI with a Sunday countdown, workshop catalog, Instagram chronicles, armory filters, cart, and an auth-guarded reservation flow. Supabase is preferred when configured; LocalStorage keeps the same catalog and session flows offline.',
    '',
    array['Angular', 'TypeScript', 'Supabase', 'PWA'],
    'https://github.com/HugoFernandoColmenares',
    null,
    true,
    'completed',
    'web-fullstack'
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
