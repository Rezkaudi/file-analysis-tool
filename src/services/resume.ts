
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

export const addResume = async (file: File, positionId: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await api.post('/v1/user/uploads/resume', formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    const path = uploadResponse.data.url
    const fileName = file.name.replace('.pdf', '');

    const response = await api.post('/v1/user/positions/resumes', {
        positionId,
        path,
        title: fileName
    });

    return response.data;
};

export const deleteResume = async (id: string) => {
    await api.delete(`/v1/user/positions/resumes/${id}`);
};

export const getResumeFile = async (id: string) => {
    const response = await api.get(`/v1/user/positions/resumes/${id}/file`);
    const url = response.data.url;

    window.open(url, '_blank');
};