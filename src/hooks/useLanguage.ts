import { useState, useEffect, useCallback } from 'react';
import posthog from 'posthog-js';
import { changeLanguage, getLanguage, t, tObject } from '@lib/i18n';
import type { Lang } from '@domain/i18n';
import { STORAGE_KEYS, EVENTS } from '@config/constants';

function normalizeLang(l?: string): Lang {
  const raw = l || getLanguage() || 'fr';
  return raw.startsWith('fr') ? 'fr' : raw.startsWith('en') ? 'en' : 'fr';
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(() => normalizeLang());

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    const handler = (e: CustomEvent<{ lang: Lang }>) => {
      if (e.detail?.lang) setLangState(e.detail.lang);
    };
    window.addEventListener(EVENTS.LANGUAGE_CHANGE, handler as EventListener);
    return () => window.removeEventListener(EVENTS.LANGUAGE_CHANGE, handler as EventListener);
  }, []);

  const setLanguage = useCallback(async (newLang: Lang) => {
    const prevLang = getLanguage();
    await changeLanguage(newLang);
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    document.documentElement.setAttribute('data-lang', newLang);
    document.documentElement.setAttribute('lang', newLang);
    window.dispatchEvent(new CustomEvent(EVENTS.LANGUAGE_CHANGE, { detail: { lang: newLang } }));
    posthog.capture('language_changed', { language: newLang, previous_language: prevLang });
  }, []);

  return { lang, setLanguage, t, tObject };
}
