-- Seed NEXO, Seiryuko Dojo, and Seiryuko Dojo Ng portfolio projects.
-- Cover images are left empty so they can be uploaded from the admin editor.
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
    'a1000001-0000-4000-8000-000000000008',
    'NEXO',
    'Premium blog-first platform that merges software engineering, digital illustration, and long-form technical writing on a cyberpunk canvas. Public routes cover home activity, Markdown blog, works gallery, shop, about, and RSS. An admin panel manages posts, gallery, and products against a Supabase schema, with Stripe Payment Links for donations and checkout.',
    '',
    array['Angular', 'TypeScript', 'Supabase', 'Stripe'],
    'https://github.com/FeithNoir',
    null,
    true,
    'completed',
    'web-fullstack'
  ),
  (
    'a1000001-0000-4000-8000-000000000009',
    'Seiryuko Dojo',
    'Study guide for the Seiryuko Dojo judo promotion path, from kyu grades through dan. Visitors can browse belts, techniques, history, resources, and exam topics. The site does not publish class schedules, addresses, phone numbers, or exam calendars.',
    '',
    array['Angular', 'TypeScript', 'CSS'],
    'https://github.com/HugoFernandoColmenares',
    null,
    true,
    'completed',
    'web-frontend'
  ),
  (
    'a1000001-0000-4000-8000-000000000010',
    'Seiryuko Dojo Ng',
    'Angular 22 edition of the Seiryuko Dojo study guide. Standalone feature folders, signals, shared cards and tables, and CSS tokens. Same public content as the dojo guide: belts, techniques, history, resources, and exam topics, without publishing schedules or contact data.',
    '',
    array['Angular', 'TypeScript', 'CSS', 'Vitest'],
    'https://github.com/HugoFernandoColmenares',
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
