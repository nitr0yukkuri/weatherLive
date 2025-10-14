'use client'; // 👈 この一行を追加して保存してください。

import { motion, AnimatePresence } from 'framer-motion';

export default function CharacterFace({ mood = "happy", onClick }: { mood?: "happy" | "neutral" | "sad", onClick?: () => void }) {

    const getMouthPath = () => {
        switch (mood) {
            case "happy":
                return "M 45 75 Q 60 90 75 75";
            case "neutral":
                return "M 45 80 L 75 80";
            case "sad":
                return "M 45 85 Q 60 75 75 85";
            default:
                return "M 45 75 Q 60 90 75 75";
        }
    };

    return (
        <motion.div
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={onClick}
        >
            <motion.svg
                viewBox="0 0 120 120"
                width="100%"
                height="100%"
                animate={{
                    y: ["-3%", "3%"],
                    rotate: [-2, 2, -2]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
            >
                <circle cx="60" cy="60" r="60" fill="white" />
                <circle cx="20" cy="70" r="12" fill="#F8BBD0" />
                <circle cx="100" cy="70" r="12" fill="#F8BBD0" />
                <motion.g
                    animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                >
                    <circle cx="40" cy="55" r="5" fill="#5D4037" />
                    <circle cx="80" cy="55" r="5" fill="#5D4037" />
                </motion.g>
                <AnimatePresence mode="wait">
                    <motion.path
                        key={mood}
                        d={getMouthPath()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        stroke="#5D4037"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                    />
                </AnimatePresence>
            </motion.svg>
        </motion.div>
    );
}