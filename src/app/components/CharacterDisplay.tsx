// src/app/components/CharacterDisplay.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import CharacterFace from './CharacterFace';

type CharacterDisplayProps = {
    petName: string;
    petColor: string; // ★ 変更点1: petColor を追加
    mood: "happy" | "neutral" | "sad";
    message: string | null;
    onCharacterClick: () => void;
};

// ★ 変更点2: props で petColor を受け取る
export default function CharacterDisplay({ petName, petColor, mood, message, onCharacterClick }: CharacterDisplayProps) {
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

            {/* ★ 変更点3: 背景色を petColor にする (p-2 は削除) */}
            <div className="w-40 h-40 rounded-full" style={{ backgroundColor: petColor }}>
                <div className="w-full h-full rounded-full flex items-center justify-center">
                    {/* ★ 変更点4: CharacterFace に petColor を渡す */}
                    <CharacterFace mood={mood} onClick={onCharacterClick} petColor={petColor} />
                </div>
            </div>

            <div>
                <h1 className="text-4xl font-bold backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1">{petName}</h1>
            </div>
        </div>
    );
}