import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import SmallSpinner from '@/components/common/components/SmallSpinner';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AnimatedModalContainer } from './AnimatedModalContainer';

interface WorkPositionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WorkPositionFormData, router: ReturnType<typeof useRouter>) => void;
    position?: WorkPosition;
    mode: 'create' | 'edit';
}

export const WorkPositionModal: React.FC<WorkPositionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    position,
    mode,
}) => {
    const [formData, setFormData] = useState<WorkPositionFormData>({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const router = useRouter();
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (position && mode === 'edit') {
            setFormData({ title: position.title, description: position.description });
        } else {
            setFormData({ title: '', description: '' });
        }

        // Autofocus on title input after modal opens
        setTimeout(() => titleInputRef.current?.focus(), 100);
    }, [position, mode, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSubmit(formData, router);
        setFormData({ title: '', description: '' });
        setIsLoading(false);
        onClose();
    };

    return (
        <AnimatedModalContainer isOpen={isOpen} onClose={onClose}>
            <div className="px-6 py-5 sm:px-8 sm:py-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {mode === 'create'
                            ? t('useCase.createNewPosition')
                            : t('useCase.editPosition')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('useCase.workPositionModal.title')}
                        </label>
                        <input
                            type="text"
                            id="title"
                            ref={titleInputRef}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder={t('useCase.workPositionModal.title') || 'Enter job title'}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('useCase.workPositionModal.description')}
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder={t('useCase.workPositionModal.description') || 'Write a short description...'}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            {t('useCase.workPositionModal.cancel') || 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-secondary to-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent transition disabled:opacity-50"
                        >
                            {mode === 'create'
                                ? t('useCase.workPositionModal.create')
                                : t('useCase.workPositionModal.saveChanges')}

                            {isLoading && <SmallSpinner />}
                        </button>
                    </div>
                </form>
            </div>
        </AnimatedModalContainer>
    );
};
