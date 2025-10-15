'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
};

export default function ConfirmationModal({ isOpen, onClose, onConfirm, children }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-xs relative shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 h-8 w-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                        >
                            <IoClose size={20} />
                        </button>

                        <div className="my-4">
                            {children}
                        </div>

                        <button
                            onClick={onConfirm}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-full text-lg hover:bg-gray-700 transition-colors active:scale-95"
                        >
                            OK！
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}