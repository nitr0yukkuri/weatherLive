// src/app/settings/page.tsx

'use client';

import Link from 'next/link';
import Footer from '../components/Footer';
import { IoSettingsSharp } from 'react-icons/io5'; // インポートを確認
import React, { useState } from 'react'; // useState をインポート

export default function SettingsPage() {
    // useState を使って音量状態を管理
    const [volume, setVolume] = useState(70);
    const [soundEffectVolume, setSoundEffectVolume] = useState(50);
    // useState を使ってペットの名前を管理 (初期値は例)
    const [petName, setPetName] = useState("てんちゃん"); // 仮のペット名

    // 音量変更ハンドラー
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
    };

    // 効果音変更ハンドラー
    const handleSoundEffectVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSoundEffectVolume(Number(event.target.value));
    };

    // 名前変更ボタンのハンドラー (ダミー)
    const handleNameChangeClick = () => {
        // ここに名前変更モーダルなどを表示する処理を追加
        console.log("名前変更ボタンがクリックされました");
        // 例: 新しい名前を入力させるプロンプト (実際のアプリではモーダル推奨)
        // const newName = prompt("新しい名前を入力してください:", petName);
        // if (newName && newName.trim() !== "") {
        //     setPetName(newName.trim());
        // }
    };


    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* 背景色を水色系に変更 (bg-sky-100) */}
            <main className="w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col bg-sky-100 text-slate-700">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    {/* 戻るリンク */}
                    <Link href="/" className="text-slate-500 mb-6 inline-block text-sm font-semibold hover:text-slate-700 transition-colors">← もどる</Link>

                    {/* ページタイトル */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
                            設定
                            {/* アイコンを元に戻す */}
                            <IoSettingsSharp size={28} className="text-slate-500" />
                        </h1>
                    </header>

                    {/* ペットの名前セクション */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-600 mb-3">ペットの名前</h2>
                        {/* 名前変更ボタン */}
                        <button
                            onClick={handleNameChangeClick}
                            className="w-full bg-white rounded-xl shadow p-4 text-center text-slate-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                            {petName} {/* 現在の名前を表示 */}
                        </button>
                        <p className="text-xs text-slate-500 text-center mt-1">タップして名前を変更</p>
                    </section>

                    {/* 音量設定セクション */}
                    <section>
                        <h2 className="text-lg font-semibold text-slate-600 mb-4">音量設定</h2>
                        <div className="space-y-6">
                            {/* 音量スライダー */}
                            <div className="flex items-center gap-4 relative"> {/* relativeを追加 */}
                                <label htmlFor="volume-slider" className="w-16 text-sm font-medium text-slate-600">音量</label>
                                {/* スライダーの見た目 */}
                                <div className="flex-1 h-2 bg-white rounded-full relative mr-4">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-blue-300 rounded-full pointer-events-none"
                                        style={{ width: `${volume}%` }}
                                    ></div>
                                </div>
                                {/* input range */}
                                <input
                                    id="volume-slider"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="absolute left-20 right-4 top-0 bottom-0 m-auto w-[calc(100%-6rem)] h-6 opacity-0 cursor-pointer z-10"
                                />
                            </div>

                            {/* 効果音スライダー */}
                            <div className="flex items-center gap-4 relative"> {/* relativeを追加 */}
                                <label htmlFor="sfx-slider" className="w-16 text-sm font-medium text-slate-600">効果音</label>
                                {/* スライダーの見た目 */}
                                <div className="flex-1 h-2 bg-white rounded-full relative mr-4">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-blue-300 rounded-full pointer-events-none"
                                        style={{ width: `${soundEffectVolume}%` }}
                                    ></div>
                                </div>
                                {/* input range */}
                                <input
                                    id="sfx-slider"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={soundEffectVolume}
                                    onChange={handleSoundEffectVolumeChange}
                                    className="absolute left-20 right-4 top-0 bottom-0 m-auto w-[calc(100%-6rem)] h-6 opacity-0 cursor-pointer z-10"
                                />
                            </div>
                        </div>
                    </section>

                </div>

                {/* フッター */}
                <Footer />
            </main>
        </div>
    );
}