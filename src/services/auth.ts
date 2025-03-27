import axios from 'axios';
import { apiUrl } from '@/utils/apiUrl';
import { getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken, setRefreshToken } from '@/utils/authStatus';


const api = axios.create({
    baseURL: apiUrl,
    // withCredentials: true,
});

const endPoint = {
    login: "/v1/user/auth/login-email",
    register: "/v1/user/auth/register",
    verify: "/v1/user/auth/verify",
    refreshToken: "/v1/user/auth/refreshToken",
    resendVerificationCode: "/v1/user/auth/resendVerificationCode",
    forgetPassword: "/v1/user/auth/forgetPasswordFirstStep",
    resetPassword: "/v1/user/auth/forgetPasswordSecondStep"
}

export const login = async (data: LoginFormData) => {
    const response = await api.post(endPoint.login, data);
    await setRefreshToken(response.data.refreshToken)
    await setAccessToken(response.data.accessToken)
    return response.data
    // response is {accessToken,refreshToken,user} (user data)
};

export const logout = async () => {
    await removeRefreshToken()
    await removeAccessToken()
    window.open("/login");
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

export const resendVerificationCode = async (data: VerificationCodeFormData) => {
    const response = await api.post(endPoint.resendVerificationCode, data);
    return response.data
};


export const forgetPassword = async (data: ForgetPasswordFormData) => {
    const response = await api.post(endPoint.forgetPassword, data);
    return response.data
    // response is {verificationId}
};

export const resetPassword = async (data: ResetPasswordFormData) => {
    const response = await api.post(endPoint.resetPassword, data);
    await setRefreshToken(response.data.refreshToken)
    await setAccessToken(response.data.accessToken)
    return response.data
    // response is {accessToken,refreshToken,user} (user data)
};




