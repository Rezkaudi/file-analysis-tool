import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import SmallSpinner from '@/components/common/components/SmallSpinner';

interface WorkPositionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WorkPositionFormData) => void;
    position?: WorkPosition;
    mode: 'create' | 'edit';
}

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        border: 'none',
        borderRadius: '0.5rem',
        maxWidth: '500px',
        width: '90%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};

export const WorkPositionModal: React.FC<WorkPositionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    position,
    mode,
}) => {
    const [formData, setFormData] = useState<WorkPositionFormData>({
        title: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (position && mode === 'edit') {
            setFormData({
                title: position.title,
                description: position.description,
            });
        } else {
            setFormData({
                title: '',
                description: '',
            });
        }
    }, [position, mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSubmit(formData);
        setFormData({
            title: '',
            description: ''
        })
        setIsLoading(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            contentLabel="Work Position Modal"
            ariaHideApp={false}
        >
            <div className="bg-white rounded-lg">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {mode === 'create' ? 'Create New Position' : 'Edit Position'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full border p-2  rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={3}
                            // required
                            />
                        </div>

                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-md bg-gradiantPurple px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-80"
                        >
                            {mode === 'create' ? 'Create' : 'Save Changes'}

                            {isLoading && (
                                <div className="flex items-center justify-center">
                                    <SmallSpinner />
                                </div>
                            )}

                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};