// 動的なページにするために 'use client' を宣言します
'use client';

// 必要なライブラリを読み込みます
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // アニメーション用

// --- ここからがページの本体です ---
export default function OtenkiGurashiHome() {

    // --- 状態(State)管理 ---
    // useStateを使って、天気やキャラクターの状態を管理します。
    const [weather, setWeather] = useState('sunny'); // 天気の初期値
    const [characterName, setCharacterName] = useState('おてんきちゃん');
    const [location, setLocation] = useState('大阪');

    // --- 表示を切り替えるための関数 ---

    // 天気によって背景色を決定します
    const getBackgroundColor = () => {
        switch (weather) {
            case 'sunny':
                return 'bg-[#FFFAE7]'; // 優しい黄色
            case 'rainy':
                return 'bg-[#E0F7FF]'; // 優しい水色
            case 'cloudy':
                return 'bg-[#F3F4F6]'; // 優しい灰色
            default:
                return 'bg-white';
        }
    };

    // 天気によってキャラクターの絵文字を決定します
    const getCharacterEmoji = () => {
        switch (weather) {
            case 'sunny':
                return '😊';
            case 'rainy':
                return '😌';
            case 'cloudy':
                return '☁️';
            default:
                return '🙂';
        }
    };

    // --- ここからが見た目(UI)の部分です ---
    return (
        <main className={`flex flex-col h-screen w-screen transition-colors duration-1000 ${getBackgroundColor()}`}>

            {/* --- ヘッダー部分 --- */}
            <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
                <div className="text-left">
                    <p className="text-sm text-gray-500 font-bold">{location}</p>
                    <p className="text-2xl text-gray-700 font-bold">10月7日(火)</p>
                </div>
                <button className="text-3xl text-gray-400 transition-transform active:scale-90">
                    ⚙️
                </button>
            </header>

            {/* --- メインのキャラクター表示エリア --- */}
            <div className="flex-grow flex flex-col items-center justify-center pb-24 pt-20">
                <motion.div
                    className="w-48 h-48 relative cursor-pointer"
                    whileTap={{ scale: 0.95 }} // タップした時に少し小さくなるアニメーション
                >
                    <div className="w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center text-6xl">
                        {/* キャラクターが常に少しだけ上下に揺れるアニメーション */}
                        <motion.div
                            animate={{ y: [-3, 3, -3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {getCharacterEmoji()}
                        </motion.div>
                    </div>
                </motion.div>
                <p className="mt-4 text-gray-700 font-bold text-lg">{characterName}</p>
            </div>

            {/* --- フッターナビゲーション --- */}
            <footer className="absolute bottom-0 left-0 right-0 w-full bg-white/70 backdrop-blur-md rounded-t-3xl p-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <nav className="flex justify-around items-center h-16">
                    <button className="flex flex-col items-center justify-center gap-1 text-gray-600 transition-transform active:scale-95">
                        <div className="text-3xl">☀️</div>
                        <span className="text-xs font-bold">天気予報</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 text-gray-600 transition-transform active:scale-95">
                        <div className="text-3xl">🐾</div>
                        <span className="text-xs font-bold">おさんぽ</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 text-gray-600 transition-transform active:scale-95">
                        <div className="text-3xl">📖</div>
                        <span className="text-xs font-bold">ずかん</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 text-gray-600 transition-transform active:scale-95">
                        <div className="text-3xl">🏆</div>
                        <span className="text-xs font-bold">実績</span>
                    </button>
                </nav>
            </footer>
        </main>
    );
}