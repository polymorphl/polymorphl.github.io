import { useState, useEffect, useCallback, useRef } from 'react';
import { changeLanguage, getLanguage, t, tObject } from '@lib/i18n';
import type { Lang } from '@domain/i18n';
import { STORAGE_KEYS, EVENTS } from '@config/constants';
import { useTracking } from './useTracking';

function normalizeLang(l?: string): Lang {
  const raw = l || getLanguage() || 'fr';
  return raw.startsWith('fr') ? 'fr' : raw.startsWith('en') ? 'en' : 'fr';
}

export function useLanguage(pathname?: string) {
  const { trackLanguageChanged } = useTracking();
  const [lang, setLangState] = useState<Lang>(() => {
    const l = normalizeLang();
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l);
    return l;
  });

  useEffect(() => {
    const handler = (e: CustomEvent<{ lang: Lang }>) => {
      if (e.detail?.lang) setLangState(e.detail.lang);
    };
    window.addEventListener(EVENTS.LANGUAGE_CHANGE, handler as EventListener);
    return () => window.removeEventListener(EVENTS.LANGUAGE_CHANGE, handler as EventListener);
  }, []);

  // Refs to avoid stale closures without adding unstable deps (setLanguage
  // is recreated every render because trackLanguageChanged in useTracking is not
  // memoized). Only pathname as dep ensures this effect fires solely on
  // real navigation events, not on every render.
  const langRef = useRef(lang);
  langRef.current = lang;
  const setLanguageRef = useRef<((l: Lang) => Promise<void>) | null>(null);

  useEffect(() => {
    if (pathname === undefined) return;
    const potentialLang = pathname.split('/').filter(Boolean)[0];
    if ((potentialLang === 'en' || potentialLang === 'fr') && potentialLang !== langRef.current) {
      setLanguageRef.current?.(potentialLang as Lang);
    }
  }, [pathname]);

  const setLanguage = useCallback(async (newLang: Lang) => {
    const prevLang = getLanguage();
    await changeLanguage(newLang);
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    document.documentElement.setAttribute('data-lang', newLang);
    document.documentElement.setAttribute('lang', newLang);
    window.dispatchEvent(new CustomEvent(EVENTS.LANGUAGE_CHANGE, { detail: { lang: newLang } }));
    trackLanguageChanged(newLang, prevLang);
  }, [trackLanguageChanged]);

  setLanguageRef.current = setLanguage;

  return { lang, setLanguage, t, tObject };
}
