import React, { useState } from 'react';
import { Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { getResumeFile } from '@/services/resume';

interface ResumeCardProps {
    resume: Resume;
    onDelete: (id: string) => void;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetFile = async () => {
        setIsLoading(true)
        await getResumeFile(resume.id)
        setIsLoading(false)
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 relative">
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                >
                    <Trash2 size={20} />
                </button>
                <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={handleGetFile}>
                    <FileText size={24} className="text-blue-600" />
                    <h3 className="text-lg font-semibold line-clamp-1 break-words">{resume.title}</h3>
                    {isLoading && (
                        <div className="flex items-center justify-center">
                            <svg className="h-4 w-4 animate-spin text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>
                {resume.score !== null && (
                    <p className="text-gray-700 mb-2">Score: {resume.score}</p>
                )}

                <p className="text-sm text-gray-500">
                    Created: {format(new Date(resume.createdAt), 'MMM d, yyyy')}
                </p>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => onDelete(resume.id)}
                itemType="resume"
            />
        </>
    );
}