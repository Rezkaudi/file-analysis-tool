"use client"
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { WorkPositionCard } from './components/WorkPositionCard';
import { WorkPositionModal } from './components/WorkPositionModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { DuplicateConfirmationModal } from './components/DuplicateConfirmationModal';
import { Pagination } from './components/Pagination';
import { getPositions, createPosition, updatePosition, deletePosition, duplicatePosition } from "@/services/positions";
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { refreshToken } from '@/services/auth';
import DataLoadSpinner from '@/components/common/components/DataLoadSpinner';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
    const [positions, setPositions] = useState<WorkPosition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<WorkPosition | undefined>();
    const [positionToDelete, setPositionToDelete] = useState<WorkPosition | undefined>();
    const [positionToDuplicate, setPositionToDuplicate] = useState<WorkPosition | undefined>();
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const pageSize = 20;
    const { t } = useTranslation();

    const fetchPositions = async (page: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getPositions(page, pageSize);
            setPositions(response.items);
            setTotalPages(Math.ceil(response.count / pageSize));
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
            setError(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions(currentPage);
    }, [currentPage]);

    const handleCreatePosition = async (data: WorkPositionFormData, router: AppRouterInstance) => {
        try {
            const response = await createPosition(data);
            const useCaseId = response.id;
            toast.success(t("general.successful"));
            router.push(`/position/${useCaseId}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data?.statusCode === 401) {
                await refreshToken();
                await handleCreatePosition(data, router);
            } else {
                toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
            }
        }
    };

    const handleUpdatePosition = async (data: WorkPositionFormData) => {
        if (!selectedPosition) return;
        try {
            await updatePosition(selectedPosition.id, data);
            fetchPositions(currentPage);
            toast.success("successful");
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        }
    };

    const handleDeletePosition = async (id: string) => {
        try {
            await deletePosition(id);
            fetchPositions(currentPage);
            toast.success("successful");
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        }
    };

    const handleDuplicatePosition = async (id: string) => {
        try {
            await duplicatePosition(id);
            fetchPositions(currentPage);
            toast.success("successful");
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedPosition(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (position: WorkPosition) => {
        setModalMode('edit');
        setSelectedPosition(position);
        setIsModalOpen(true);
    };

    const openDeleteModal = (position: WorkPosition) => {
        setPositionToDelete(position);
        setIsDeleteModalOpen(true);
    };

    const openDuplicateModal = (position: WorkPosition) => {
        setPositionToDuplicate(position);
        setIsDuplicateModalOpen(true);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                <div className="bg-red-50 text-red-800 p-4 rounded-lg shadow-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <DataLoadSpinner />
                ) : (
                    <>
                        <div className="flex justify-between items-center gap-4 mb-8">
                            <h1 className="text-3xl font-bold text-mainPurple">
                                {positions.length} {t("useCase.title")}
                            </h1>
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-secondary to-accent shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                            >
                                <Plus size={20} />
                                {t("useCase.addUseCaseBtn")}
                            </button>
                        </div>

                        {positions.length > 0 ? (
                            <>
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {positions.map((position) => (
                                        <WorkPositionCard
                                            fetchPositions={() => fetchPositions(currentPage)}
                                            key={position.id}
                                            position={position}
                                            onEdit={openEditModal}
                                            onDelete={openDeleteModal}
                                            onDuplicate={openDuplicateModal}
                                        />
                                    ))}
                                </motion.div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        ) : (
                            <h4 className='w-full text-center mt-[100px] text-red-500'>
                                {t("useCase.positionsException")}
                            </h4>
                        )}
                    </>
                )}

                <AnimatePresence>
                    {isModalOpen && (
                        <WorkPositionModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={modalMode === 'create' ? handleCreatePosition : handleUpdatePosition}
                            position={selectedPosition}
                            mode={modalMode}
                        />
                    )}

                    {isDeleteModalOpen && (
                        <DeleteConfirmationModal
                            isOpen={isDeleteModalOpen}
                            onClose={() => setIsDeleteModalOpen(false)}
                            onConfirm={async () => {
                                if (positionToDelete) await handleDeletePosition(positionToDelete.id);
                            }}
                            positionTitle={positionToDelete?.title || ''}
                        />
                    )}

                    {isDuplicateModalOpen && (
                        <DuplicateConfirmationModal
                            isOpen={isDuplicateModalOpen}
                            onClose={() => setIsDuplicateModalOpen(false)}
                            onConfirm={async () => {
                                if (positionToDuplicate) await handleDuplicatePosition(positionToDuplicate.id);
                            }}
                            positionTitle={positionToDuplicate?.title || ''}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Index;
