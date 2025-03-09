import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import { X, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';


interface CreateResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
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
        maxWidth: '400px',
        width: '90%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};

export function CreateResumeModal({ isOpen, onClose, onSubmit }: CreateResumeModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            setIsLoading(true)
            await onSubmit(file);

            setFile(null);

            setIsLoading(false)
            onClose();
        }
    };




    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            ariaHideApp={false}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Upload Resume</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume File (PDF)
                    </label>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto mb-4 text-gray-400" size={24} />
                        {file ? (
                            <p className="text-sm text-gray-600">Selected: {file.name}</p>
                        ) : isDragActive ? (
                            <p className="text-sm text-gray-600">Drop the PDF file here</p>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-600">Drag & drop a PDF file here, or click to select</p>
                                <p className="text-xs text-gray-500 mt-2">Only PDF files are accepted</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!file || isLoading}
                        className="flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:opacity-80 focus:ring-offset-2 disabled:opacity-50"
                    >
                        Upload Resume
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
            </form>
        </Modal>
    );
}