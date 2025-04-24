import React, { useState } from 'react';
import Modal from 'react-modal';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import SmallSpinner from '@/components/common/components/SmallSpinner';


interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemType: string;
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

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemType
}: DeleteConfirmationModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await onConfirm();
            onClose();
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message);
        }
        finally {
            setIsLoading(false);
        }

    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            ariaHideApp={false}
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Confirm Deletion</h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this {itemType}? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 rounded-md bg-gradiantPurple px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-80"
                    >
                        Delete

                        {isLoading && (
                            <div className="flex items-center justify-center">
                                <SmallSpinner />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}