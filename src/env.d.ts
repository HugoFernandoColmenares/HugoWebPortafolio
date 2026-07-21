// Define the type of the environment variables.
declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_ENV: string;
  readonly NG_APP_SITE_URL: string;
  readonly NG_APP_AUTHOR_NAME: string;
  readonly NG_APP_AUTHOR_EMAIL: string;
  readonly NG_APP_GITHUB_URL: string;
  readonly NG_APP_LINKEDIN_URL: string;
  readonly NG_APP_CV_URL: string;
  readonly NG_APP_CONTACT_API_URL: string;
}

// Choose how to access the environment variables.
// Remove the unused options.

// 1. Use import.meta.env.YOUR_ENV_VAR in your code. (conventional)
declare interface ImportMeta {
  readonly env: Env;
}

// 2. Use _NGX_ENV_.YOUR_ENV_VAR in your code. (customizable)
// You can modify the name of the variable in angular.json.
// ngxEnv: {
//  define: '_NGX_ENV_',
// }
declare const _NGX_ENV_: Env;

// 3. Use process.env.YOUR_ENV_VAR in your code. (deprecated)
declare namespace NodeJS {
  export interface ProcessEnv extends Env {}
}
