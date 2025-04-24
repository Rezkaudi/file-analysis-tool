import { checkAuthStatus, getUserData } from "@/utils/authStatus";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const useCheckAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const pathname = usePathname();

    const checkAuth = async () => {
        const isAuthenticated = await checkAuthStatus();
        setIsLoggedIn(isAuthenticated);
    };



    useEffect(() => {
        getUserData().then((data) => {
            setUserData(data)
        })
        checkAuth()
    }, [pathname])

    return {
        isLoggedIn,
        userData
    }
};

export default useCheckAuth;
