-- Seed Pastry API and Inventory OCR Scanner portfolio projects.
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
    'a1000001-0000-4000-8000-000000000011',
    'Pastry API',
    'REST API for a pastry shop: register ingredient stock, compose recipes, and produce batches that consume inventory or return 409 listing shortages. Java 25 and Spring Boot 4 with SQLite, OpenAPI/Swagger, Docker, seeded demo data, automated tests, and a small bench UI to list stock and trigger produce.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/pastry-api.png',
    array['Java', 'Spring Boot', 'SQLite', 'Docker', 'OpenAPI'],
    'https://github.com/HugoFernandoColmenares/pasteleriapi',
    null,
    true,
    'completed',
    'web-backend'
  ),
  (
    'a1000001-0000-4000-8000-000000000012',
    'Inventory OCR Scanner',
    'Web app that reads inventory codes from photos using barcode and QR decoding first, with Tesseract only as a labeled-text fallback. Operators review, correct, or discard rows before confirming a batch, then export CSV or JSON. Python, Flask, OpenCV, Docker, Nginx/Gunicorn, and SQLite for lot history.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/ocr-docker-app.jpg',
    array['Python', 'Flask', 'Docker', 'OpenCV', 'Tesseract'],
    'https://github.com/HugoFernandoColmenares/OCRDockerApp',
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
