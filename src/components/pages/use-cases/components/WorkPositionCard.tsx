import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Copy, FolderOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';

interface WorkPositionCardProps {
    position: WorkPosition;
    onEdit: (position: WorkPosition) => void;
    onDelete: (position: WorkPosition) => void;
    onDuplicate: (position: WorkPosition) => void;
    fetchPositions: () => void;
}

export const WorkPositionCard: React.FC<WorkPositionCardProps> = ({
    position,
    onEdit,
    onDelete,
    onDuplicate
}) => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const statusColors: any = {
        completed: 'bg-green-300 text-green-800',
        active: 'bg-yellow-300 text-yellow-800',
        draft: 'bg-blue-300 text-blue-800',
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onOpen = (id: string) => {
        router.push(`/position/${id}`);
    };




    return (
        <div className="relative flex flex-col items-stretch text-card-foreground rounded-xl bg-white border border-gray-200 shadow-sm overflow-visible">
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center justify-center font-medium rounded-md px-3 py-1 text-xs ${statusColors[position.status] || 'bg-gray-300 text-gray-800'}`}>
                        {position.status}
                    </span>

                    {/* Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsDropdownOpen((prev) => !prev);
                            }}
                            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none rounded-md text-gray-600 hover:bg-gray-100 w-8 h-8"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            onOpen(position.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FolderOpenIcon size={16} className="mr-2" />
                                        {t("useCase.openUseCase")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onEdit(position);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Pencil size={16} className="mr-2" />
                                        {t("useCase.editUseCase")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDuplicate(position);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Copy size={16} className="mr-2" />
                                        {t("useCase.duplicateUseCase")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(position);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        {t("useCase.deleteUseCase")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mb-5">
                    <Link href={`/position/${position.id}`}>
                        <span className="text-lg font-medium text-gray-900 hover:text-blue-600">
                            {position.title}
                        </span>
                    </Link>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {position.description}
                    </div>
                </div>

                <div className="flex items-center justify-center flex-wrap gap-3">
                    <div className="flex flex-col gap-1 border border-dashed border-gray-300 rounded-md px-3 py-2">
                        <span className="text-gray-900 text-sm font-medium">0</span>
                        <span className="text-gray-600 text-xs">Criterias</span>
                    </div>
                    <div className="flex flex-col gap-1 border border-dashed border-gray-300 rounded-md px-3 py-2">
                        <span className="text-gray-900 text-sm font-medium">0</span>
                        <span className="text-gray-600 text-xs">Resumes</span>
                    </div>
                    <div className="flex flex-col gap-1 border border-dashed border-gray-300 rounded-md px-3 py-2">
                        <span className="text-gray-900 text-sm font-medium">
                            {new Date(position.createdAt).toISOString().split('T')[0]}
                        </span>
                        <span className="text-gray-600 text-xs">Created</span>
                    </div>
                </div>

                <div className={`absolute left-0 right-0 bottom-0 h-1 w-full rounded-b-2xl transition-all ${statusColors[position.status] || 'bg-gray-300 text-gray-800'}`} />
            </div>
        </div>
    );
};
