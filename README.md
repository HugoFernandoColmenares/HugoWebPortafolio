# WebPortafolio

Professional portfolio web application for **Hugo Fernando Colmenares**, Full-Stack Software Engineer specializing in Angular, .NET Core, and modern web technologies.

This README is the executive summary of the project. Detailed standards live in local guideline documents (`design_guidelines.md` and `architecture_guidelines.md`), which are maintained in the repository root but excluded from version control.

---

## Overview

A standalone Angular 22 application with signal-based reactivity, hash-based routing, bilingual support (English/Spanish), dark/light theming, and Supabase-backed authentication and data persistence. Public pages use a custom token-driven CSS system (editorial-tech look: neutral palette, one lime accent, Schibsted Grotesk + JetBrains Mono); the admin area uses PrimeNG (free tier) with PrimeIcons, lazy-loaded and themed to match portfolio tokens.

---

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | Angular 22, TypeScript, Standalone Components, Signals |
| Public UI styling | Custom CSS (62.5 percent REM scale, CSS custom properties), self-hosted variable fonts (Schibsted Grotesk, JetBrains Mono — OFL) |
| Admin UI | PrimeNG 21 (MIT, no license key), PrimeIcons, `@primeuix/themes` |
| Backend | Supabase (Auth, PostgreSQL, RLS) |
| Environment | `@ngx-env/builder` (`NG_APP_*` variables) |
| Migrations | Supabase CLI |

---

## Features

### Implemented

- Public portfolio pages: Home (services, availability, 4 featured case studies), Projects (case studies + filterable index), project case study detail (`#/projects/<slug>`), About, and Contact
- Project curation layer (`core/data/project-curation.ts`): featured order, slugs, ES copy, case studies, verified repo links and local covers layered over the Supabase rows
- Optimized local covers (`public/img`, WebP 480/800/1200 via `scripts/optimize-images.mjs`) served with `NgOptimizedImage`
- Per-route titles/meta (EN/ES), Open Graph/Twitter tags, JSON-LD, favicon set, robots and sitemap
- Accessibility: skip link, focus management on navigation, mobile menu dialog with focus trap and Esc, synced `<html lang>`, AA contrast in both themes
- Responsive, mobile-first layout with sticky header, mobile menu dialog, and footer
- Internationalization (English and Spanish) with runtime language toggle
- Dark and light theme support via `data-theme` attribute
- Contact form integration via Supabase
- Authentication flows: login, password recovery, email confirmation (public self-registration removed; `#/auth/register` redirects to login)
- Centralized notifications via SweetAlert2 modals (`NotificationService`) styled with design tokens
- Protected admin area with user profile loaded from Supabase
- Public `/projects` page loaded from Supabase via `PortfolioProjectService`
- Shared generic data table with parent-supplied filters, comboboxes, pagination, and row actions
- Admin project creator: CRUD for portfolio projects (shared data table plus PrimeNG form, Supabase `portfolio_projects`)
- Admin social media manager: CRUD for social media links displayed on public pages
- Admin panel: user management interface
- Seed migrations for portfolio projects, including PurrPy
- Database migrations for contact messages, users, roles, and portfolio projects
- Lazy-loaded routes and standalone component architecture
- Shared `.icon-btn` utility class consolidating all square icon-button patterns across the application

### Planned

- Role-based access control (ADMIN, MODERATOR, USER) enforced in guards and services
- Migrate build pipeline fully to `@angular/build` when `@ngx-env/builder` supports Angular 22
- Automated test coverage for core services and guards
- Path-based routing + prerendering (SSG) so each page can be indexed and shared individually

---

## Project Structure

```text
src/app/
  core/          Services, models, guards, mappers, config
  pages/         Public views (home, projects, article, about, contact, layout)
  auth/          Authentication UI (login, recovery, confirm)
  admin/         Authenticated management (profile, project creator, social media, admin panel)
  shared/        Reusable UI components (header, footer, mobile menu, project cover/case card/index, icons, data table)
  app.routes.ts  Lazy-loaded routing
  app.config.ts  Global providers
```

**Routing summary:**

- `/`, `/projects`, `/projects/:slug-or-id`, `/about`, `/contact` -- public pages (no authentication required)
- `/auth/*` -- authentication UI (open routes)
- `/admin/*` -- management area (requires authentication)

---

## Design Standards (Summary)

Full rules: `design_guidelines.md` (local, gitignored).

- Mobile-first responsive design (main breakpoints 760px, 1000px, 1100px)
- All design tokens (color, spacing, typography, radii) defined in `src/styles.css`
- Neutral palette with a single accent (`--color-accent`: lime in dark, olive in light); no decorative gradients
- Geek details in monospace: `$` prompts, file paths, `//` section marks, grid backgrounds
- Hex/rgb values live only in `:root` / `[data-theme="dark"]` token declarations; component CSS uses variables
- Generic reusable CSS classes belong in `styles.css`; component CSS files contain only component-specific styles and media queries
- Shared `.icon-btn` class for all 4.4rem square icon buttons (theme toggle, hamburger, social links, carousel navigation, close buttons)
- BEM-inspired class naming; Schibsted Grotesk (UI/headings) and JetBrains Mono (details), self-hosted in `public/fonts`
- Light and dark themes via `data-theme` attribute
- Admin CRUD screens use PrimeNG with Aura preset customized to portfolio accent colors

---

## Architecture Standards (Summary)

Full rules: `architecture_guidelines.md` (local, gitignored).

- Angular 22 standalone components with OnPush change detection and signals
- All services and models live under `core/`; no service files elsewhere
- Interfaces and types defined in `core/models`, never inside components
- Feature folders: `pages` (public), `auth` (auth UI), `admin` (protected CRUD)
- Admin `project-creator`: parent orchestrates state; `table` and `form` children use `@Input` / `@Output` only; the table is a thin adapter over the shared data table
- Before creating components, verify no similar component already exists
- Target 200 to 250 lines per component; refactor into child or shared components when exceeded
- SOLID, DRY, and KISS principles apply to all changes
- Update this README after significant feature or structural changes

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended; verify compatibility with Angular 22)
- npm
- Supabase CLI (for database migrations)

### Install and Run

```bash
npm install
cp .env.example .env   # configure NG_APP_* variables
npm start              # http://localhost:4200/
```

### Build, lint and test

```bash
npm run build
npx ng lint
npx ng test --watch=false --browsers=ChromeHeadless
```

Output: `dist/web-portafolio/`

### Images

Project covers live in `public/img/projects/<slug>-{480,800,1200}.webp`. To add one, drop the source image in a folder and run `node scripts/optimize-images.mjs` (see the script header), then reference `/img/projects/<slug>` in `core/data/project-curation.ts`.

### Database

```bash
npm run db:push                      # apply migrations to linked Supabase project
npm run db:migration:new -- <name>   # create a new migration
```

Configure Supabase Auth redirect URLs for hash routing, for example:

- `http://localhost:4200/#/auth/confirm-register`
- `http://localhost:4200/#/auth/recovery-password`
- `https://your-app.vercel.app/#/auth/confirm-register` (production)

---

## Deploy to Vercel

1. Import the repository in [Vercel](https://vercel.com).
2. Framework preset: **Other** (configured via `vercel.json`).
3. Set environment variables from `.env.production.example` (`NG_APP_*`).
4. Set `NG_APP_SITE_URL` to your production URL (e.g. `https://your-app.vercel.app`).
5. Deploy. Output directory: `dist/web-portafolio/browser`.

The application uses hash routing (`/#/...`), so no server-side route configuration is required beyond the SPA fallback in `vercel.json`.

---

## Author

**Hugo Fernando Colmenares**

- GitHub: [HugoFernandoColmenares](https://github.com/HugoFernandoColmenares)
- Role: Full-Stack Software Engineer

---

## License

Private project. All rights reserved.
