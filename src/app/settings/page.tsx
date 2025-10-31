// src/app/settings/page.tsx

'use client';

import Link from 'next/link';
import Footer from '../components/Footer';
import { IoSettingsSharp } from 'react-icons/io5';
import React, { useState, useEffect } from 'react'; // useEffect を追加

// --- ▼▼▼ 背景ここから ▼▼▼ ---
type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
const CURRENT_WEATHER_KEY = 'currentWeather'; // localStorage キー

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
        default: return 'bg-sunny'; // null の場合も sunny (初期表示など)
    }
};
// --- ▲▲▲ 背景ここまで ▲▲▲ ---

const PET_NAME_STORAGE_KEY = 'otenki-gurashi-petName'; // localStorageのキー

export default function SettingsPage() {
    // ★ 背景色のための State
    const [dynamicBackgroundClass, setDynamicBackgroundClass] = useState('bg-sunny');

    const [volume, setVolume] = useState(70);
    const [soundEffectVolume, setSoundEffectVolume] = useState(50);
    // ペット名の状態
    const [petName, setPetName] = useState("てんちゃん");
    // 編集モードの状態
    const [isEditingName, setIsEditingName] = useState(false);
    // 編集中の一時的な名前
    const [editingName, setEditingName] = useState("");

    // --- 変更: 初期表示時に localStorage から名前と天気を読み込む ---
    useEffect(() => {
        const storedName = localStorage.getItem(PET_NAME_STORAGE_KEY);
        if (storedName) {
            setPetName(storedName);
        }

        // ★ 背景色をセットする処理 (追加)
        const storedWeather = localStorage.getItem(CURRENT_WEATHER_KEY) as WeatherType | null;
        setDynamicBackgroundClass(getBackgroundGradientClass(storedWeather));

    }, []); // 空の依存配列で初回のみ実行

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
        // TODO: 実際の音量変更処理
    };

    const handleSoundEffectVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSoundEffectVolume(Number(event.target.value));
        // TODO: 実際の効果音変更処理
    };

    // --- 変更: 名前変更ボタンクリック時の処理 ---
    const handleNameChangeClick = () => {
        setEditingName(petName); // 現在の名前を編集用 state にコピー
        setIsEditingName(true); // 編集モードに切り替え
    };

    // --- 追加: 新しい名前の入力ハンドラー ---
    const handleEditingNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditingName(event.target.value);
    };

    // --- 追加: 名前保存処理 ---
    const handleSaveName = () => {
        const newName = editingName.trim();
        if (newName) {
            setPetName(newName); // 表示名を更新
            localStorage.setItem(PET_NAME_STORAGE_KEY, newName); // localStorage に保存
            setIsEditingName(false); // 編集モードを終了
        } else {
            // 名前が空の場合はエラー表示など (ここでは何もしない)
            alert("名前を入力してください。");
        }
    };

    // --- 追加: 編集キャンセル処理 ---
    const handleCancelEditName = () => {
        setIsEditingName(false); // 編集モードを終了 (入力内容は破棄)
    };


    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* ★★★ main タグの className を変更 ★★★ */}
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <Link href="/" className="text-slate-500 mb-6 inline-block text-sm font-semibold hover:text-slate-700 transition-colors">← もどる</Link>

                    <header className="mb-8">
                        {/* ★★★ h1 タグの className を変更 (視認性UP) ★★★ */}
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2 backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1">
                            設定
                            <IoSettingsSharp size={28} className="text-slate-500" />
                        </h1>
                    </header>

                    {/* ★★★ ペットの名前セクション (視認性UP) ★★★ */}
                    <section className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <h2 className="text-lg font-semibold text-slate-600 mb-3">ペットの名前</h2>
                        {isEditingName ? (
                            // --- 編集中の表示 ---
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={handleEditingNameChange}
                                    className="w-full bg-white rounded-lg shadow p-3 text-slate-700 font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                    maxLength={10} // 文字数制限（例）
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={handleCancelEditName}
                                        className="bg-gray-200 text-slate-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-300 transition-colors"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        onClick={handleSaveName}
                                        className="bg-sky-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-sky-600 transition-colors"
                                    >
                                        保存する
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // --- 通常時の表示 ---
                            <div>
                                <button
                                    onClick={handleNameChangeClick}
                                    className="w-full bg-white rounded-xl shadow p-4 text-center text-slate-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
                                >
                                    {petName} {/* 現在の名前を表示 */}
                                </button>
                                <p className="text-xs text-slate-500 text-center mt-1">タップして名前を変更</p>
                            </div>
                        )}
                    </section>

                    {/* ★★★ 音量設定セクション (視認性UP) ★★★ */}
                    <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <h2 className="text-lg font-semibold text-slate-600 mb-4">音量設定</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 relative">
                                <label htmlFor="volume-slider" className="w-16 text-sm font-medium text-slate-600">音量</label>
                                <div className="flex-1 h-2 bg-white rounded-full relative mr-4">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-blue-300 rounded-full pointer-events-none"
                                        style={{ width: `${volume}%` }}
                                    ></div>
                                </div>
                                <input
                                    id="volume-slider"
                                    type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}
                                    className="absolute left-20 right-4 top-0 bottom-0 m-auto w-[calc(100%-6rem)] h-6 opacity-0 cursor-pointer z-10"
                                />
                            </div>
                            <div className="flex items-center gap-4 relative">
                                <label htmlFor="sfx-slider" className="w-16 text-sm font-medium text-slate-600">効果音</label>
                                <div className="flex-1 h-2 bg-white rounded-full relative mr-4">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-blue-300 rounded-full pointer-events-none"
                                        style={{ width: `${soundEffectVolume}%` }}
                                    ></div>
                                </div>
                                <input
                                    id="sfx-slider" type="range" min="0" max="100" value={soundEffectVolume} onChange={handleSoundEffectVolumeChange}
                                    className="absolute left-20 right-4 top-0 bottom-0 m-auto w-[calc(100%-6rem)] h-6 opacity-0 cursor-pointer z-10"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <Footer />
            </main>
        </div>
    );
}