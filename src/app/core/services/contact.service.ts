import { Injectable, inject } from '@angular/core';
import { ContactMessageInput } from '../models/contact-message.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly supabase = inject(SupabaseService);

  async sendMessage(message: ContactMessageInput): Promise<void> {
    const { error } = await this.supabase.client
      .from('contact_messages')
      .insert(message);

    if (error) {
      throw error;
    }
  }
}
