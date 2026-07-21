-- Seed initial portfolio projects (migrated from legacy hardcoded ProjectsComponent data)
insert into public.portfolio_projects (
  id,
  title,
  description,
  image_url,
  technologies,
  github_url,
  live_url,
  featured,
  status
) values
  (
    'a1000001-0000-4000-8000-000000000001',
    'Backend Bakery Management System',
    'API Backend Enterprise-grade inventory and order management system for a bakery business. Features real-time stock tracking, sales reporting, and role-based access control.',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    array['.NET Core', 'SQLite', 'Entity Framework'],
    'https://github.com/HugoFernandoColmenares/pasteleriaapi',
    null,
    true,
    'completed'
  ),
  (
    'a1000001-0000-4000-8000-000000000002',
    'Frontend Bakery Management System',
    'Frontend App Enterprise-grade inventory and order management system for a bakery business. Features real-time stock tracking, sales reporting, and role-based access control.',
    'https://i.imgur.com/oVbyh2z.jpeg',
    array['Angular', 'TypeScript', 'CSS'],
    'https://github.com/HugoFernandoColmenares/PasteleryApp',
    null,
    true,
    'completed'
  ),
  (
    'a1000001-0000-4000-8000-000000000003',
    'Desktop Image Organizer',
    'A WPF desktop application leveraging Domain-Driven Design (DDD) and the Repository Pattern for scalable image categorization and metadata management.',
    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80',
    array['C#', 'WPF', 'DDD', 'SQL Server'],
    'https://github.com/HugoFernandoColmenares/ReImage',
    null,
    true,
    'completed'
  ),
  (
    'a1000001-0000-4000-8000-000000000004',
    'Freelance Client Portal',
    'A dashboard for managing freelance contracts featuring JWT authentication, milestone tracking, and invoice generation. Designed to attract independent contracts.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    array['Ionic', 'Firebase', 'TypeScript'],
    null,
    null,
    false,
    'in-progress'
  ),
  (
    'a1000001-0000-4000-8000-000000000005',
    'Corporate NGO Landing Page',
    'A HTML, CSS and JS website for an NGO, focusing on top-tier SEO performance, accessibility (WCAG 2.1 AA), and Core Web Vitals.',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
    array['HTML', 'JavaScript', 'CSS', 'SCSS'],
    'https://github.com/HugoFernandoColmenares/guitarraLA',
    null,
    false,
    'planned'
  )
on conflict (id) do nothing;
