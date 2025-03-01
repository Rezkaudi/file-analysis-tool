"use client"
import { checkAuthStatus } from "@/utils/authStatus";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Header: React.FC = () => {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkAuth = async () => {
        const isAuthenticated = await checkAuthStatus();
        setIsLoggedIn(isAuthenticated);
    };

    useEffect(() => {
        checkAuth()
    }, [pathname]);

    return (
        <header className="w-full h-16 lg:h-20 sticky top-0 z-50 bg-[#8926a4] text-white" aria-label="Website Header">
            <div className="px-4 lg:px-7 flex overflow-y-auto w-full items-center justify-between gap-8 h-full relative">
                {/* logo */}
                <Link href="/" className="relative block text-xl lg:text-3xl font-black">
                    File Analysis Tool
                </Link>

                {/* Only show login button if not logged in AND not on login page */}
                {!isLoggedIn && (
                    <Link
                        href="/login"
                        className="relative block text-xl bg-white text-[#8926a4] py-2 px-4 rounded font-black"
                    >
                        LogIn
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;