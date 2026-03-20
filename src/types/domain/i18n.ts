/**
 * Domain types for internationalization
 */

export type Lang = 'fr' | 'en';

export type LanguageConfig = {
  code: Lang;
  name: string;
  nativeName: string;
};

export type TranslationObject = {
  [key: string]: string | TranslationObject;
};
