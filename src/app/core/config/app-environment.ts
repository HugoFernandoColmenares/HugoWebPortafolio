export interface AppEnvironment {
  production: boolean;
  siteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  artistGithubUrl: string;
  nexoUrl: string;
  contactApiUrl: string;
  cvUrl: string;
  authorName: string;
  authorEmail: string;
  supabaseUrl: string;
  supabaseKey: string;
}

const rawSupabaseUrl = import.meta.env?.NG_APP_SUPABASE_URL ?? '';
const rawSupabaseKey = import.meta.env?.NG_APP_SUPABASE_KEY ?? '';

export const appEnvironment: AppEnvironment = {
  production: import.meta.env?.NG_APP_ENV === 'production',
  siteUrl: import.meta.env?.NG_APP_SITE_URL ?? 'http://localhost:4200',
  githubUrl: import.meta.env?.NG_APP_GITHUB_URL ?? 'https://github.com/HugoFernandoColmenares',
  linkedinUrl: import.meta.env?.NG_APP_LINKEDIN_URL ?? 'https://www.linkedin.com/in/hugofcolmenaresc/',
  artistGithubUrl: import.meta.env?.NG_APP_ARTIST_GITHUB_URL ?? 'https://github.com/FeithNoir',
  nexoUrl: import.meta.env?.NG_APP_NEXO_URL ?? '',
  contactApiUrl: import.meta.env?.NG_APP_CONTACT_API_URL ?? '',
  cvUrl: import.meta.env?.NG_APP_CV_URL ?? '',
  authorName: import.meta.env?.NG_APP_AUTHOR_NAME ?? 'Hugo Fernando Colmenares',
  authorEmail: import.meta.env?.NG_APP_AUTHOR_EMAIL ?? '',
  supabaseUrl: rawSupabaseUrl,
  supabaseKey: rawSupabaseKey,
};
