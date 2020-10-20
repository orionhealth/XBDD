import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const locale = 'en-AU';

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
      format: (value: any): string => {
        if (value instanceof Date) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
          };
          return new Intl.DateTimeFormat(locale, options).format(value);
        }

        return value;
      },
    },
  });

export default i18n;
