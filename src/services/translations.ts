import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';


const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',

    }
})


const endPoint = {
    languages: "v1/languages",
    translations: "v1/translations/",
}




export const fetchTranslations = async (language: string) => {
    return await api.get(`${endPoint.translations}${language}`);
};

// Add this to your existing translations service
export const getLanguages = async () => {
    return await api.get(endPoint.languages);
};

