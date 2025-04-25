import { create } from "zustand";
import { AxiosError } from 'axios';

import { checkAuthStatus, getUserData } from '@/utils/authStatus';

import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getBalance } from "@/services/profile";
import { login, logout, signup, verify, refreshToken, resendVerificationCode, forgetPassword, resetPassword } from "@/services/auth";

interface AuthState {
    user: User | null;
    userBalance: number | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    logoutUser: (router: AppRouterInstance) => Promise<void>;
    getUserBalance: () => Promise<void>;
    loginUser: (data: LoginFormData, router: AppRouterInstance) => Promise<void>;
    error: string | null,
    signupUser: (data: RegisterFormData, router: AppRouterInstance) => Promise<void>;
    verifyUser: (data: VerifyFormData, router: AppRouterInstance) => Promise<void>;
    refreshTokenUser: () => Promise<void>;
    resendVerificationCodeUser: (data: VerificationCodeFormData, router: AppRouterInstance) => Promise<void>;
    forgetPasswordUser: (data: ForgetPasswordFormData, router: AppRouterInstance) => Promise<void>;
    resetPasswordUser: (data: ResetPasswordFormData, router: AppRouterInstance) => Promise<void>;
    resendVerificationCodeForResetUser: (data: VerificationCodeFormData, router: AppRouterInstance) => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({

    user: null,
    userBalance: null,
    error: null,
    isAuthenticated: false,
    isLoading: true,

    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const isAuth = await checkAuthStatus();
            const user = await getUserData();

            if (isAuth) {
                await useAuthStore.getState().getUserBalance();
            }
            set({ user, isAuthenticated: isAuth, isLoading: false });

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.log(axiosError.status)

            if (axiosError.status === 401) {
                await logout()
                window.location.href = "/login"
            }

            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
            set({ isLoading: false });
        }
    },

    logoutUser: async () => {
        set({ error: null });
        try {

            window.location.href = "/login"
            await logout()

            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
            set({ isLoading: false, isAuthenticated: false });
        }
    },

    loginUser: async (data: LoginFormData) => {
        set({ error: null });
        try {
            const response = await login(data)
            await useAuthStore.getState().getUserBalance();

            window.location.href = "/"

            set({ user: response.user, isAuthenticated: true, isLoading: false });

            toast.success("Login successful");
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data?.statusCode === 401) {
                toast.error("Invalid email or password. Please try again.");
            }
            else {
                toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
            }
            set({ error: "Authentication failed", isLoading: false, isAuthenticated: false });
        }
    },

    getUserBalance: async () => {
        set({ error: null });

        const response = await getBalance()

        set({ userBalance: response.balance || null, isLoading: false });
    },

    signupUser: async (data: RegisterFormData, router: AppRouterInstance) => {
        set({ error: null });
        try {
            const response = await signup(data)
            router.push(`/verify?verificationId=${response.verificationId}`);

            toast.success("Registration successful! Please verify your account.");

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data?.statusCode === 409) {
                toast.error(`${axiosError.response?.data?.message}: This Email addresses already registered` || "Failed. Please try again.");
            }
            else {
                toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
            }

        } finally {
            set({ isLoading: false });
        }
    },

    verifyUser: async (data: VerifyFormData, router: AppRouterInstance) => {
        set({ error: null });
        try {
            const response = await verify(data)

            set({ user: response.user, isAuthenticated: true });
            await useAuthStore.getState().getUserBalance();

            router.push("/profile");

            toast.success("Account verified successfully!");

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            set({ isLoading: false });
        }
    },

    refreshTokenUser: async () => {
        set({ error: null });
        try {
            const response = await refreshToken()

            set({ user: response.user, isAuthenticated: true, isLoading: false });

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            set({ isLoading: false });
        }
    },

    resendVerificationCodeUser: async (data: VerificationCodeFormData, router: AppRouterInstance) => {
        set({ error: null });
        try {
            const response = await resendVerificationCode(data)
            router.push(`/verify?verificationId=${response.verificationId}`);

            toast.info("A new verification code has been sent.")

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            set({ isLoading: false });
        }
    },

    forgetPasswordUser: async (data: ForgetPasswordFormData, router: AppRouterInstance) => {
        set({ error: null });
        try {
            const response = await forgetPassword(data)
            router.push(`/reset-password?verificationId=${response.verificationId}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            set({ isLoading: false });
        }
    },

    resetPasswordUser: async (data: ResetPasswordFormData, router: AppRouterInstance) => {
        set({ error: null });
        try {
            const response = await resetPassword(data)
            router.push("/profile");
            await useAuthStore.getState().getUserBalance();

            set({ user: response.user, isAuthenticated: true });
            toast.success("Reset Password successfully!");

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            set({ isLoading: false });
        }
    },

    resendVerificationCodeForResetUser: async (data: VerificationCodeFormData, router: AppRouterInstance) => {
        set({ error: null });
        try {
            const response = await resendVerificationCode(data)
            router.push(`/reset-password?verificationId=${response.verificationId}`);

            toast.info("A new verification code has been sent.")

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            set({ isLoading: false });
        }
    },

}));
