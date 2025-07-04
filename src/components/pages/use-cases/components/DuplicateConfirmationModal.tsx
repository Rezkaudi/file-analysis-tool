import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SmallSpinner from '@/components/common/components/SmallSpinner';
import { AnimatedModalContainer } from './AnimatedModalContainer';

interface DuplicateConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    positionTitle: string;
}

export const DuplicateConfirmationModal: React.FC<DuplicateConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    positionTitle,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleDuplicate = async () => {
        setIsLoading(true);
        await onConfirm();
        setIsLoading(false);
        onClose();
    };

    return (
        <AnimatedModalContainer isOpen={isOpen} onClose={onClose}>
            <div className="px-6 py-4">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {t('useCase.duplicateConfirmationModal.title')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">
                    {t('useCase.duplicateConfirmationModal.description')}{' '}
                    <span className="font-semibold">{positionTitle}</span>?
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        {t('useCase.duplicateConfirmationModal.cancel')}
                    </button>
                    <button
                        onClick={handleDuplicate}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-md bg-gradient-to-r from-secondary to-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {t('useCase.duplicateConfirmationModal.duplicate')}
                        {isLoading && <SmallSpinner />}
                    </button>
                </div>
            </div>
        </AnimatedModalContainer>
    );
};
