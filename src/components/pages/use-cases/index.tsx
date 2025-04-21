"use client"
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { WorkPositionCard } from './components/WorkPositionCard';
import { WorkPositionModal } from './components/WorkPositionModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { DuplicateConfirmationModal } from './components/DuplicateConfirmationModal';

import { Pagination } from './components/Pagination';
import { getPositions, createPosition, updatePosition, deletePosition, duplicatePosition } from "@/services/positions"
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { refreshToken } from '@/services/auth';


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
    const pageSize = 20


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

        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchPositions(currentPage);
    }, [currentPage]);


    const handleCreatePosition = async (data: WorkPositionFormData) => {
        try {
            await createPosition(data);
            fetchPositions(currentPage);
            toast.success("successful");
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data?.statusCode === 401) {
                await refreshToken()
                await handleCreatePosition(data)
            }
            else {
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
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Use Cases</h1>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center min-w-[149px] gap-2 rounded-md bg-gradient-to-r from-secondary to-accent px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"

                    >
                        <Plus size={20} />
                        Add Use Case
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {positions.length > 0 ? <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </> : <h4 className='w-full text-center mt-[100px] text-red-500'>No Position Found . Create New Position</h4>}
                    </>
                )}

                <WorkPositionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={modalMode === 'create' ? handleCreatePosition : handleUpdatePosition}
                    position={selectedPosition}
                    mode={modalMode}
                />

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={async () => {
                        if (positionToDelete) {
                            await handleDeletePosition(positionToDelete.id);
                        }
                    }}
                    positionTitle={positionToDelete?.title || ''}
                />

                <DuplicateConfirmationModal
                    isOpen={isDuplicateModalOpen}
                    onClose={() => setIsDuplicateModalOpen(false)}
                    onConfirm={async () => {
                        if (positionToDuplicate) {
                            await handleDuplicatePosition(positionToDuplicate.id);
                        }
                    }}
                    positionTitle={positionToDuplicate?.title || ''}
                />
            </div>
        </div>
    );
};

export default Index;
