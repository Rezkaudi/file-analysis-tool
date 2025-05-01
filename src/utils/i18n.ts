import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend) // load translation using http (default public/locales)
    .use(initReactI18next) // pass i18n down to react-i18next
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'jp'],
        ns: ['translation'],
        defaultNS: 'translation',
        debug: process.env.NODE_ENV === 'development',
        backend: {
            // path where resources get loaded from, dynamically based on language and namespace
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
