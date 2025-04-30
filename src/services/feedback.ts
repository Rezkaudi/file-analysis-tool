import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';
import { getAccessToken } from '@/utils/authStatus';


const api = axios.create({
    baseURL:apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

const endPoint = {
    feedback: "/v1/user/feedbacks",
    uploadPhoto: "/v1/user/uploads/feedback",
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

export const submitFeedback = async (title: string, description: string , imageUrl:string) => {

    return  await api.post(endPoint.feedback, {
        title,
        description,
        imageUrl,
    });
};


export const uploadPhoto = async (file:File) => {
    return  await api.post(endPoint.uploadPhoto, {
      file
    },
        {
        headers: {'Content-Type': 'multipart/form-data'}
        }
    );
}