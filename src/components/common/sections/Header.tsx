"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./components/ProfileDropdown";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import FloatingFeedbackButton from "@/components/common/sections/components/FloatingFeedbackButton";

const Header = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full bg-primary text-white shadow-md transition-all">
            <div className="mx-auto flex h-20 items-center justify-between px-4 md:px-10 lg:px-20">
                {/* Logo */}
                <Link href="/" className="relative h-10 w-36 md:h-12 md:w-48">
                    <Image
                        src="/images/logo1.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                        unoptimized
                    />
                </Link>

                {!isAuthenticated && pathname !== "/login" ? (
                    <Link
                        href="/login"
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary shadow hover:opacity-90 transition duration-300"
                    >
                        {t("header.login")}
                    </Link>
                ) : (
                    <div className="flex items-center md:pl-16 md:w-full justify-between gap-4">
                        <nav className="hidden gap-6 text-lg font-semibold md:flex">
                            <Link href="/" className="hover:opacity-80 transition">{t("header.useCases")}</Link>
                            <Link href="/plans" className="hover:opacity-80 transition">{t("header.pricing")}</Link>
                        </nav>
                        <FloatingFeedbackButton />
                        <ProfileDropdown />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
