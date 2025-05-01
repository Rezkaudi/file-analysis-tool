'use client';
import {useTranslation} from "react-i18next";

export default function LanguageSwitcher () {
    const {i18n} = useTranslation();

    return (
        <div className="bg-primary  , text-white"><select className="bg-primary"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="jp">Japanese</option>
        </select></div>

    );
}