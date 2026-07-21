export interface AppEnvironment {
  production: boolean;
  siteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  contactApiUrl: string;
  cvUrl: string;
  authorName: string;
  authorEmail: string;
  supabaseUrl: string;
  supabaseKey: string;
}

const rawSupabaseUrl = import.meta.env['NG_APP_SUPABASE_URL'] ?? '';
const rawSupabaseKey = import.meta.env['NG_APP_SUPABASE_KEY'] ?? '';

if (!rawSupabaseUrl || !rawSupabaseKey) {
  console.warn(
    '[app-environment] NG_APP_SUPABASE_URL and/or NG_APP_SUPABASE_KEY are not set. ' +
    'Add them to your .env or .env.development file (see .env.example). ' +
    'Supabase features (auth, profile, etc.) will be unavailable.'
  );
}

export const appEnvironment: AppEnvironment = {
  production: import.meta.env['NG_APP_ENV'] === 'production',
  siteUrl: import.meta.env['NG_APP_SITE_URL'] ?? 'http://localhost:4200',
  githubUrl: import.meta.env['NG_APP_GITHUB_URL'] ?? 'https://github.com/HugoFernandoColmenares',
  linkedinUrl: import.meta.env['NG_APP_LINKEDIN_URL'] ?? 'https://www.linkedin.com/in/hugofcolmenaresc/',
  contactApiUrl: import.meta.env['NG_APP_CONTACT_API_URL'] ?? '',
  cvUrl: import.meta.env['NG_APP_CV_URL'] ?? '',
  authorName: import.meta.env['NG_APP_AUTHOR_NAME'] ?? 'Hugo Fernando Colmenares',
  authorEmail: import.meta.env['NG_APP_AUTHOR_EMAIL'] ?? '',
  supabaseUrl: rawSupabaseUrl,
  supabaseKey: rawSupabaseKey,
};
