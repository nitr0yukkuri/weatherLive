// src/app/components/ConfirmationModal.tsx

import React from 'react';
import { FaRegSun, FaCloudRain, FaCloud, FaBolt, FaSnowflake, FaWind, FaMoon } from 'react-icons/fa';
import { IoIosThunderstorm } from "react-icons/io"; // 雷雲アイコンを追加
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
        icon?: string; // アイコンのファイルパスまたは種類 (例: 'thunderstorm_amulet')
    };
    weatherType?: 'thunderstorm'; // お天気お守り用
};

const iconComponents: { [key: string]: React.ElementType } = {
    FaRegSun: FaRegSun,
    FaCloudRain: FaCloudRain,
    FaCloud: FaCloud,
    FaBolt: FaBolt,
    FaSnowflake: FaSnowflake,
    FaWind: FaWind,
    FaMoon: FaMoon,
    IoIosThunderstorm: IoIosThunderstorm,
    // 必要に応じて他のアイコンもここに追加
};


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, children, item, weatherType }) => {
    if (!isOpen) return null;

    const renderIcon = () => {
        if (item?.icon) {
            // アイテムのiconプロパティが画像パスの場合
            if (item.icon.startsWith('/')) {
                return <Image src={item.icon} alt={item.name} width={64} height={64} className="mx-auto" />;
            }
            // アイテムのiconプロパティがアイコンコンポーネント名の場合
            const IconComponent = iconComponents[item.icon];
            if (IconComponent) {
                // ★★★ 修正箇所: アイコンに直接色を適用 ★★★
                return <IconComponent className="text-6xl text-gray-700 mx-auto" style={{ color: '#4A5568' }} />;
            }
        } else if (weatherType === 'thunderstorm') {
            // お天気お守り（雷雨）の場合
            // ★★★ 修正箇所: アイコンに直接色を適用 ★★★
            return <IoIosThunderstorm className="text-6xl text-gray-700 mx-auto" style={{ color: '#4A5568' }} />;
        }
        // デフォルトのアイコンまたは何も表示しない
        // 現在の画像を見る限り、人型のアイコン（デフォルト）が表示されているので、それを再現
        return (
            <div className="flex justify-center items-center w-20 h-20 rounded-full bg-gray-200 mx-auto">
                <svg
                    className="w-12 h-12 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                </svg>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                <div className="text-center space-y-4">
                    {renderIcon()} {/* アイコン表示 */}
                    <h2 className="text-2xl font-bold text-gray-800">
                        {item?.name || "確認"}
                    </h2>
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
                        onClick={item ? onClose : onConfirm} // アイテム表示なら閉じる、確認モーダルなら確認
                        className="w-full bg-[#333C4E] text-white py-3 rounded-lg text-lg font-bold hover:bg-[#4A5568] transition-colors duration-200 mt-4"
                    >
                        {item ? "OK !" : "確認"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;