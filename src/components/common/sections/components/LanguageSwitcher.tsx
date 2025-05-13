'use client';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getLanguages } from "@/services/translations";



interface Language {
    code: string;
    name: string;
    direction: string;
}


export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadLanguages = async () => {
            try {
                //check if the languages are cached before calling the api
                const cachedLangs = localStorage.getItem('availableLanguages');
                if (cachedLangs) {
                    setLanguages(JSON.parse(cachedLangs));
                }
                //if now cached , cal the api endpoint

                const response = await getLanguages();
                setLanguages(response.data);
                setLoading(false);
                //cache the fetched languages
                localStorage.setItem('availableLanguages', JSON.stringify(response.data));
            } catch (error) {
                console.error("Failed to load languages:", error);
                // Fallback to default languages if API fails
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
        console.log(selectedLang);
        if (!selectedLang) {
            i18n.changeLanguage(langCode);
            document.documentElement.dir = "ltr";
        }

        // document.documentElement.dir = selectedLang.direction;
        if (selectedLang) {
            i18n.changeLanguage(langCode); // replace langCode with 'jp' to test japanese language after commiting fetching languages from the backend in the i18n.ts  (fast local testing)
            document.documentElement.dir = selectedLang.direction;
        }
    };

    if (loading) {
        return (
            <div className="bg-primary text-white p-2 rounded">
                Loading languages...
            </div>
        );
    }


    return (
        <div className="bg-primary  , text-white">
            <select
                className="bg-primary text-white p-1 rounded border-none focus:outline-none"
                value={i18n.language}
                onChange={handleLanguageChange}>


                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}

                <option value="jp">
                    Japanese Offline
                </option>

                <option value="ff">
                    English Offline
                </option>


            </select></div>

    );
}