'use server';
import { cookies } from "next/headers";

interface AuthConfig {
    accessTokenName: string;
    refreshTokenName: string;
    userDataName: string
    accessTokenDuration: number; // in seconds
    refreshTokenDuration: number; // in seconds
}

const DEFAULT_CONFIG: AuthConfig = {
    accessTokenName: 'accessToken',
    refreshTokenName: 'refreshToken',
    userDataName: "userData",
    accessTokenDuration: 12 * 60 * 60, // 12 hours
    refreshTokenDuration: 30 * 24 * 60 * 60 // 30 days
};

const finalConfig = { ...DEFAULT_CONFIG };


export async function checkAuthStatus(): Promise<boolean> {
    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get(finalConfig.accessTokenName)?.value;
        return !!accessToken && accessToken.length > 0;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

/**
 * Sets the access token with proper security settings
 */
export async function setAccessToken(accessToken: string): Promise<void> {
    try {
        const cookieStore = cookies();
        (await cookieStore).set(finalConfig.accessTokenName, accessToken, {
            httpOnly: true,
            maxAge: finalConfig.accessTokenDuration,
            secure: true,
            sameSite: "strict",
            path: "/"
        });
    } catch (error) {
        console.error('Error setting access token:', error);
        throw error;
    }
}

/**
 * Gets the access token value
 */
export async function getAccessToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get(finalConfig.accessTokenName)?.value;
        return accessToken || null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

/**
 * Sets the refresh token with proper security settings
 */
export async function setRefreshToken(refreshToken: string): Promise<void> {
    try {
        const cookieStore = cookies();
        (await cookieStore).set(finalConfig.refreshTokenName, refreshToken, {
            httpOnly: true,
            maxAge: finalConfig.refreshTokenDuration,
            secure: true,
            sameSite: "strict",
            path: "/"
        });
    } catch (error) {
        console.error('Error setting refresh token:', error);
        throw error;
    }
}

/**
 * Gets the refresh token value
 */
export async function getRefreshToken(): Promise<string | null> {
    try {
        const cookieStore = cookies();
        const refreshToken = (await cookieStore).get(finalConfig.refreshTokenName)?.value;
        return refreshToken || null;
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
}

export async function removeRefreshToken(): Promise<void> {
    try {
        const cookieStore = cookies();
        (await cookieStore).delete(finalConfig.refreshTokenName);
    } catch (error) {
        console.error('Error removing refresh token:', error);
    }
}

export async function removeAccessToken(): Promise<void> {
    try {
        const cookieStore = cookies();
        (await cookieStore).delete(finalConfig.accessTokenName);
    } catch (error) {
        console.error('Error removing access token:', error);
    }
}


export async function setUserData(user: User): Promise<void> {
    try {
        const cookieStore = cookies();
        (await cookieStore).set(finalConfig.userDataName, JSON.stringify(user), {
            httpOnly: true,
            maxAge: finalConfig.accessTokenDuration,
            secure: true,
            sameSite: "strict",
            path: "/"
        });
    } catch (error) {
        console.error('Error setting user data:', error);
        throw error;
    }
}

export async function getUserData(): Promise<User | null> {
    try {
        const cookieStore = cookies();
        const userData = (await cookieStore).get(finalConfig.userDataName);
        return userData ? JSON.parse(userData.value) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

export async function removeUserData(): Promise<void> {
    try {
        const cookieStore = cookies();
        (await cookieStore).delete(finalConfig.userDataName);
    } catch (error) {
        console.error('Error removing user data:', error);
    }
}