import { Injectable, inject } from '@angular/core';
import {
  PortfolioProject,
  PortfolioProjectInput,
  PortfolioProjectRow,
} from '../models/portfolio-project.model';
import {
  mapPortfolioProject,
  mapPortfolioProjectInputToRow,
} from '../mappers/portfolio-project.mapper';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class PortfolioProjectService {
  private readonly supabase = inject(SupabaseService);

  async getAll(): Promise<PortfolioProject[]> {
    const { data, error } = await this.supabase.client
      .from('portfolio_projects')
      .select('*')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data as PortfolioProjectRow[]).map(mapPortfolioProject);
  }

  async create(input: PortfolioProjectInput): Promise<PortfolioProject> {
    const { data, error } = await this.supabase.client
      .from('portfolio_projects')
      .insert(mapPortfolioProjectInputToRow(input))
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapPortfolioProject(data as PortfolioProjectRow);
  }

  async update(id: string, input: PortfolioProjectInput): Promise<PortfolioProject> {
    const { data, error } = await this.supabase.client
      .from('portfolio_projects')
      .update(mapPortfolioProjectInputToRow(input))
      .eq('id', id)
      .is('deleted_at', null)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapPortfolioProject(data as PortfolioProjectRow);
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('portfolio_projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }
  }
}
