'use client';
import { ReactNode, useEffect, } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';

export default function TranslationProvider({ children }: { children: ReactNode }) {

    useEffect(() => {
        const initialize = async () => {
            await i18n.init();
        };

        if (!i18n.isInitialized) {
            initialize();
        } else {
        }
    }, []);


    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
}