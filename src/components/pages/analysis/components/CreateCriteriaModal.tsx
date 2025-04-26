import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import SmallSpinner from '@/components/common/components/SmallSpinner';


interface CreateCriteriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (description: string) => void;
}
const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        border: 'none',
        borderRadius: '0.5rem',
        maxWidth: '500px',
        width: '90%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};
export function CreateCriteriaModal({ isOpen, onClose, onSubmit }: CreateCriteriaModalProps) {
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await onSubmit(description);
            setDescription('');
            onClose();
            toast.success("Succsessfull")
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            ariaHideApp={false}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Add New Criteria</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD:src/components/pages/analysis2/components/CreateCriteriaModal.tsx
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
=======
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainPurple"
                        rows={4}
>>>>>>> 3973ec5d246bc68be22030d43b6b535c50254273:src/components/pages/analysis/components/CreateCriteriaModal.tsx
                        required
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-md bg-gradient-to-r from-secondary to-accent px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
                    >
                        Add Criteria

                        {isLoading && (
                            <div className="flex items-center justify-center">
                                <SmallSpinner />
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}