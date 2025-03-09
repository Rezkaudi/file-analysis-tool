import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';


const api = axios.create({
    baseURL: apiUrl
});

export const login = async (data: LoginFormData) => {
    const response = await api.post(
        "/v1/user/auth/login-email", data
    );
    return response.data;
};

