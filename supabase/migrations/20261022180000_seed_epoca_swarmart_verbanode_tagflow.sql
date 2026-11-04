-- Seed Epoca Studio, SwarmArt, VerbaNode (Docker, n8n, frontend), and PyLens (TagFlow).
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
    'a1000001-0000-4000-8000-000000000021',
    'Epoca Studio',
    'Offline Art Deco writing studio on Angular 22 and Electron. Manuscripts live in a local SQLite vault on desktop, or localStorage in the browser during development. Library, editor, reader, and split view with autosave, focus mode, trash with undo, and export to Markdown, HTML, or PDF. Import .md and .txt from the library. No accounts: the app opens on the library.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/epoca-studio.png',
    array['Angular', 'TypeScript', 'Electron', 'SQLite', 'marked'],
    'https://github.com/FeithNoir/epoca-studio',
    null,
    true,
    'completed',
    'desktop'
  ),
  (
    'a1000001-0000-4000-8000-000000000022',
    'SwarmArt',
    'Local-first dark art shelf as the first slice of a peer-to-peer gallery. Feed, lightbox, studio, groups, and node monitor run in Angular 22 with signals and OnPush. Pieces stay in the browser localStorage. The UI reports the peer daemon as offline and does not invent remote peers. Desktop wrapper, libp2p, SQLite, and Ed25519 signatures are still ahead.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/swarmart.png',
    array['Angular', 'TypeScript', 'Vitest'],
    'https://github.com/HugoFernandoColmenares/SwarmArt',
    null,
    true,
    'in-progress',
    'web-frontend'
  ),
  (
    'a1000001-0000-4000-8000-000000000023',
    'VerbaNode Docker',
    'Compose orchestrator for VerbaNode. Runs only the n8n service on 127.0.0.1:5678 with named volumes for n8n data and draft history. LM Studio and the Angular app stay on the host. Env contract covers encryption key, webhook URL, and LMSTUDIO_* so the container reaches the host model at host.docker.internal:1234.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/verbanode-docker.png',
    array['Docker', 'Docker Compose', 'n8n'],
    null,
    null,
    true,
    'in-progress',
    'other'
  ),
  (
    'a1000001-0000-4000-8000-000000000024',
    'VerbaNode n8n',
    'n8n workflow package for VerbaNode drafts. One webhook POST /webhook/verba/draft branches on task (commit, pr, prompt, git). Commit and PR call LM Studio liquid/lfm2.5-1.2b on the host; prompt and git fill templates without the model. Includes the importable verba-draft.json workflow and the shared JSON contract with the Angular client.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/verbanode-n8n.png',
    array['n8n', 'LM Studio', 'JSON'],
    null,
    null,
    true,
    'in-progress',
    'web-backend'
  ),
  (
    'a1000001-0000-4000-8000-000000000025',
    'VerbaNode App',
    'Angular 22 client for VerbaNode. Screens for Commit, Pull request, Prompt, Git, and History. Forms post to the local n8n webhook through a dev proxy; the app never calls the model port. Prompt and Git are template-only. Git writes command lists and does not run them. History UI is ready; persistence table is still pending.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/verbanode-app.png',
    array['Angular', 'TypeScript'],
    null,
    null,
    true,
    'in-progress',
    'web-frontend'
  ),
  (
    'a1000001-0000-4000-8000-000000000026',
    'PyLens',
    'Desktop image library (TagFlow repo). Indexes a folder in SQLite with dimensions, size, format, sharpness, and hashes. Tag, filter, find duplicates by MD5/SHA-256 or pHash, then rename, move, group, compress, or optimize selected files. Built with Python, PySide6, Pillow, and OpenCV. Ships as a single-file Windows executable via PyInstaller.',
    'https://giiaihzkkphubmsvbfpi.supabase.co/storage/v1/object/public/portfolio-images/projects/pylens.png',
    array['Python', 'PySide6', 'SQLite', 'OpenCV', 'Pillow'],
    'https://github.com/HugoFernandoColmenares/TagFlow',
    null,
    true,
    'completed',
    'desktop'
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
