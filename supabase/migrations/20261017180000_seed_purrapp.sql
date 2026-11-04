-- Seed PurrApp frontend and Docker orchestrator.
-- Backend is already published as PurrPy and is not inserted again.
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
    'a1000001-0000-4000-8000-000000000016',
    'PurrApp Frontend',
    'Angular 22 studio for local text-to-speech. One Estudio screen sends up to 500 characters and a named voice to the PurrPy API, shows generation state, then plays the WAV with saved text, voice, expression, duration, and download. Standalone lazy routes, signals, HttpClient, and an API_BASE_URL token that stays empty in production so calls go through /api on the same origin.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/purrapp-frontend.png',
    array['Angular', 'TypeScript', 'RxJS'],
    'https://github.com/HugoFernandoColmenares/PurrAppFrontend',
    null,
    true,
    'completed',
    'web-frontend'
  ),
  (
    'a1000001-0000-4000-8000-000000000017',
    'PurrApp Docker',
    'Compose orchestrator for the PurrApp studio. Builds the Angular client into nginx on port 8080, proxies /api/ to the existing PurrPy backend on 8000, and keeps SQLite, WAV files, and KittenTTS weights in named volumes. docker compose up --build is the local run path; volumes survive compose down unless -v is used.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/purrapp-docker.png',
    array['Docker', 'Docker Compose', 'nginx'],
    'https://github.com/HugoFernandoColmenares/PurrAppDocker',
    null,
    true,
    'completed',
    'other'
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
