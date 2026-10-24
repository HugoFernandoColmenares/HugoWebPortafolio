import { appEnvironment } from './app-environment';

/** Ignore unset values and the placeholders shipped in .env.example. */
function real(value: string | undefined, fallback: string): string {
  return value && !/example\.(com|org)|your[._-]/i.test(value) ? value : fallback;
}

/** Public, non-secret facts used across the public pages and SEO tags. */
export const SITE = {
  /** Canonical production origin (used for absolute OG/Twitter URLs). */
  url: 'https://freelance-portafolio-beta.vercel.app',
  name: 'Hugo Colmenares',
  fullName: 'Hugo Fernando Colmenares',
  email: real(appEnvironment.authorEmail, 'hugofcolmenaresc@gmail.com'),
  githubUrl: real(appEnvironment.githubUrl, 'https://github.com/HugoFernandoColmenares'),
  linkedinUrl: real(appEnvironment.linkedinUrl, 'https://www.linkedin.com/in/hugofcolmenaresc/'),
  artistGithubUrl: real(appEnvironment.artistGithubUrl, 'https://github.com/FeithNoir'),
  deviantArtUrl: 'https://www.deviantart.com/feithnoir',
  nexoUrl: real(appEnvironment.nexoUrl, 'https://feith-blog.vercel.app/'),
  ogImage: 'https://freelance-portafolio-beta.vercel.app/og-image.png',
  stack: ['Angular', '.NET', 'SQL Server', 'Supabase'],
} as const;
