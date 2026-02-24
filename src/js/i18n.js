import i18next from 'i18next';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

export async function initI18n() {
  await i18next.init({
    lng: localStorage.getItem('language') || 'fr',
    resources: { fr: { translation: fr }, en: { translation: en } },
    fallbackLng: 'fr'
  });
}

export const t = (key) => i18next.t(key);
export const tObject = (key) => i18next.t(key, { returnObjects: true });
export const changeLanguage = (lng) => i18next.changeLanguage(lng);
export const getLanguage = () => i18next.language;
