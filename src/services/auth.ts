import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';
import { getRefreshToken, setAccessToken, setRefreshToken } from '@/utils/authStatus';


const api = axios.create({
    baseURL: apiUrl,
    // withCredentials: true,
});

const endPoint = {
    login: "/v1/user/auth/login-email",
    register: "/v1/user/auth/register",
    verify: "/v1/user/auth/verify",
    refreshToken: "/v1/user/auth/refreshToken"
}

export const login = async (data: LoginFormData) => {
    const response = await api.post(endPoint.login, data);
    await setRefreshToken(response.data.refreshToken)
    await setAccessToken(response.data.accessToken)
    return response.data
    // response is {accessToken,refreshToken,user} (user data)
};

export const signup = async (data: RegisterFormData) => {
    const response = await api.post(endPoint.register, data);
    return response.data;
    // response is {verificationId}
};

export const verify = async (data: VerifyFormData) => {
    const response = await api.post(endPoint.verify, data);
    await setRefreshToken(response.data.refreshToken)
    await setAccessToken(response.data.accessToken)
    return response.data
    // response is {accessToken,refreshToken,user} (user data)
};

export const refreshToken = async () => {
    const refreshToken = await getRefreshToken()
    const response = await api.post(endPoint.refreshToken, {},
        {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        }
    );
    await setRefreshToken(response.data.refreshToken)
    await setAccessToken(response.data.accessToken)
    return response.data
    // response is {accessToken,refreshToken,user} (user data)
};
