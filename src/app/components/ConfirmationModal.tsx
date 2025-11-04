// src/app/components/ConfirmationModal.tsx

import React from 'react';
// ▼▼▼ 最小限の変更: FaMapMarkerAlt を削除 ▼▼▼
import { FaRegSun, FaCloudRain, FaCloud, FaBolt, FaSnowflake, FaWind, FaMoon } from 'react-icons/fa';
import { IoIosThunderstorm } from "react-icons/io";
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
    type?: 'walk' | 'item'; // ▼▼▼ 変更なし ▼▼▼
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
    // ▼▼▼ 最小限の変更: FaMapMarkerAlt を削除 ▼▼▼
};


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, children, item, weatherType, type }) => {
    if (!isOpen) return null;

    const renderIcon = () => {
        // ▼▼▼ 最小限の変更: type === 'walk' の場合のアイコン処理を削除 ▼▼▼
        // if (type === 'walk') {
        //     return <FaMapMarkerAlt className="text-6xl text-green-500 mx-auto" />;
        // }
        // ▲▲▲ 変更ここまで ▲▲▲

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

        // ▼▼▼ 最小限の変更: 'walk' モードでもアイコンが不要になったため、デフォルトのアイコン表示ロジックも削除し、nullを返す ▼▼▼
        return null;
        // ▲▲▲ 変更ここまで ▲▲▲
    };

    const isWalkMode = type === 'walk' && !item;
    // ▼▼▼ 最小限の変更: isWalkMode の場合の title 設定を削除 (children で渡すため) ▼▼▼
    const title = item?.name || "確認"; // item がある場合のみ title を設定
    const confirmText = isWalkMode ? "OK！" : (item ? "OK !" : "確認");
    // ▲▲▲ 変更ここまで ▲▲▲

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">

                {/* ▼▼▼ 最小限の変更: 常に 'X' ボタンを表示 (画像に合わせる) ▼▼▼ */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                {/* ▲▲▲ 変更ここまで ▲▲▲ */}

                <div className="text-center space-y-4">
                    {renderIcon()} {/* アイコン表示 (walk の場合は null になる) */}

                    {/* ▼▼▼ 最小限の変更: isWalkMode でない場合 (item がある場合) のみ h2 を表示 ▼▼▼ */}
                    {!isWalkMode && (
                        <h2 className="text-2xl font-bold text-gray-800">
                            {title}
                        </h2>
                    )}
                    {/* ▲▲▲ 変更ここまで ▲▲▲ */}

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
                        children // 'walk' の場合はここに h2 が入る
                    )}

                    {/* ▼▼▼ 最小限の変更: 常に1ボタンのロジックに戻す ▼▼▼ */}
                    <button
                        onClick={isWalkMode ? onConfirm : onClose} // おさんぽ(walk)なら onConfirm, アイテム(item)なら onClose
                        className="w-full bg-[#333C4E] text-white py-3 rounded-full text-lg font-bold hover:bg-[#4A5568] transition-colors duration-200 mt-4 active:scale-95"
                    >
                        {confirmText} {/* "OK！" または "OK !" */}
                    </button>
                    {/* ▲▲▲ 変更ここまで ▲▲▲ */}
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;