

'use client';
import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from 'react';
import { User, Globe, CreditCard, MessageCircleCodeIcon, BriefcaseBusiness } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher'; // Make sure to import

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    onClick?: () => Promise<void> | void;
    badge?: any;
    type?: 'button' | 'language';
}

export default function ProfileDropdown() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { user, logoutUser, userBalance } = useAuthStore();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logoutUser(router);
        setIsOpen(false);
    };

    const menuItems: MenuItem[] = [
        {
            label: t("header.yourCredits"),
            icon: <CreditCard className="w-4 h-4" />,
            type: 'language',
            badge: userBalance
        },
        {
            label: t("profileDropDown.history"),
            icon: <BriefcaseBusiness className="w-4 h-4" />,
            onClick: () => {
                setIsOpen(false)
                router.push('/history')
            }
        },
        {
            label: t("profileDropDown.buyCredits"),
            icon: <CreditCard className="w-4 h-4" />,
            onClick: () => {
                setIsOpen(false)
                router.push('/plans')
            }
        },
        {
            label: t("profileDropDown.feedback"),
            icon: <MessageCircleCodeIcon className="w-4 h-4" />,
            onClick: () => {
                setIsOpen(false)
                router.push('/feedback')
            }
        },
        {
            label: t("profileDropDown.changePassword"),
            icon: <User className="w-4 h-4" />,
            onClick: () => {
                setIsOpen(false)
                router.push('/change-password')
            }
        },
        // REMOVED LANGUAGE ITEM HERE
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 focus:outline-none"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                <Image
                    src={user?.imageUrl || "/images/user.png"}
                    alt={user?.name || "Profile"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    {/* User info section */}
                    <div className="px-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                            <Image
                                src={user?.imageUrl || "/images/user.png"}
                                alt={user?.name || "Profile"}
                                width={40}
                                height={40}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">{user?.name || "Cody Fisher"}</p>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                        Pro
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">{user?.email || "c.fisher@gmail.com"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                        {menuItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.type === 'language' ? (
                                    <div className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center space-x-2">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">{item.badge}</span>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        onClick={item.onClick}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                        {/* ADDED LANGUAGE SWITCHER HERE */}
                        <div className="px-4 py-2.5 hover:bg-gray-50">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <Globe className="w-4 h-4" />
                                <LanguageSwitcher inDropdown />
                            </div>
                        </div>
                    </div>

                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-center px-4 py-2.5 border-t ">
                        <button
                            className={`relative rounded-lg w-full mx-2 py-1 transition-colors border text-gray-700 hover:bg-gray-50`}
                            aria-label="Toggle dark mode"
                            onClick={handleLogout}
                        >
                            {t('profileDropDown.logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}