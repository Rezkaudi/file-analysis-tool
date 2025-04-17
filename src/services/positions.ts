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

export const getPositions = async (page: number, pageSize: number = 20) => {
    const response = await api.get(`/v1/user/positions?pageNumber=${page}&pageSize=${pageSize}`);
    return response.data;
};

export const createPosition = async (data: WorkPositionFormData) => {
    const response = await api.post('/v1/user/positions', data);
    return response.data;
};

export const updatePosition = async (id: string, data: WorkPositionFormData) => {
    const response = await api.put(`/v1/user/positions/${id}`, data);
    return response.data;
};

export const duplicatePosition = async (id: string) => {
    const response = await api.post(`/v1/user/positions/${id}/duplicate`, {});
    return response.data;
};

export const deletePosition = async (id: string) => {
    await api.delete(`/v1/user/positions/${id}`);
};

export const getPositionById = async (id: string) => {
    const response = await api.get(`/v1/user/positions/${id}`);
    return response.data;
};

export const startProcessing = async (id: string) => {
    const response = await api.patch(`/v1/user/positions/${id}/startProcessing`);
    return response.data;
};