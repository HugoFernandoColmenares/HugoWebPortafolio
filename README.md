# WebPortafolio

Professional portfolio web application for **Hugo Fernando Colmenares**, Full-Stack Software Engineer specializing in Angular, .NET Core, and modern web technologies.

This README is the executive summary of the project. Detailed standards live in local guideline documents (`design_guidelines.md` and `architecture_guidelines.md`), which are maintained in the repository root but excluded from version control.

---

## Overview

A standalone Angular 22 application with signal-based reactivity, hash-based routing, bilingual support (English/Spanish), dark/light theming, and Supabase-backed authentication and data persistence. The UI is built with a custom token-driven CSS system (mobile-first, no CSS framework).

---

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | Angular 22, TypeScript, Standalone Components, Signals |
| Styling | Custom CSS (62.5% REM scale, CSS custom properties) |
| Backend | Supabase (Auth, PostgreSQL, RLS) |
| Environment | `@ngx-env/builder` (`NG_APP_*` variables) |
| Migrations | Supabase CLI |

---

## Features

### Implemented

- Public portfolio pages: Home, Projects, About
- Responsive layout with header, mobile sidebar, and footer
- Internationalization (English / Spanish) with runtime language toggle
- Dark and light theme support
- Contact form integration via Supabase
- Authentication flows: login, register, password recovery, email confirmation
- Centralized notifications via SweetAlert2 modals (`NotificationService`) styled with design tokens
- Protected admin area with user profile loaded from Supabase
- Database migrations for contact messages, users, and roles
- Lazy-loaded routes and standalone component architecture

### Planned

- Project creator: full CRUD for portfolio projects/posts in the admin area
- Role-based access control (ADMIN, MODERATOR, USER) enforced in guards and services
- Admin table and form components for content management
- Migrate build pipeline fully to `@angular/build` when `@ngx-env/builder` supports Angular 22
- Automated test coverage for core services and guards
- SEO and performance optimizations for production deployment

---

## Project Structure

```text
src/app/
├── core/          Services, models, guards, mappers, config
├── pages/         Public views (home, projects, about, layout)
├── auth/          Authentication UI (login, register, recovery, confirm)
├── admin/         Authenticated management (profile, project creator)
├── shared/        Reusable UI components (header, footer, cards, badges)
├── app.routes.ts  Lazy-loaded routing
└── app.config.ts  Global providers
```

**Routing summary:**

- `/`, `/projects`, `/about` — public pages (no auth required)
- `/auth/*` — authentication UI (open routes)
- `/admin/*` — management area (requires authentication)

---

## Design Standards (Summary)

Full rules: `design_guidelines.md` (local, gitignored).

- Mobile-first responsive design with standard breakpoints (640px, 768px, 900px)
- All design tokens (color, spacing, typography, shadows) defined in `src/styles.css`
- Generic/reusable CSS classes belong in `styles.css`; component CSS files contain only component-specific styles and media queries
- BEM-inspired class naming; Inter as primary typeface
- Light/dark themes via `data-theme` attribute

---

## Architecture Standards (Summary)

Full rules: `architecture_guidelines.md` (local, gitignored).

- Angular 22+ standalone components with OnPush change detection and signals
- All services and models live under `core/`; no service files elsewhere
- Interfaces and types are defined in `core/models`, never inside components
- Feature folders: `pages` (public), `auth` (auth UI), `admin` (protected CRUD)
- Before creating components, verify no similar component already exists
- Target 200–250 lines per component; refactor into child or shared components when exceeded
- SOLID, DRY, and KISS principles apply to all changes
- Update this README after significant feature or structural changes

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended; verify compatibility with Angular 22)
- npm
- Supabase CLI (for database migrations)

### Install and run

```bash
npm install
cp .env.example .env   # configure NG_APP_* variables
npm start              # http://localhost:4200/
```

### Build

```bash
npm run build
```

Output: `dist/web-portafolio/`

### Database

```bash
npm run db:push        # apply migrations to linked Supabase project
npm run db:migration:new -- <name>   # create a new migration
```

Configure Supabase Auth redirect URLs for hash routing, for example:

- `http://localhost:4200/#/auth/confirm-register`
- `http://localhost:4200/#/auth/recovery-password`

---

## Preview Screenshots

### Home Page (Light Mode)

![Home page](public/docs/home_page_initial_1773502744588.png)

### Projects Page

![Projects page grid](public/docs/projects_page_grid_1773502760801.png)

### About Page (Dark Mode)

![About page in dark mode](public/docs/about_page_dark_mode_1773502795338.png)

### About Page (Spanish)

![About page in Spanish](public/docs/about_page_spanish_1773502801171.png)

---

## Author

**Hugo Fernando Colmenares**

- GitHub: [HugoFernandoColmenares](https://github.com/HugoFernandoColmenares)
- Role: Full-Stack Software Engineer

---

## License

Private project. All rights reserved.
