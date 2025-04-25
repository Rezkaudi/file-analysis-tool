import React, { useState, useRef, useEffect } from 'react';
import { User, CreditCard, LogOut, BriefcaseBusiness } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    onClick?: () => Promise<void> | void
}

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logoutUser } = useAuthStore()
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const menuItems: MenuItem[] = [
        {
            label: 'History',
            icon: <BriefcaseBusiness className="w-4 h-4" />,
            onClick: () => {
                setIsOpen(false)
                router.push('/history')
            }
        },
        {
            label: 'Buy Credits',
            icon: <CreditCard className="w-4 h-4" />,
            onClick: () => {
                setIsOpen(false)
                router.push('/payments')
            }
        },
        // {
        //     label: 'Feedback',
        //     icon: <MessageSquare className="w-4 h-4" />,
        //     onClick: () => {
        //         setIsOpen(false)
        //         router.push('/feedback')
        //     }
        // },
        {
            label: 'Change Password',
            icon: <User className="w-4 h-4" />,
            onClick: () => {
                setIsOpen(false)
                router.push('/change-password')
            }
        },
        {
            label: 'Logout',
            icon: <LogOut className="w-4 h-4" />,
            onClick: async () => {
                await logoutUser(router);
                setIsOpen(false)
            }
        },
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
            >
                <Image
                    src={user?.imageUrl || "/images/user.png"}
                    alt={user?.name || "Profile"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <span>{user?.name}</span>
                <span className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white"></span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            onClick={item.onClick}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}