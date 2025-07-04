'use client';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getLanguages } from "@/services/translations";

interface Language {
    code: string;
    name: string;
    direction: string;
}

interface LanguageSwitcherProps {
    inDropdown?: boolean;
}

export default function LanguageSwitcher({ inDropdown = false }: LanguageSwitcherProps) {
    const { i18n } = useTranslation();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLanguages = async () => {
            try {
                const cachedLangs = localStorage.getItem('availableLanguages');
                if (cachedLangs) {
                    setLanguages(JSON.parse(cachedLangs));
                }

                const response = await getLanguages();
                setLanguages(response.data);
                setLoading(false);
                localStorage.setItem('availableLanguages', JSON.stringify(response.data));
            } catch (error) {
                console.error("Failed to load languages:", error);
                setLanguages([
                    { code: "ff", name: "English", direction: "ltr" },
                ]);
                setLoading(false);
            }
        };

        loadLanguages();
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const langCode = e.target.value;
        const selectedLang = languages.find(lang => lang.code === langCode);

        if (selectedLang) {
            i18n.changeLanguage(langCode);
            document.documentElement.dir = selectedLang.direction;
        } else {
            i18n.changeLanguage(langCode);
            document.documentElement.dir = "ltr";
        }
    };

    // STYLING FOR DROPDOWN CONTEXT
    if (inDropdown) {
        if (loading) {
            return (
                <span className="text-gray-500 text-sm">
                    Loading...
                </span>
            );
        }

        return (
            <select
                className="bg-transparent text-gray-700 text-sm border-none focus:outline-none focus:ring-0 cursor-pointer"
                value={i18n.language}
                onChange={handleLanguageChange}
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
                <option value="jp">Japanese</option>
                <option value="ff">English</option>
            </select>
        );
    }

    // DEFAULT STYLING (STANDALONE)
    if (loading) {
        return (
            <div className="bg-primary text-white p-2 rounded">
                Loading languages...
            </div>
        );
    }

    return (
        <div className="bg-primary text-white">
            <select
                className="bg-primary text-white p-1 rounded border-none focus:outline-none"
                value={i18n.language}
                onChange={handleLanguageChange}
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
                <option value="jp">Japanese</option>
                <option value="ff">English</option>
            </select>
        </div>
    );
}