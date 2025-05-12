import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fetchTranslations } from '@/services/translations';
import {toast} from "sonner";

const LOCAL_TRANSLATIONS_PATH = '/locales/{{lng}}/translation.json';
const API_RETRY_INTERVAL = 7000; // 7 seconds

// Track offline state and retry timers
let isOfflineMode = false;
const retryTimers: Record<string, NodeJS.Timeout> = {};

const transformTranslations = (apiResponse: Array<{
    translation_key: string;
    value: string;
}>) => {
    const result: Record<string, any> = {};

    apiResponse.forEach(({ translation_key, value }) => {
        const keys = translation_key.split('.');
        let current = result;

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        });
    });

    return result;
};

const loadLocalTranslations = async (lng: string) => {
    try {
        const localPath = LOCAL_TRANSLATIONS_PATH.replace('{{lng}}', lng);
        const response = await fetch(localPath);

        if (!response.ok) throw new Error('Local fetch failed');

        const translations = await response.json();
        toast.warning(`Using offline translations for ${lng}`);
        return translations;
    } catch (error) {
        toast.error(`Failed to load local translations:${error}`);
        return {};
    }
};

const scheduleApiRetry = (lng: string, callback: (error: any, data?: any) => void) => {
    if (retryTimers[lng]) {
        clearTimeout(retryTimers[lng]);
    }

    retryTimers[lng] = setTimeout(async () => {
        if (!isOfflineMode) {
            console.log(`Retrying API fetch for ${lng}`);
            try {
                const apiResponse = await fetchTranslations(lng);

                if (apiResponse.status < 308) {
                    const transformed = transformTranslations(apiResponse.data);
                    callback(null, transformed);
                    return;
                }
            } catch (error) {
                toast.error(`API retry failed for ${lng}: ${error}`, );
            }

            // If retry failed, schedule next attempt
            scheduleApiRetry(lng, callback);
        }
    }, API_RETRY_INTERVAL);
};

const CustomBackend = {
    type: 'backend' as const,
    init() {},
    async read(lng: string, ns: string, callback: (error: any, data?: any) => void) {
        // 1. If offline, use local immediately
        if (isOfflineMode) {
            const localTranslations = await loadLocalTranslations(lng);
            return callback(null, localTranslations);
        }

        // 2. Try API first
        try {
            const apiResponse = await fetchTranslations(lng);

            if (apiResponse.status < 308) {
                const transformed = transformTranslations(apiResponse.data);
                return callback(null, transformed);
            }

            // 3. If API fails, use local but schedule retry
            const localTranslations = await loadLocalTranslations(lng);
            scheduleApiRetry(lng, callback);
            return callback(null, localTranslations);

        } catch (error) {
            toast.error(`API translation fetch failed: ${error}` );
            isOfflineMode = true;

            // 4. Final fallback to local
            const localTranslations = await loadLocalTranslations(lng);
            return callback(null, localTranslations);
        }
    }
};

i18n
    .use(CustomBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ff', //english offline
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

// Reset offline mode and clear retries on successful language change
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
    isOfflineMode = false;
    Object.values(retryTimers).forEach(timer => clearTimeout(timer));
});

// // Network status detection
// window.addEventListener('online', () => {
//     isOfflineMode = false;
//     console.log('Connection restored, exiting offline mode');
// });
//
// window.addEventListener('offline', () => {
//     isOfflineMode = true;
//     Object.values(retryTimers).forEach(timer => clearTimeout(timer));
//     console.warn('Network offline, using local translations');
// });

export default i18n;