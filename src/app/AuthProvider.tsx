"use client"

import Loading from "@/components/common/components/Loading";
import { useAuthStore } from "@/store/useAuthStore";
import { ReactNode, useEffect } from "react";

interface IAuthProvider {
    children: ReactNode
}

const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
    const { checkAuth, isLoading } = useAuthStore()

    useEffect(() => {
        checkAuth()
        console.log("check")
    }, [checkAuth])

    return (
        <>
            {isLoading ? <Loading /> : children}
        </>
    )
};

export default AuthProvider;
