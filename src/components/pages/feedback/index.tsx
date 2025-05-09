"use client";
import React, { useState, useRef, useEffect } from 'react';
import { submitFeedback, uploadPhoto } from '@/services/feedback';
import SmallSpinner from '@/components/common/components/SmallSpinner';
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useTranslation} from "react-i18next";

export default function FeedbackPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {t} =useTranslation();

    // Effect to clear messages after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (uploadError) setUploadError(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [error, success, uploadError, uploadSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title || !description) {
            toast.error( t("feedback.missingFieldError"));
            return;
        }

        try {
            setIsLoading(true);
            await submitFeedback(title, description, imageUrl || '');

            // Reset form
            setTitle('');
            setDescription('');
            setImageUrl(null);
            setUploadSuccess(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast.success(t("feedback.feedbackSuccess"));
            // Show success message
            setSuccess('');
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;

            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        setUploadError(null);
        setUploadSuccess(null);

        try {
            setIsUploading(true);
            const response = await uploadPhoto(file);
            setImageUrl(response.data.url);
            setUploadSuccess(t("feedback.uploadSuccess"));
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;

            toast.error(axiosError.response?.data?.message || "Failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font- text-gray-800 mb-6">{t("feedback.title")}</h1>



                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            {t("feedback.titleField")}
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 h-10 block w-full rounded-md p-2 border border-gray-200 shadow-sm focus:border-gray-300"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            {t("feedback.description")}
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 p-2 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-gray-300"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="flex text-sm font-medium text-gray-700">
                            {t("feedback.haveAScreenshot")}{"   "}   <h5 className=" ml-2 text-md  text-gray-800">{t("feedback.attachAnImage")}

                        </h5>
                        </label>

                        <div className="mt-1 flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                accept="image/*"
                                disabled={isLoading || isUploading
                               }
                            />
                            {isUploading && <SmallSpinner/>}
                        </div>

                        {uploadSuccess && (
                            <p className="mt-2 w-60 h-13 py-2 flex justify-center rounded-md text-center  text-sm text-green-800 bg-green-200 transition-opacity duration-300">
                                {uploadSuccess}
                            </p>
                        )}
                        {uploadError && (
                            <p className="mt-2  w-60 h-13 py-2 flex justify-center rounded-md text-sm text-red-600 bg-red-300 transition-opacity duration-300">
                                {uploadError}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary to-accent disabled:opacity-75"
                        disabled={isLoading || isUploading}
                    >
                        {isLoading ? (
                            <div className="text-sm text-center text-white text-wrap">
                                <SmallSpinner/> {t("feedback.submitting")}
                            </div>
                        ) : (
                            t("feedback.submitBtn")
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}