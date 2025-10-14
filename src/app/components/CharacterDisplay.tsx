'use client'; // 👈 この行があるか、もう一度ご確認ください。

import { motion, AnimatePresence } from 'framer-motion';
import CharacterFace from './CharacterFace';

type CharacterDisplayProps = {
    petName: string;
    mood: "happy" | "neutral" | "sad";
    message: string | null;
    onCharacterClick: () => void;
};

export default function CharacterDisplay({ petName, mood, message, onCharacterClick }: CharacterDisplayProps) {
    // (以下、変更なし)
    return (
        <div className="flex-grow flex flex-col items-center justify-center gap-y-4 p-3 text-center pb-20 relative">
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-8 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1 shadow-md z-10"
                    >
                        <p className="text-slate-700 text-[15px] font-medium">{message}</p>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white/80"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-40 h-40 rounded-full bg-white p-2">
                <div className="w-full h-full rounded-full flex items-center justify-center">
                    <CharacterFace mood={mood} onClick={onCharacterClick} />
                </div>
            </div>

            <div>
                <h1 className="text-4xl font-bold backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1">{petName}</h1>
            </div>
        </div>
    );
}