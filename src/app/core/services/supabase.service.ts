import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { appEnvironment } from '../config/app-environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private _client: SupabaseClient | null = null;

  /** Lazily creates the Supabase client on first access. */
  get client(): SupabaseClient {
    if (!this._client) {
      if (!appEnvironment.supabaseUrl || !appEnvironment.supabaseKey) {
        throw new Error(
          'SupabaseService: cannot create client — NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY ' +
          'must be set in your .env or .env.development file (see .env.example).'
        );
      }
      this._client = createClient(
        appEnvironment.supabaseUrl,
        appEnvironment.supabaseKey,
      );
    }
    return this._client;
  }
}
