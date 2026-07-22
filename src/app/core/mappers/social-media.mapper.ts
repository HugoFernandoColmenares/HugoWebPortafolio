import {
  SocialMediaLink,
  SocialMediaLinkInput,
  SocialMediaLinkRow,
} from '../models/social-media.model';

export function mapSocialMediaLink(row: SocialMediaLinkRow): SocialMediaLink {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform,
    url: row.url,
    icon: row.icon ?? undefined,
    displayOrder: row.display_order,
    showInHero: row.show_in_hero,
    showInAbout: row.show_in_about,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function mapSocialMediaLinkInputToRow(input: SocialMediaLinkInput) {
  return {
    name: input.name.trim(),
    platform: input.platform,
    url: input.url.trim(),
    icon: input.icon?.trim() || null,
    display_order: input.displayOrder,
    show_in_hero: input.showInHero,
    show_in_about: input.showInAbout,
    is_active: input.isActive,
  };
}
