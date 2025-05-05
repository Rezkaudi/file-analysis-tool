'use client';
import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import SmallSpinner from "../components/common/components/SmallSpinner"

export default function TranslationProvider({ children }: { children: ReactNode }) {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            await i18n.init();
            setInitialized(true);
        };

        if (!i18n.isInitialized) {
            initialize();
        } else {
            setInitialized(true);
        }
    }, []);

    if (!initialized) {
        return <SmallSpinner></SmallSpinner>
    }

    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
}