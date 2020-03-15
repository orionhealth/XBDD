import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    fallbackLng: 'en',
    preload: ['en'],
    debug: process.env.REACT_APP_DEBUG === 'ON',
    interpolation: {
      escapeValue: false,
      format: (value: any, format?: string, lng?: string): string => {
        if (value instanceof Date) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          };
          return new Intl.DateTimeFormat(lng, options).format(value);
        }

        return value;
      },
    },
  });

export default i18n;
