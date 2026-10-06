import type { TranslationKey } from '../services/translation.service';
import { PlatformOption, SocialPlatform } from '../models/social-media.model';

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  'github',
  'linkedin',
  'twitter',
  'instagram',
  'facebook',
  'youtube',
  'website',
  'other',
];

export const SOCIAL_PLATFORM_ICONS: Record<SocialPlatform, string> = {
  github: 'pi pi-github',
  linkedin: 'pi pi-linkedin',
  twitter: 'pi pi-twitter',
  instagram: 'pi pi-instagram',
  facebook: 'pi pi-facebook',
  youtube: 'pi pi-youtube',
  website: 'pi pi-globe',
  other: 'pi pi-share-alt',
};

export function resolveSocialIcon(platform: SocialPlatform, icon?: string | null): string {
  const trimmed = icon?.trim();
  return trimmed || SOCIAL_PLATFORM_ICONS[platform];
}

export const SOCIAL_PLATFORM_TRANSLATION_KEYS = {
  github: 'social_platform_github',
  linkedin: 'social_platform_linkedin',
  twitter: 'social_platform_twitter',
  instagram: 'social_platform_instagram',
  facebook: 'social_platform_facebook',
  youtube: 'social_platform_youtube',
  website: 'social_platform_website',
  other: 'social_platform_other',
} as const satisfies Record<SocialPlatform, TranslationKey>;

export function buildPlatformOptions(
  translate: (key: TranslationKey) => string,
): PlatformOption[] {
  return SOCIAL_PLATFORMS.map(platform => ({
    value: platform,
    label: translate(SOCIAL_PLATFORM_TRANSLATION_KEYS[platform]),
  }));
}
