"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./components/ProfileDropdown";
import { useAuthStore } from "@/store/useAuthStore";

const Header: React.FC = () => {
    const pathname = usePathname();
    const { isAuthenticated, userBalance } = useAuthStore()

    return (
        <header className="w-full h-20 lg:h-20 sticky top-0 z-50 bg-mainPurple text-white" aria-label="Website Header">
            <div className="px-4 lg:px-7 flex w-full justify-between items-center gap-8 h-full relative">
                {/* logo */}
                <Link href="/" className="relative block text-xl lg:text-3xl font-black">
                    Resumate
                </Link>

                {/* Only show login button if not logged in AND not on login page */}
                {!isAuthenticated ? (
                    pathname !== "/login" &&
                    <Link href="/login" className=" block text-xl bg-white text-mainPurple py-2 px-4 rounded font-black">
                        Login
                    </Link>
                ) :
                    <div className="flex items-center justify-end md:justify-between gap-5  w-full">
                        <div className="hidden md:flex items-center justify-between gap-5 ">
                            <Link href="/" className="relative block text-md lg:text-lg font-black">
                                Use Cases
                            </Link>

                            <Link href="/plans" className="relative block text-md lg:text-lg font-black">
                                Plans
                            </Link>
                        </div>
                        <div className="flex items-center justify-between gap-2 md:gap-5">
                            {userBalance &&
                                <span className="text-lg block">
                                    Balance : {userBalance}
                                </span>
                            }
                            <ProfileDropdown />
                        </div>
                    </div>
                }
            </div>
        </header>
    );
};

export default Header;