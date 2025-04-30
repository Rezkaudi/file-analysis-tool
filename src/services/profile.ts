import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';
import { getAccessToken } from '@/utils/authStatus';

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

const endPoint = {
    profile: "/v1/user/profile",
    balance: "/v1/user/pointsCharges/balance",
    history: "/v1/user/pointsCharges/history",
    changePassword: "/v1/user/profile/password",
    products: "/v1/user/payment/products"
}

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

export const getHistory = async (page: number, pageSize: number = 20) => {
    const response = await api.get(`${endPoint.history}?pageNumber=${page}&pageSize=${pageSize}`);
    return response.data;
};

export const getBalance = async () => {
    const response = await api.get(endPoint.balance);
    return response.data;
};

export const getProfileData = async () => {
    const response = await api.get(endPoint.profile);
    return response.data;
};

export const changePassword = async (data: ChangePasswordFormData) => {
    await api.patch(endPoint.changePassword, data);
};

export const getProducts = async () => {
    const response = await api.get(endPoint.products);
    return response.data;
};

export const buyProducts = async () => {
    const response = await api.get(endPoint.products);
    return response.data;
};
