'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
    CreditCard, BriefcaseBusiness, MessageCircleCodeIcon,
    User, Globe
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const dropdownVariants = {
    hidden: { opacity: 0, y: -10, pointerEvents: "none" },
    visible: { opacity: 1, y: 0, pointerEvents: "auto" },
};

export default function ProfileDropdown() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logoutUser, userBalance } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const menuItems = [
        {
            label: t("header.yourCredits"),
            icon: <CreditCard className="w-4 h-4" />,
            badge: userBalance
        },
        {
            label: t("profileDropDown.history"),
            icon: <BriefcaseBusiness className="w-4 h-4" />,
            onClick: () => router.push('/history')
        },
        {
            label: t("profileDropDown.buyCredits"),
            icon: <CreditCard className="w-4 h-4" />,
            onClick: () => router.push('/plans')
        },
        {
            label: t("profileDropDown.feedback"),
            icon: <MessageCircleCodeIcon className="w-4 h-4" />,
            onClick: () => router.push('/feedback')
        },
        {
            label: t("profileDropDown.changePassword"),
            icon: <User className="w-4 h-4" />,
            onClick: () => router.push('/change-password')
        }
    ];

    const handleLogout = async () => {
        await logoutUser(router);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-full border-2 border-white shadow-sm transition hover:opacity-90"
            >
                <Image
                    src={user?.imageUrl || "/images/user.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
                    >
                        <div className="border-b px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={user?.imageUrl || "/images/user.png"}
                                    alt={user?.name || ""}
                                    width={40}
                                    height={40}
                                    className="rounded-full border"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y">
                            <div className="py-1">
                                {menuItems.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            item.onClick?.();
                                            setIsOpen(false);
                                        }}
                                        className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        {item.badge !== undefined && (
                                            <span className="text-xs text-gray-500">{item.badge}</span>
                                        )}
                                    </button>
                                ))}
                                <div className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <Globe className="w-4 h-4" />
                                    <LanguageSwitcher inDropdown />
                                </div>
                            </div>

                            <div className="py-2 px-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-md bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 text-sm font-medium"
                                >
                                    {t("profileDropDown.logout")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
