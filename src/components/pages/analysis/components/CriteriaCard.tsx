import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface CriteriaCardProps {
    criteria: Criteria;
    onDelete: (id: string) => void;
}

export function CriteriaCard({ criteria, onDelete }: CriteriaCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 relative">
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                >
                    <Trash2 size={20} />
                </button>
                <p className="text-gray-800 mb-4">{criteria.description}</p>
                <p className="text-sm text-gray-500">
                    Created: {format(new Date(criteria.createdAt), 'MMM d, yyyy')}
                </p>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => onDelete(criteria.id)}
                itemType="criteria"
            />
        </>
    );
}