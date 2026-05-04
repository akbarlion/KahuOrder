import { createContext, useContext, useState, type ReactNode } from 'react';
import id from '@/locales/id.json';
import en from '@/locales/en.json';

type Locale = 'id' | 'en';
type Translations = typeof id;

const translations: Record<Locale, Translations> = { id, en };

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

const STORAGE_KEY = 'locale';

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(
        () => (localStorage.getItem(STORAGE_KEY) as Locale) ?? 'id',
    );

    const setLocale = (newLocale: Locale) => {
        localStorage.setItem(STORAGE_KEY, newLocale);
        setLocaleState(newLocale);
    };

    const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
        let str: string = translations[locale][key] ?? translations['id'][key] ?? key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                str = str.replace(`{{${k}}}`, String(v));
            });
        }
        return str;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
    return ctx;
}
