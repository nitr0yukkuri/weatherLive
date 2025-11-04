// src/app/settings/page.tsx

'use client';

import Link from 'next/link';
import Footer from '../components/Footer';
import { IoSettingsSharp, IoCheckmark } from 'react-icons/io5'; // ★ IoCheckmark をインポート
import React, { useState, useEffect } from 'react';

// --- ▼▼▼ 変更点1: キーと色の定義を追加 ▼▼▼ ---
type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
const CURRENT_WEATHER_KEY = 'currentWeather'; // localStorage キー
const PET_NAME_STORAGE_KEY = 'otenki-gurashi-petName';
const PET_COLOR_STORAGE_KEY = 'otenki-gurashi-petColor'; // ★ 新しいキー
const PET_SETTINGS_CHANGED_EVENT = 'petSettingsChanged'; // ★ カスタムイベント名

// ★ 色の選択肢
const colorOptions = [
    { name: 'しろ', value: 'white' },
    { name: 'さくら', value: '#FCE4EC' }, // やさしいピンク
    { name: 'ひよこ', value: '#FFF9C4' }, // やさしい黄色
    { name: 'みず', value: '#E0F7FA' },   // やさしい水色
];

const getBackgroundGradientClass = (weather: WeatherType | null): string => {
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
    const [volume, setVolume] = useState(70);
    const [soundEffectVolume, setSoundEffectVolume] = useState(50);
    const [petName, setPetName] = useState("てんちゃん");
    const [isEditingName, setIsEditingName] = useState(false);
    const [editingName, setEditingName] = useState("");

    // --- ▼▼▼ 変更点2: 色の State を追加 ▼▼▼ ---
    const [petColor, setPetColor] = useState('white');
    // --- ▲▲▲ 変更点2ここまで ▲▲▲ ---

    // --- ▼▼▼ 変更点3: 色も読み込むように変更 ▼▼▼ ---
    useEffect(() => {
        // 名前を読み込む
        const storedName = localStorage.getItem(PET_NAME_STORAGE_KEY);
        if (storedName) {
            setPetName(storedName);
        }

        // ★ 色を読み込む (追加)
        const storedColor = localStorage.getItem(PET_COLOR_STORAGE_KEY);
        if (storedColor) {
            setPetColor(storedColor);
        }

        // 背景色をセットする処理
        const storedWeather = localStorage.getItem(CURRENT_WEATHER_KEY) as WeatherType | null;
        setDynamicBackgroundClass(getBackgroundGradientClass(storedWeather));
    }, []);
    // --- ▲▲▲ 変更点3ここまで ▲▲▲ ---

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

    // ★ 共通のイベント発火関数
    const notifySettingsChanged = () => {
        window.dispatchEvent(new CustomEvent(PET_SETTINGS_CHANGED_EVENT));
    };

    const handleSaveName = () => {
        const newName = editingName.trim();
        if (newName) {
            setPetName(newName);
            localStorage.setItem(PET_NAME_STORAGE_KEY, newName);
            setIsEditingName(false);
            notifySettingsChanged(); // ★ イベント発火
        } else {
            alert("名前を入力してください。");
        }
    };

    const handleCancelEditName = () => {
        setIsEditingName(false);
    };

    // --- ▼▼▼ 変更点4: 色選択ハンドラを追加 ▼▼▼ ---
    const handleColorSelect = (colorValue: string) => {
        setPetColor(colorValue); // 1. Stateを更新
        localStorage.setItem(PET_COLOR_STORAGE_KEY, colorValue); // 2. localStorageに保存
        notifySettingsChanged(); // 3. ★ イベント発火
    };
    // --- ▲▲▲ 変更点4ここまで ▲▲▲ ---


    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <Link href="/" className="text-slate-500 mb-6 inline-block text-sm font-semibold hover:text-slate-700 transition-colors">← もどる</Link>

                    <header className="mb-8">
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2 backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1">
                            設定
                            <IoSettingsSharp size={28} className="text-slate-500" />
                        </h1>
                    </header>

                    {/* --- ペットの名前セクション (変更なし) --- */}
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

                    {/* --- ▼▼▼ 変更点5: 色選択セクションを追加 ▼▼▼ --- */}
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
                                            borderColor: petColor === color.value ? '#0ea5e9' : '#ffffff' // 選択中ならスカイブルーの枠
                                        }}
                                    >
                                        {/* 選択中のチェックマーク */}
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
                    {/* --- ▲▲▲ 変更点5ここまで ▲▲▲ --- */}

                    {/* --- 音量設定セクション (変更なし) --- */}
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