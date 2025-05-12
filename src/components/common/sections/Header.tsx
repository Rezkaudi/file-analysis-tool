"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./components/ProfileDropdown";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import FloatingFeedbackButton from "@/components/common/sections/components/FloatingFeedbackButton";
import React from "react";

const Header: React.FC = () => {
    const {t} = useTranslation();
    const pathname = usePathname();
    const { isAuthenticated, userBalance } = useAuthStore()

    return (
        <header className="w-full h-20 lg:h-20 sticky top-0 z-50 bg-primary text-white" aria-label="Website Header">
            <div className="px-4 lg:px-7 flex w-full justify-between items-center gap-8 h-full relative">
                {/* logo */}
                <Link href="/" className="relative block text-xl w-[200px] h-[40px] lg:text-3xl font-black">
                    <Image src={"/images/logo1.png"} unoptimized fill alt="" className=" object-contain" />
                </Link>
                <LanguageSwitcher></LanguageSwitcher>
                {/* Only show login button if not logged in AND not on login page */}
                {!isAuthenticated ? (
                    pathname !== "/login" && <Link
                        href="/login"
                        className=" block text-xl bg-white text-primary py-2 px-4 rounded font-black"
                    >
                        {t("header.login")}
                    </Link>
                ) :
                    <div className="flex items-center justify-end md:justify-between gap-5  w-full">
                        <div className="hidden md:flex items-center justify-between gap-5 ">
                            <Link href="/" className="relative block text-md lg:text-lg font-black">
                                {t("header.useCases")}
                            </Link>

                            <Link href="/plans" className="relative block text-md lg:text-lg font-black">
                                {t("header.pricing")}
                            </Link>
                        </div>
                        <div className="flex items-center justify-between gap-2 md:gap-5">
                            <span className="text-lg block">
                                {t("header.yourCredits")} : {userBalance || 0}
                            </span>
                            <ProfileDropdown />
                            <FloatingFeedbackButton />
                        </div>
                    </div>
                }
            </div>
        </header>
    );
};

export default Header;