
import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';
import { getAccessToken } from '@/utils/authStatus';


const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const addCritiria = async (positionId: string, description: string) => {
    const response = await api.post('/v1/user/positions/criterias', {
        positionId,
        description
    });
    return response;
};

export const deleteCritiria = async (id: string) => {
    await api.delete(`/v1/user/positions/criterias/${id}`);
};