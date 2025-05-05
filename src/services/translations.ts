import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';


const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})


const endPoint = {
    languages: "",
    translations: "http://127.0.0.1:8000/api/translations/", // for now : it fetches the translations from the admin panel ( for testing purposes)
}




export const fetchTranslations = async (language: string) => {
    return await api.get(`${endPoint.translations}${language}`); // Changed to GET with language in URL
};

