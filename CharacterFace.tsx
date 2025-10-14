'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function CharacterFace({ mood = "happy" }: { mood?: "happy" | "neutral" | "sad" }) {

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

    // ★ SVG全体のアニメーション設定
    const svgVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.svg
            viewBox="0 0 120 120"
            width="100%"
            height="100%"
            // ★ 画面に表示されたときのアニメーション
            variants={svgVariants}
            initial="hidden"
            animate="visible"
        >
            {/* ★ ゆらゆら揺れる動きを追加 */}
            <motion.g
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <circle cx="60" cy="60" r="60" fill="white" />
                <circle cx="20" cy="70" r="12" fill="#F8BBD0" />
                <circle cx="100" cy="70" r="12" fill="#F8BBD0" />
                <circle cx="40" cy="55" r="5" fill="#5D4037" />
                <circle cx="80" cy="55" r="5" fill="#5D4037" />
            </motion.g>

            {/* 口のアニメーションは前回と同じ（これで動くはずです） */}
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
    );
}