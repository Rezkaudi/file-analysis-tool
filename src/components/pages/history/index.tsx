"use client"
import React, { useState, useEffect } from 'react';
import { Pagination } from './components/Pagination';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { getHistory } from '@/services/profile';
import { HistoryCard } from './components/HistoryCard';
import DataLoadSpinner from '@/components/common/components/DataLoadSpinner';
import {useTranslation} from "react-i18next";


const Index = () => {
    const [history, setHistory] = useState<BalanceHistory[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
const {t} = useTranslation();
    const pageSize = 20


    const fetchHistory = async (page: number) => {
        try {
            setIsLoading(true);

            const response = await getHistory(page, pageSize);

            setHistory(response.items);
            setTotalPages(Math.ceil(response.count / pageSize));

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(currentPage);
    }, [currentPage]);


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl lg:text-3xl font-bold text-gray-900">{t("historyPage.title")}</h1>
                </div>

                {isLoading ? <DataLoadSpinner /> :
                    (
                        <>
                            {history && history.length > 0 ? <>
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                                    {history?.map((item) => (
                                        <HistoryCard
                                            key={item.id}
                                            data={item}
                                        />
                                    ))}
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </> : <h4 className='w-full text-center mt-[100px] text-red-500'>{t("historyPage.noHistoryFound")}</h4>}
                        </>
                    )}
            </div>
        </div>
    );
};

export default Index;
