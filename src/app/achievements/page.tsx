// src/app/achievements/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import { FaSeedling, FaTrophy } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';

// 実績の型定義に進捗キーを追加
interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: JSX.Element;
    isUnlocked: boolean;
    progressKey: 'walkCount'; // 現時点では walkCount のみ
    goal: number;
    unit: string;
}

// UserProgress APIから取得するデータの型
interface UserProgress {
    walkCount: number;
    // 他の進捗データもここに追加される
}

// 実績のマスターデータ
const masterAchievements: Achievement[] = [
    {
        id: 1,
        title: 'はじめてのおさんぽ',
        description: 'はじめておさんぽに出かけた',
        icon: <FaSeedling size={24} />, // ← 実績固有のアイコン
        isUnlocked: false,
        progressKey: 'walkCount',
        goal: 1,
        unit: 'かい',
    },
    {
        id: 2,
        title: 'おさんぽマスター',
        description: 'さんぽに1000回行った',
        icon: <FaTrophy size={24} />, // ← 実績固有のアイコン
        isUnlocked: false,
        progressKey: 'walkCount',
        goal: 1000,
        unit: 'かいすう',
    },
    // ダミー実績（進捗バー表示の例として残します）
    {
        id: 3,
        title: '雲ひとつないコレクター',
        description: '快晴の日にアイテムを5種類集めた（ダミー）',
        icon: <FaTrophy size={24} />, // ← 実績固有のアイコン (仮)
        isUnlocked: false,
        progressKey: 'walkCount', // 暫定でwalkCountを使用
        goal: 500,
        unit: 'かいすう',
    },
];

// 実績の進捗と達成状況を計算する関数
const calculateAchievements = (progress: UserProgress, achievements: Achievement[]) => {
    const calculated = achievements.map(ach => {
        const currentProgress = progress[ach.progressKey] || 0;
        const isUnlocked = currentProgress >= ach.goal;

        // 達成済みの実績は、プログレスを目標値に固定
        const actualProgress = isUnlocked ? ach.goal : currentProgress;

        return {
            ...ach,
            isUnlocked: isUnlocked,
            progress: actualProgress,
        };
    });

    // 達成済みの実績を上に、未達成のものを下にソート
    return calculated.sort((a, b) => {
        if (a.isUnlocked && !b.isUnlocked) return -1;
        if (!a.isUnlocked && b.isUnlocked) return 1;
        return 0;
    });
};


export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<(Achievement & { progress: number })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                // 進捗データを取得
                const progressResponse = await fetch('/api/progress');
                const progressData: UserProgress = await progressResponse.json();

                // 取得した進捗に基づいて実績を計算
                const calculatedAchievements = calculateAchievements(progressData, masterAchievements);

                setAchievements(calculatedAchievements);
            } catch (error) {
                console.error("進捗情報の取得に失敗しました", error);
                // エラー時は静的データのみで進捗0として表示
                setAchievements(masterAchievements.map(a => ({ ...a, progress: 0 })));
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    // 実績カードコンポーネント
    const AchievementItem = ({ achievement }: { achievement: Achievement & { progress: number } }) => {
        // 進捗が100%を超えないように調整
        const progressPercentage = Math.min((achievement.progress / achievement.goal) * 100, 100);
        const progressBarColor = achievement.isUnlocked ? 'bg-green-600' : 'bg-yellow-500';

        return (
            <div className={`p-4 rounded-2xl shadow-lg transition-all
                ${achievement.isUnlocked ? 'bg-white' : 'bg-white/80 opacity-90'}`}
            >
                <div className="flex items-start gap-4">
                    {/* アイコン部分 */}
                    {/* ★★★ 修正箇所 ★★★ */}
                    <div className={`flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-1 border border-gray-300
                        ${achievement.isUnlocked ? 'text-green-600' : 'text-gray-400 opacity-70'}
                    `}>
                        {/* 達成状況に関わらず、実績データに設定されたアイコンを表示 */}
                        <div className="text-3xl">
                            {achievement.icon}
                        </div>
                    </div>
                    {/* ★★★ 修正ここまで ★★★ */}

                    <div className="flex-grow">
                        <p className={`font-bold text-lg ${achievement.isUnlocked ? 'text-slate-800' : 'text-slate-600'}`}>
                            {achievement.title}
                        </p>
                        <p className={`text-xs mt-1 ${achievement.isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                            {achievement.description}
                        </p>

                        {/* 達成状況表示 */}
                        <div className="mt-3">
                            {achievement.isUnlocked ? (
                                // 達成済み (Figmaの「完了！」ボタン)
                                <button className="w-full bg-black text-white font-bold py-2 rounded-lg text-sm shadow-md cursor-default">
                                    完了！
                                </button>
                            ) : (
                                // 未達成 (Figmaの進捗バー)
                                <div className="space-y-1">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-slate-500 font-bold">
                                            {achievement.unit}
                                        </p>
                                        <span className="text-sm font-bold text-slate-700">
                                            {achievement.progress}/{achievement.goal}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div
                                            className={`${progressBarColor} h-full rounded-full transition-all duration-500`}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className="w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col bg-green-100 text-slate-700">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <header className="mb-8">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← もどる</Link>
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2">
                            実績
                            <IoSettingsSharp size={28} className="text-slate-500" />
                        </h1>
                        <p className="text-slate-500 mt-1">てんちゃんとの思い出を見てみよう</p>
                    </header>

                    {loading ? (
                        <p className="text-center animate-pulse">実績を読み込み中...</p>
                    ) : (
                        <div className="space-y-4">
                            {achievements.map(ach => (
                                <AchievementItem key={ach.id} achievement={ach} />
                            ))}
                        </div>
                    )}
                </div>

                <Footer />
            </main>
        </div>
    );
}