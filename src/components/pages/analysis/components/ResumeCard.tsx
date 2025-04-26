import React, { useState } from 'react';
import { Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { getResumeFile } from '@/services/resume';
import SmallSpinner from '@/components/common/components/SmallSpinner';

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
                            <SmallSpinner />
                        </div>
                    )}
                </div>
                {/* {resume.score !== null && (
                    <p className="text-gray-700 mb-2">Score: {resume.score}</p>
                )} */}

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