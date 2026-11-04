-- Seed DevChronicle frontend, API, and Docker orchestrator as separate entries.
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
    'a1000001-0000-4000-8000-000000000018',
    'DevChronicle App',
    'Angular 22 markdown journal client. The landing page shows a featured entry and a tag-filterable catalog. /post/:slug keeps a 70-character measure, lazy-loads Highlight.js, and copies fenced code. Markdown is compiled in the browser with marked, purified with DOMPurify, and bound through deferred views. When the API is down, the same routes read public/content. Zoneless signals, SweetAlert2 notices, and no admin form in this client.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/devchronicle-app.png',
    array['Angular', 'TypeScript', 'marked', 'Highlight.js', 'DOMPurify'],
    'https://github.com/HugoFernandoColmenares/DevChronicleApp',
    null,
    true,
    'completed',
    'web-frontend'
  ),
  (
    'a1000001-0000-4000-8000-000000000019',
    'DevChronicle API',
    'Rust Axum API for the journal. SQLite stores published entries and drafts. Public GET returns JSON metadata plus raw Markdown. Writes need a Bearer author token. Slugs are validated, unpublished rows stay hidden, and sqlx migrations ship inside the binary. A seed binary loads a content directory once with ON CONFLICT DO NOTHING. CORS is open for ng serve; behind nginx the browser uses one origin.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/devchronicle-api.png',
    array['Rust', 'Axum', 'SQLite', 'SQLx', 'Tokio'],
    'https://github.com/HugoFernandoColmenares/DevChronicleApi',
    null,
    true,
    'completed',
    'web-backend'
  ),
  (
    'a1000001-0000-4000-8000-000000000020',
    'DevChronicle Docker',
    'Compose orchestrator for DevChronicle. Builds the Angular client into nginx on port 8080, waits for the Rust API health check, and proxies /api/ on the same origin. SQLite lives in the chronicle-data volume. An optional seed profile mounts frontend/public/content. docker compose down keeps the journal; down -v deletes it.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/devchronicle-docker.png',
    array['Docker', 'Docker Compose', 'nginx'],
    'https://github.com/HugoFernandoColmenares/DevChronicle',
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
