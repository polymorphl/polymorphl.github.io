/**
 * Application constants
 */

export const DEFAULT_LANGUAGE = 'fr';
export const DEFAULT_THEME = 'gold';
export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;

export const STORAGE_KEYS = {
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const EVENTS = {
  LANGUAGE_CHANGE: 'languagechange',
  BLOG_POST_VIEWED: 'blog_post_viewed',
  BLOG_POST_READ: 'blog_post_read',
} as const;
