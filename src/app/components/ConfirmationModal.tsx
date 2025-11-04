// src/app/components/ConfirmationModal.tsx

import React from 'react';
// --- 追加: Framer Motion ---
import { motion, AnimatePresence } from 'framer-motion';
// ▼▼▼ 最小限の変更: FaMapMarkerAlt を削除 ▼▼▼
import {
    FaRegSun,
    FaCloudRain,
    FaCloud,
    FaBolt,
    FaSnowflake,
    FaWind,
    FaMoon
} from 'react-icons/fa';
// ★ 修正: IoIosThunderstorm → WiThunderstorm に変更（react-icons/wi から）
import { WiThunderstorm } from "react-icons/wi";
import { IoMdClose } from "react-icons/io";
import Image from 'next/image';

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children?: React.ReactNode;
    item?: {
        name: string;
        description: string;
        rarity: string;
        icon?: string; // アイコンのファイルパスまたは種類
    };
    weatherType?: 'thunderstorm'; // お天気お守り用
    type?: 'walk' | 'item';
};

const iconComponents: { [key: string]: React.ElementType } = {
    FaRegSun: FaRegSun,
    FaCloudRain: FaCloudRain,
    FaCloud: FaCloud,
    FaBolt: FaBolt,
    FaSnowflake: FaSnowflake,
    FaWind: FaWind,
    FaMoon: FaMoon,
    // WiThunderstorm は直接 JSX で使用するためここには含めない
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    children,
    item,
    weatherType,
    type,
}) => {
    const renderIcon = () => {
        if (item?.icon) {
            // アイテムのiconプロパティが画像パスの場合
            if (item.icon.startsWith('/')) {
                return (
                    <Image
                        src={item.icon}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="mx-auto"
                    />
                );
            }
            // アイテムのiconプロパティがアイコンコンポーネント名の場合
            const IconComponent = iconComponents[item.icon];
            if (IconComponent) {
                return (
                    <IconComponent
                        className="text-6xl text-gray-700 mx-auto"
                        style={{ color: '#4A5568' }}
                    />
                );
            }
        } else if (weatherType === 'thunderstorm') {
            return (
                // WiThunderstorm を直接使用
                <WiThunderstorm
                    className="text-6xl text-gray-700 mx-auto"
                    style={{ color: '#4A5568' }}
                />
            );
        }
        return null;
    };

    const isWalkMode = type === 'walk' && !item;
    const title = item?.name || '確認';
    const confirmText = isWalkMode ? 'OK！' : item ? 'OK !' : '確認';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    // 背景アニメーション
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        // ★ サイズ縮小とスプリングアニメーション
                        initial={{ scale: 0.8, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: 20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }} // はじめてのおさんぽ/アイテムゲットモーダルと同様の動き
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs relative" // ★ max-w-xsでサイズを小さく
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 閉じるボタン */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            aria-label="Close"
                        >
                            <IoMdClose size={24} />
                        </button>

                        <div className="text-center space-y-4">
                            {renderIcon()}

                            {!isWalkMode && (
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {title}
                                </h2>
                            )}

                            {item ? (
                                <>
                                    <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                                        {item.description}
                                    </p>
                                    <p className="text-orange-500 font-semibold text-sm">
                                        (レア度: {item.rarity})
                                    </p>
                                </>
                            ) : (
                                children
                            )}

                            <button
                                onClick={isWalkMode ? onConfirm : onClose}
                                className="w-full bg-[#333C4E] text-white py-3 rounded-full text-lg font-bold hover:bg-[#4A5568] transition-colors duration-200 mt-4 active:scale-95"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
