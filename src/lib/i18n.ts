import i18next from 'i18next';
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@config/constants';

export async function initI18n(): Promise<void> {
  await i18next.init({
    lng: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE,
    resources: { fr: { translation: fr }, en: { translation: en } },
    fallbackLng: DEFAULT_LANGUAGE
  });
}

export const t = (key: string): string => i18next.t(key);
export const tObject = <T>(key: string): T => i18next.t(key, { returnObjects: true }) as T;
export const changeLanguage = (lng: string) => i18next.changeLanguage(lng);
export const getLanguage = (): string => i18next.language;
