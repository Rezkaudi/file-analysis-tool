'use server'

import { cookies } from "next/headers";


export const checkAuthStatus = async (): Promise<boolean> => {
    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        return !!accessToken && accessToken.length > 0;

    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
};

export async function setAccessToken(accessToken: string) {
    try {
        const cookieStore = cookies();
        (await cookieStore).set("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 0.5 * 60 * 60, // 0.5 hours
            secure: true,
            sameSite: "strict"
        });
    } catch (error) {
        console.error('Error setting access token:', error);
        return null;
    }
}

export async function getAccessToken() {
    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        return accessToken;
    } catch (error) {
        console.error('Error setting access token:', error);
        return null;
    }
}