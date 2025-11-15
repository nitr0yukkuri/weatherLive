// src/app/settings/page.tsx

'use client';

import Link from 'next/link';
import Footer from '../components/Footer';
import { IoSettingsSharp, IoCheckmark, IoBan } from 'react-icons/io5';
import React, { useState, useEffect } from 'react';
import { FaHatCowboy } from 'react-icons/fa'; // ★ アイコンをインポート

// --- ▼▼▼ 変更点1: キー定義、型定義を追加 ▼▼▼ ---
type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
const CURRENT_WEATHER_KEY = 'currentWeather';
const PET_NAME_STORAGE_KEY = 'otenki-gurashi-petName';
const PET_COLOR_STORAGE_KEY = 'otenki-gurashi-petColor';
const PET_EQUIPMENT_KEY = 'otenki-gurashi-petEquipment'; // ★ 着せ替え用キー
const PET_SETTINGS_CHANGED_EVENT = 'petSettingsChanged';

// ★ 色の選択肢
const colorOptions = [
    { name: 'しろ', value: 'white' },
    { name: 'さくら', value: '#FCE4EC' },
    { name: 'ひよこ', value: '#FFF9C4' },
    { name: 'みず', value: '#E0F7FA' },
];

// ★ CollectionItemの型定義 (collection/page.tsx と同じ)
interface CollectionItem {
    id: number;
    name: string;
    description: string;
    iconName: string | null;
    quantity: number;
    rarity: string;
    weather: string | null;
}

// ★ 着せ替えアイテムの定義 (iconNameで管理)
const equipmentOptions = [
    { name: 'なし', iconName: null, icon: <IoBan size={28} /> },
    { name: 'ぼうし', iconName: 'FaHatCowboy', icon: <FaHatCowboy size={28} /> },
];

const getBackgroundGradientClass = (weather: WeatherType | null): string => {
    // --- (中略: getBackgroundGradientClassは変更なし) ---
    switch (weather) {
        case 'clear': return 'bg-clear';
        case 'cloudy': return 'bg-cloudy';
        case 'rainy': return 'bg-rainy';
        case 'thunderstorm': return 'bg-thunderstorm';
        case 'snowy': return 'bg-snowy';
        case 'windy': return 'bg-windy';
        case 'night': return 'bg-night';
        case 'sunny':
        default: return 'bg-sunny';
    }
};
// --- ▲▲▲ 変更点1ここまで ▲▲▲ ---


export default function SettingsPage() {
    const [dynamicBackgroundClass, setDynamicBackgroundClass] = useState('bg-sunny');
    // ★★★ 変更点: isNight State を追加 ★★★
    const [isNight, setIsNight] = useState(false);
    const [volume, setVolume] = useState(70);
    const [soundEffectVolume, setSoundEffectVolume] = useState(50);
    const [petName, setPetName] = useState("てんちゃん");
    const [isEditingName, setIsEditingName] = useState(false);
    const [editingName, setEditingName] = useState("");
    const [petColor, setPetColor] = useState('white');

    // --- ▼▼▼ 変更点2: きせかえ関連の State を追加 ▼▼▼ ---
    const [equipment, setEquipment] = useState<string | null>(null);
    const [ownedItems, setOwnedItems] = useState<CollectionItem[]>([]);
    const [loadingCollection, setLoadingCollection] = useState(true);
    // --- ▲▲▲ 変更点2ここまで ▲▲▲ ---

    // --- ▼▼▼ 変更点3: 色と装備も読み込むように変更 ▼▼▼ ---
    useEffect(() => {
        const storedName = localStorage.getItem(PET_NAME_STORAGE_KEY);
        if (storedName) {
            setPetName(storedName);
        }
        const storedColor = localStorage.getItem(PET_COLOR_STORAGE_KEY);
        if (storedColor) {
            setPetColor(storedColor);
        }
        // ★ 装備を読み込む (追加)
        const storedEquipment = localStorage.getItem(PET_EQUIPMENT_KEY);
        if (storedEquipment) {
            setEquipment(storedEquipment);
        }

        const storedWeather = localStorage.getItem(CURRENT_WEATHER_KEY) as WeatherType | null;
        setDynamicBackgroundClass(getBackgroundGradientClass(storedWeather));
        // ★★★ 変更点: isNight をセット ★★★
        setIsNight(storedWeather === 'night');

        // ★ 所持アイテムをフェッチ (追加)
        const fetchCollection = async () => {
            try {
                setLoadingCollection(true);
                const response = await fetch('/api/collection');
                const data: CollectionItem[] = await response.json();
                // 所持しているアイテムのみをフィルタリング
                setOwnedItems(data.filter(item => item.quantity > 0));
            } catch (error) {
                console.error("コレクションの取得に失敗しました", error);
            } finally {
                setLoadingCollection(false);
            }
        };
        fetchCollection();
    }, []);
    // --- ▲▲▲ 変更点3ここまで ▲▲▲ ---

    // --- (中略: 音量、名前変更ハンドラは変更なし) ---
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
    };
    const handleSoundEffectVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSoundEffectVolume(Number(event.target.value));
    };
    const handleNameChangeClick = () => {
        setEditingName(petName);
        setIsEditingName(true);
    };
    const handleEditingNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditingName(event.target.value);
    };
    const notifySettingsChanged = () => {
        window.dispatchEvent(new CustomEvent(PET_SETTINGS_CHANGED_EVENT));
    };
    const handleSaveName = () => {
        const newName = editingName.trim();
        if (newName) {
            setPetName(newName);
            localStorage.setItem(PET_NAME_STORAGE_KEY, newName);
            setIsEditingName(false);
            notifySettingsChanged();
        } else {
            alert("名前を入力してください。");
        }
    };
    const handleCancelEditName = () => {
        setIsEditingName(false);
    };
    const handleColorSelect = (colorValue: string) => {
        setPetColor(colorValue);
        localStorage.setItem(PET_COLOR_STORAGE_KEY, colorValue);
        notifySettingsChanged();
    };
    // --- (中略ここまで) ---

    // --- ▼▼▼ 変更点4: 装備選択ハンドラを追加 ▼▼▼ ---
    const handleEquipmentSelect = (iconName: string | null) => {
        const newEquipment = iconName;
        setEquipment(newEquipment);
        if (newEquipment) {
            localStorage.setItem(PET_EQUIPMENT_KEY, newEquipment);
        } else {
            localStorage.removeItem(PET_EQUIPMENT_KEY); //「なし」の場合はキーを削除
        }
        notifySettingsChanged();
    };
    // --- ▲▲▲ 変更点4ここまで ▲▲▲ ---


    // ★★★ 変更点: 夜間用のリンク色 ★★★
    const linkColor = isNight ? 'text-gray-300 hover:text-white' : 'text-slate-500 hover:text-slate-700';
    // ★★★ 変更点: 夜間用のタイトルとアイコン色 ★★★
    const titleColor = isNight ? 'text-white' : 'text-slate-800';
    const titleIconColor = isNight ? 'text-gray-300' : 'text-slate-500';

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* ★★★ 変更点: main の文字色を動的に ★★★ */}
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col ${isNight ? 'text-white' : ''} ${dynamicBackgroundClass}`}>
                {/* (中略: ヘッダー、名前セクション、色セクションは変更なし) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>
                <div className="flex-grow overflow-y-auto p-6">
                    {/* ★★★ 変更点: linkColor を適用 ★★★ */}
                    <Link href="/" className={`mb-6 inline-block text-sm font-semibold ${linkColor} transition-colors`}>← もどる</Link>
                    <header className="mb-8">
                        {/* ★★★ 変更点: titleColor を適用 ★★★ */}
                        <h1 className={`text-4xl font-extrabold ${titleColor} tracking-wider flex items-center gap-2 backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1`}>
                            設定
                            {/* ★★★ 変更点: titleIconColor を適用 ★★★ */}
                            <IoSettingsSharp size={28} className={titleIconColor} />
                        </h1>
                    </header>
                    {/* ★★★ 変更点: パネル内の文字色は変更しない (白背景のため) ★★★ */}
                    <section className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <h2 className="text-lg font-semibold text-slate-600 mb-3">ペットの名前</h2>
                        {isEditingName ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={handleEditingNameChange}
                                    className="w-full bg-white rounded-lg shadow p-3 text-slate-700 font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                    maxLength={10}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={handleCancelEditName} className="bg-gray-200 text-slate-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-300 transition-colors">
                                        キャンセル
                                    </button>
                                    <button onClick={handleSaveName} className="bg-sky-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-sky-600 transition-colors">
                                        保存する
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <button onClick={handleNameChangeClick} className="w-full bg-white rounded-xl shadow p-4 text-center text-slate-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all">
                                    {petName}
                                </button>
                                <p className="text-xs text-slate-500 text-center mt-1">タップして名前を変更</p>
                            </div>
                        )}
                    </section>
                    {/* ★★★ 変更点: パネル内の文字色は変更しない (白背景のため) ★★★ */}
                    <section className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <h2 className="text-lg font-semibold text-slate-600 mb-3">ペットのいろ</h2>
                        <div className="flex justify-around items-center gap-2">
                            {colorOptions.map(color => (
                                <button
                                    key={color.value}
                                    onClick={() => handleColorSelect(color.value)}
                                    className="flex flex-col items-center gap-1 transition-transform hover:scale-105 active:scale-95"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full border-2 shadow-inner"
                                        style={{
                                            backgroundColor: color.value,
                                            borderColor: petColor === color.value ? '#0ea5e9' : '#ffffff'
                                        }}
                                    >
                                        {petColor === color.value && (
                                            <div className="w-full h-full flex items-center justify-center text-sky-600">
                                                <IoCheckmark size={28} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-slate-600">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* --- ▼▼▼ 変更点5: きせかえセクションを変更 ▼▼▼ --- */}
                    {/* ★★★ 変更点: パネル内の文字色は変更しない (白背景のため) ★★★ */}
                    <section className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <h2 className="text-lg font-semibold text-slate-600 mb-3">きせかえ</h2>
                        {loadingCollection ? (
                            <p className="text-xs text-slate-500 text-center animate-pulse">所持アイテムを確認中...</p>
                        ) : (
                            <div className="flex justify-around items-center gap-2">
                                {equipmentOptions.map(option => {
                                    // 「なし」ボタンは常に有効
                                    if (option.iconName === null) {
                                        return (
                                            <button
                                                key="none"
                                                onClick={() => handleEquipmentSelect(null)}
                                                className="flex flex-col items-center gap-1 transition-transform hover:scale-105 active:scale-95"
                                            >
                                                <div
                                                    className={`w-12 h-12 rounded-full border-2 shadow-inner flex items-center justify-center text-slate-500`}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        borderColor: equipment === null ? '#0ea5e9' : '#ffffff'
                                                    }}
                                                >
                                                    {option.icon}
                                                </div>
                                                <span className="text-xs font-medium text-slate-600">{option.name}</span>
                                            </button>
                                        );
                                    }

                                    // アイテムを持っているか確認
                                    const hasItem = ownedItems.some(item => item.iconName === option.iconName);

                                    return (
                                        <button
                                            key={option.iconName}
                                            onClick={() => handleEquipmentSelect(option.iconName)}
                                            disabled={!hasItem} // ★ 所持していなければ無効
                                            className="flex flex-col items-center gap-1 transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full border-2 shadow-inner flex items-center justify-center ${hasItem ? 'text-slate-700' : 'text-slate-400'}`}
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderColor: equipment === option.iconName ? '#0ea5e9' : '#ffffff'
                                                }}
                                            >
                                                {option.icon}
                                            </div>
                                            <span className={`text-xs font-medium ${hasItem ? 'text-slate-600' : 'text-slate-400'}`}>
                                                {hasItem ? option.name : '？？？'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                    {/* --- ▲▲▲ 変更点5ここまで ▲▲▲ --- */}


                    {/* --- 音量設定セクション (変更なし) --- */}
                    {/* ★★★ 変更点: パネル内の文字色は変更しない (白背景のため) ★★★ */}
                    <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <h2 className="text-lg font-semibold text-slate-600 mb-4">音量設定</h2>
                        <div className="space-y-6">
                            {/* (音量スライダー) */}
                            <div className="flex items-center gap-4 relative">
                                <label htmlFor="volume-slider" className="w-16 text-sm font-medium text-slate-600">音量</label>
                                <div className="flex-1 h-2 bg-white rounded-full relative mr-4">
                                    <div className="absolute top-0 left-0 h-full bg-blue-300 rounded-full pointer-events-none" style={{ width: `${volume}%` }}></div>
                                </div>
                                <input id="volume-slider" type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="absolute left-20 right-4 top-0 bottom-0 m-auto w-[calc(100%-6rem)] h-6 opacity-0 cursor-pointer z-10" />
                            </div>
                            {/* (効果音スライダー) */}
                            <div className="flex items-center gap-4 relative">
                                <label htmlFor="sfx-slider" className="w-16 text-sm font-medium text-slate-600">効果音</label>
                                <div className="flex-1 h-2 bg-white rounded-full relative mr-4">
                                    <div className="absolute top-0 left-0 h-full bg-blue-300 rounded-full pointer-events-none" style={{ width: `${soundEffectVolume}%` }}></div>
                                </div>
                                <input id="sfx-slider" type="range" min="0" max="100" value={soundEffectVolume} onChange={handleSoundEffectVolumeChange} className="absolute left-20 right-4 top-0 bottom-0 m-auto w-[calc(100%-6rem)] h-6 opacity-0 cursor-pointer z-10" />
                            </div>
                        </div>
                    </section>
                </div>

                <Footer />
            </main>
        </div>
    );
}