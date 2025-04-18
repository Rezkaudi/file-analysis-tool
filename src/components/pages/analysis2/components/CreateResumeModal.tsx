import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import { X, Upload, Trash, XIcon, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AxiosError } from 'axios';
import { toast } from 'sonner';


interface CreateResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
    fetchPositionsById: () => void;
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
        maxWidth: '1000px',
        maxHeight: "800px",
        width: '90%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};

export function CreateResumeModal({ isOpen, onClose, onSubmit, fetchPositionsById }: CreateResumeModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});

    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });

    const handleDelete = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    }

    const handleClose = () => {
        setFiles([])
        setUploadStatus({})
        onClose()
    }

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (file) {
    //         try {
    //             setIsLoading(true)

    //             await onSubmit(file)
    //             setFile(null);
    //             onClose();
    //         } catch (error) {
    //             const axiosError = error as AxiosError<ApiError>;
    //             toast.error(axiosError.response?.data?.message);
    //         } finally {
    //             setIsLoading(false)
    //         }
    //     }
    // };

    const handleUpload = async () => {
        setIsLoading(true)
        for (const file of files) {
            setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
            try {
                await onSubmit(file);
                setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
            } catch (error) {
                setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
                const axiosError = error as AxiosError<ApiError>;
                toast.error(`${axiosError.response?.data?.message} for ${file.name} ` || `Upload failed for cv ${file.name}`);
            }
        }
        await fetchPositionsById()

        setIsLoading(false)
        handleClose()
    };



    return (
        <Modal isOpen={isOpen} style={modalStyles} ariaHideApp={false}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Upload Resumes</h2>
                <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400">
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-4 text-gray-400" size={24} />
                <p className="text-sm text-gray-600">{isDragActive ? 'Drop the files here' : 'Drag & drop PDF files or click to select'}</p>
            </div>
            <div className="mt-4 space-y-2 px-5 max-h-96 overflow-auto">
                {files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                        <div className='flex items-center gap-2'>
                            <span>{index + 1} - </span>
                            <div className='flex-1'>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {uploadStatus[file.name] === 'uploading' && (
                                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {uploadStatus[file.name] === 'error' && <XIcon size={16} color='red' />}
                            {uploadStatus[file.name] === 'success' && <Check size={16} color='green' />}
                            <button disabled={isLoading} onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                                <Trash size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-6 gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isLoading}
                    className="flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
                >
                    Upload Resumes
                    {isLoading && (
                        <div className="flex items-center justify-center">
                            <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </button>
            </div>
        </Modal>
    );
}