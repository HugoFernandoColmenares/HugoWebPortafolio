import { Injectable, inject } from '@angular/core';
import {
  SocialMediaContext,
  SocialMediaLink,
  SocialMediaLinkInput,
  SocialMediaLinkRow,
} from '../models/social-media.model';
import {
  mapSocialMediaLink,
  mapSocialMediaLinkInputToRow,
} from '../mappers/social-media.mapper';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class SocialMediaService {
  private readonly supabase = inject(SupabaseService);

  async getAll(): Promise<SocialMediaLink[]> {
    const { data, error } = await this.supabase.client
      .from('social_media_links')
      .select('*')
      .is('deleted_at', null)
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data as SocialMediaLinkRow[]).map(mapSocialMediaLink);
  }

  async getPublicLinks(context: SocialMediaContext): Promise<SocialMediaLink[]> {
    const column = context === 'hero' ? 'show_in_hero' : 'show_in_about';

    const { data, error } = await this.supabase.client
      .from('social_media_links')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .eq(column, true)
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data as SocialMediaLinkRow[]).map(mapSocialMediaLink);
  }

  async create(input: SocialMediaLinkInput): Promise<SocialMediaLink> {
    const { data, error } = await this.supabase.client
      .from('social_media_links')
      .insert(mapSocialMediaLinkInputToRow(input))
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapSocialMediaLink(data as SocialMediaLinkRow);
  }

  async update(id: string, input: SocialMediaLinkInput): Promise<SocialMediaLink> {
    const { data, error } = await this.supabase.client
      .from('social_media_links')
      .update(mapSocialMediaLinkInputToRow(input))
      .eq('id', id)
      .is('deleted_at', null)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapSocialMediaLink(data as SocialMediaLinkRow);
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('social_media_links')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }
  }
}
