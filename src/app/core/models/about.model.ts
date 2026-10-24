import type { TranslationKey } from '../services/translation.service';

/** One row of the About timeline (copy comes from translations). */
export interface TimelineEntry {
  when: string;
  whenKey?: TranslationKey;
  title: TranslationKey;
  org?: TranslationKey;
  orgText?: string;
}

/** A column of the About stack grid. */
export interface AboutStackGroup {
  title: TranslationKey;
  items: string[];
}
