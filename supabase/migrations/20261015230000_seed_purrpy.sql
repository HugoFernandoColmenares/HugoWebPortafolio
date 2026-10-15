-- Seed PurrPy, a local text-to-speech API.
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
) values (
  'a1000001-0000-4000-8000-000000000015',
  'PurrPy',
  'Local FastAPI text-to-speech service. A use case synthesizes up to 500 characters through a KittenTTS port, writes a 24 kHz WAV, and stores track metadata in SQLite. Voices include Bella, Jasper, Luna, Bruno, Rosie, Hugo, Kiki, and Leo. The REST API is split from the model: POST /api/v1/speech/generate and GET /api/v1/speech/{audio_id}. Hexagonal layers cover domain, application, infrastructure, and presentation.',
  'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/purrpy-api.png',
  array['Python', 'FastAPI', 'SQLite', 'KittenTTS'],
  'https://github.com/HugoFernandoColmenares/PurrPy',
  null,
  true,
  'completed',
  'web-backend'
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
