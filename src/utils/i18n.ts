import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fetchTranslations } from '@/services/translations';
import {toast} from "sonner";

const CustomBackend = {
    type: 'backend' as const,
    init() {},
    async read(lng: string, ns: string, callback: (error: any, data?: any) => void) {
        try {
            const response = await fetchTranslations(lng);

            if (response.status >= 400) {
                throw new Error(`Translation fetch failed: ${response.statusText}`);
            }

            // Handle direct key-value pairs response
            const translations = response.data;
            callback(null, translations);

        } catch (error) {
            toast.error( "Failed to load translation. Please try again.");
            console.error('Failed to load translations:', error);
            callback(error, {}); // Provide empty fallback
        }
    }
};

i18n
    .use(CustomBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: process.env.NODE_ENV !== 'production',
        ns: ['translation'],
        defaultNS: 'translation',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        },
        interpolation: {
            escapeValue: false
        }
    });

// Sync language changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
});

export default i18n;