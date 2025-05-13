import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import SmallSpinner from '@/components/common/components/SmallSpinner';
import {useTranslation} from "react-i18next";

interface DuplicateConfirmationModal {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    positionTitle: string;
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
        maxWidth: '400px',
        width: '90%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};

export const DuplicateConfirmationModal: React.FC<DuplicateConfirmationModal> = ({
    isOpen,
    onClose,
    onConfirm,
    positionTitle,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleDublicate = async () => {
        setIsLoading(true)

        await onConfirm();

        setIsLoading(false)
        onClose();
    }


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            contentLabel="Delete Confirmation Modal"
            ariaHideApp={false}
        >
            <div className="bg-white rounded-lg">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{t("useCase.duplicateConfirmationModal.title")}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4">
                    <p className="text-gray-600">
                        {t("useCase.duplicateConfirmationModal.description")} <span className="font-semibold">{positionTitle}</span>?
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            {t("useCase.duplicateConfirmationModal.cancel")}
                        </button>
                        <button
                            onClick={handleDublicate}
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-secondary to-accent px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {t("useCase.duplicateConfirmationModal.duplicate")}

                            {isLoading && (
                                <div className="flex items-center justify-center">
                                    <SmallSpinner />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};