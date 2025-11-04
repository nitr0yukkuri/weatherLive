// src/app/components/ItemGetModal.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
// ★ 1. ItemIconコンポーネントをインポートします
import ItemIcon from './ItemIcon';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    itemName: string | null;
    // ★ 2. iconNameを受け取れるようにPropsを追加します
    iconName: string | null;
    // ★ 4. rarity を追加
    rarity: string | null;
};

export default function ItemGetModal({ isOpen, onClose, itemName, iconName, rarity }: Props) {
    if (!itemName) return null;

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
                        className="bg-white rounded-2xl p-8 w-full max-w-xs text-center shadow-xl flex flex-col items-center gap-y-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ★ 3. 固定のアイコンだった部分を、ItemIconコンポーネントに置き換えます */}
                        <div className="text-purple-500">
                            <ItemIcon name={iconName} rarity={rarity ?? undefined} size={60} />
                        </div>

                        {/* メッセージ */}
                        <p className="text-2xl font-bold leading-relaxed text-gray-800">
                            {itemName}
                            <br />
                            をゲットした！
                        </p>

                        {/* OKボタン */}
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-full text-lg hover:bg-gray-700 transition-colors active:scale-95"
                        >
                            OK
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}