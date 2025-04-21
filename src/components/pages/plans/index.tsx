"use client"
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { getProducts } from '@/services/profile';
import { Minus, Plus, X } from 'lucide-react';
import { getAccessToken } from '@/utils/authStatus';

import { apiUrl } from '@/utils/apiUrl';

const Index = () => {
    const [Plans, setPlans] = useState<PricingTier[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [loading, setLoading] = useState<string | null>(null);
    const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
    const [quantity, setQuantity] = useState(1);

    const calculateTotal = (price: string, qty: number) => {
        return (parseFloat(price) * qty).toFixed(2);
    };

    const handlePurchase = async () => {
        if (!selectedTier) return;
        const token = await getAccessToken();

        try {
            setLoading(selectedTier.id);

            const response = await fetch(`${apiUrl}/v1/user/payment/one-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: selectedTier.id,
                    quantity,
                }),
            });

            if (!response.ok) {
                throw new Error('Purchase failed');
            }

            const data = await response.json();
            window.open(data.url, '_blanck')
            console.log('Purchase successful:', data);
            setSelectedTier(null);
            setQuantity(1);

        } catch (error) {
            console.error('Purchase error:', error);
        } finally {
            setLoading(null);
        }
    };


    const fetchProducts = async () => {
        try {
            setIsLoading(true);

            const response = await getProducts();

            setPlans(response.reverse());

        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Choose Your Plan
                    </h1>
                    <p className="mt-5 text-xl text-gray-500">
                        Select the perfect package for your recruitment needs
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-12">
                        {Plans?.map((tier) => (
                            <div
                                key={tier.id}
                                className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {tier.name}
                                    </h3>

                                    <div className="mt-4 flex items-baseline text-gray-900">
                                        <span className="text-4xl font-extrabold tracking-tight">
                                            ${tier.price}
                                        </span>
                                        <span className="ml-1 text-xl font-semibold">/package</span>
                                    </div>

                                    <p className="mt-6 text-gray-500">
                                        {tier.description}
                                    </p>

                                    <div className="mt-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                    {tier.points}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-medium text-gray-900">
                                                    CV Credits
                                                </h4>
                                                <p className="mt-1 text-gray-500">
                                                    Process up to {tier.points} CVs
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="mt-8 block w-full text-xl rounded-md bg-gradient-to-r from-secondary to-accent px-6 py-4 text-center font-medium text-white shadow focus:ring-offset-2"
                                    onClick={() => setSelectedTier(tier)}
                                >
                                    Buy
                                </button>
                            </div>
                        ))}
                    </div>
                )}


            </main>


            {/* Quantity Selection Modal */}
            {selectedTier && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {selectedTier.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setSelectedTier(null);
                                    setQuantity(1);
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Price per package:</span>
                                <span className="font-semibold">${selectedTier.price}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Credits per package:</span>
                                <span className="font-semibold">{selectedTier.points} CVs</span>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Quantity
                                </label>
                                <div className="flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val) && val >= 1 && val <= 100) {
                                                setQuantity(val);
                                            }
                                        }}
                                        className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="1"
                                        max="100"
                                    />
                                    <button
                                        onClick={() => setQuantity(q => Math.min(100, q + 1))}
                                        className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-medium">Total Credits:</span>
                                    <span className="text-lg font-bold">
                                        {selectedTier.points * quantity} CVs
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium">Total Price:</span>
                                    <span className="text-lg font-bold">
                                        ${calculateTotal(selectedTier.price, quantity)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePurchase}
                                disabled={loading === selectedTier.id}
                                className={`w-full rounded-md px-6 py-4 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-base font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading === selectedTier.id
                                    ? 'cursor-not-allowed'
                                    : ''
                                    }`}
                            >
                                {loading === selectedTier.id
                                    ? 'Processing...'
                                    : `Purchase for $${calculateTotal(selectedTier.price, quantity)}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;
