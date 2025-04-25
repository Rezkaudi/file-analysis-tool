import Cookies from 'js-cookie';

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
        console.log("checkAuthStatus")
        const accessToken = Cookies.get(finalConfig.accessTokenName);
        console.log(!!accessToken && accessToken.length > 0)
        return !!accessToken && accessToken.length > 0;
    } catch (error) {
        console.error('Error checking authentication:', error);
        throw error
    }
}

/**
 * Sets the access token with proper security settings
 */
export async function setAccessToken(accessToken: string): Promise<void> {
    try {
        Cookies.set(finalConfig.accessTokenName, accessToken, {
            expires: finalConfig.accessTokenDuration,
            secure: true,
            sameSite: "strict",
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
        const accessToken = Cookies.get(finalConfig.accessTokenName);
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
        Cookies.set(finalConfig.refreshTokenName, refreshToken, {
            expires: finalConfig.refreshTokenDuration,
            secure: true,
            sameSite: "strict",
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
        const refreshToken = Cookies.get(finalConfig.refreshTokenName);
        return refreshToken || null;
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
}

export async function removeRefreshToken(): Promise<void> {
    try {
        Cookies.remove(finalConfig.refreshTokenName);
    } catch (error) {
        console.error('Error removing refresh token:', error);
    }
}

export async function removeAccessToken(): Promise<void> {
    try {
        Cookies.remove(finalConfig.accessTokenName);
    } catch (error) {
        console.error('Error removing access token:', error);
    }
}


export async function setUserData(user: User): Promise<void> {
    try {
        Cookies.set(finalConfig.userDataName, JSON.stringify(user), {
            expires: finalConfig.accessTokenDuration,
            secure: true,
            sameSite: "strict",
        });
    } catch (error) {
        console.error('Error setting user data:', error);
        throw error;
    }
}

export async function getUserData(): Promise<User | null> {
    try {
        const userData = Cookies.get(finalConfig.userDataName);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
}

export async function removeUserData(): Promise<void> {
    try {
        Cookies.remove(finalConfig.userDataName);
    } catch (error) {
        console.error('Error removing user data:', error);
        throw error;
    }
}