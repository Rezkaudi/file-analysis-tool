import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface WorkPositionCardProps {
    position: WorkPosition;
    onEdit: (position: WorkPosition) => void;
    onDelete: (position: WorkPosition) => void;
}

export const WorkPositionCard: React.FC<WorkPositionCardProps> = ({
    position,
    onEdit,
    onDelete,
}) => {
    return (
        <Link href={`/position/${position.id}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{position.title}</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            e.nativeEvent.stopImmediatePropagation();
                            e.preventDefault();
                            onEdit(position)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            e.nativeEvent.stopImmediatePropagation();
                            e.preventDefault();
                            onDelete(position)
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <p className="text-gray-600 mb-4">{position.description}</p>
            <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${position.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {position.status}
                </span>
            </div>
        </Link>
    );
};