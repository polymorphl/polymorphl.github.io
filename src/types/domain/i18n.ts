/**
 * Domain types for internationalization
 */

export type Lang = 'fr' | 'en';

export interface LanguageConfig {
  code: Lang;
  name: string;
  nativeName: string;
}

export interface TranslationObject {
  [key: string]: string | TranslationObject;
}
