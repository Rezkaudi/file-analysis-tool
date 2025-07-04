// components/AnimatedModalContainer.tsx
import React from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const AnimatedModalContainer: React.FC<Props> = ({ isOpen, onClose, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Confirmation Modal"
            overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            className="relative w-full max-w-md p-0 outline-none"
            ariaHideApp={false}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};
