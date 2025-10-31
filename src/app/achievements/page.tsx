// src/app/achievements/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
// --- ▼▼▼ 必要なアイコンを import ▼▼▼ ---
import {
    FaSeedling, FaTrophy, FaStar, FaMapMarkerAlt, FaRegSnowflake, FaCloudShowersHeavy, FaWind, FaMoon, FaBookOpen
} from 'react-icons/fa';
import { IoSunny, IoRainy, IoThunderstorm, IoSettingsSharp, IoCalendarClearOutline } from 'react-icons/io5';
import { BsSunFill, BsCloudFill, BsFillCloudLightningRainFill } from 'react-icons/bs';
import { GiSnail, GiAcorn, GiStoneBlock } from 'react-icons/gi';
// --- ▲▲▲ アイコンここまで ▲▲▲ ---

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


// 実績の型定義 (変更なし)
interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: JSX.Element;
    isUnlocked: boolean;
    // --- ▼▼▼ progressKey の型を拡張 ▼▼▼ ---
    progressKey: keyof UserProgress; // UserProgress のキー名を直接使うように変更
    // --- ▲▲▲ 変更ここまで ▲▲▲ ---
    goal: number;
    unit: string;
}

// UserProgress APIから取得するデータの型 (★ 拡張が必要)
interface UserProgress {
    walkCount: number;
    // --- ▼▼▼ ここから追加 ▼▼▼ ---
    sunnyWalkCount: number;
    clearWalkCount: number;
    rainyWalkCount: number;
    cloudyWalkCount: number;
    snowyWalkCount: number;
    thunderstormWalkCount: number;
    windyWalkCount: number;
    nightWalkCount: number;
    collectedItemTypesCount: number;
    collectedNormalItemTypesCount: number;
    collectedUncommonItemTypesCount: number;
    collectedRareItemTypesCount: number;
    collectedEpicItemTypesCount: number;
    collectedLegendaryItemTypesCount: number;
    consecutiveWalkDays: number;
    lastWalkDate?: string | Date; // Date 型または string 型で受け取る可能性
    // --- ▲▲▲ 追加ここまで ▲▲▲ ---
}


// --- ▼▼▼ 実績のマスターデータを大幅に追加 ▼▼▼ ---
const masterAchievements: Achievement[] = [
    // --- おさんぽ回数系 ---
    { id: 1, title: 'はじめてのおさんぽ', description: 'はじめておさんぽに出かけた', icon: <FaMapMarkerAlt size={24} />, isUnlocked: false, progressKey: 'walkCount', goal: 1, unit: 'かい' },
    { id: 2, title: 'おさんぽチャレンジャー', description: 'おさんぽに10回行った', icon: <FaMapMarkerAlt size={24} />, isUnlocked: false, progressKey: 'walkCount', goal: 10, unit: 'かい' },
    { id: 3, title: 'おさんぽエキスパート', description: 'おさんぽに50回行った', icon: <FaMapMarkerAlt size={24} />, isUnlocked: false, progressKey: 'walkCount', goal: 50, unit: 'かい' },
    { id: 10, title: 'おさんぽマスター', description: 'おさんぽに100回行った', icon: <FaTrophy size={24} />, isUnlocked: false, progressKey: 'walkCount', goal: 100, unit: 'かい' },
    { id: 11, title: '伝説のおさんぽ職人', description: 'おさんぽに500回行った', icon: <FaTrophy size={24} />, isUnlocked: false, progressKey: 'walkCount', goal: 500, unit: 'かい' }, // さらに追加も可能

    // --- 天気体験系 ---
    { id: 20, title: '太陽とともだち', description: '晴れの日にはじめておさんぽした', icon: <IoSunny size={24} />, isUnlocked: false, progressKey: 'sunnyWalkCount', goal: 1, unit: 'かい' },
    { id: 21, title: '快晴ハンター', description: '快晴の日にはじめておさんぽした', icon: <BsSunFill size={24} />, isUnlocked: false, progressKey: 'clearWalkCount', goal: 1, unit: 'かい' },
    { id: 22, title: '雨の日メロディ', description: '雨の日にはじめておさんぽした', icon: <IoRainy size={24} />, isUnlocked: false, progressKey: 'rainyWalkCount', goal: 1, unit: 'かい' },
    { id: 23, title: '曇り空ウォーカー', description: '曇りの日にはじめておさんぽした', icon: <BsCloudFill size={24} />, isUnlocked: false, progressKey: 'cloudyWalkCount', goal: 1, unit: 'かい' },
    { id: 24, title: '雪ん子アドベンチャー', description: '雪の日にはじめておさんぽした', icon: <FaRegSnowflake size={24} />, isUnlocked: false, progressKey: 'snowyWalkCount', goal: 1, unit: 'かい' },
    { id: 25, title: '雷雨サバイバー', description: '雷雨の日にはじめておさんぽした', icon: <IoThunderstorm size={24} />, isUnlocked: false, progressKey: 'thunderstormWalkCount', goal: 1, unit: 'かい' },
    { id: 26, title: '風の旅人', description: '風の強い日にはじめておさんぽした', icon: <FaWind size={24} />, isUnlocked: false, progressKey: 'windyWalkCount', goal: 1, unit: 'かい' },
    { id: 27, title: '夜のおともだち', description: '夜にはじめておさんぽした', icon: <FaMoon size={24} />, isUnlocked: false, progressKey: 'nightWalkCount', goal: 1, unit: 'かい' },
    // --- 天気別回数系 (例) ---
    { id: 30, title: '雨マスター', description: '雨の日のおさんぽを10回達成', icon: <FaCloudShowersHeavy size={24} />, isUnlocked: false, progressKey: 'rainyWalkCount', goal: 10, unit: 'かい' },
    { id: 31, title: '雷雨マスター', description: '雷雨の日のおさんぽを5回達成', icon: <BsFillCloudLightningRainFill size={24} />, isUnlocked: false, progressKey: 'thunderstormWalkCount', goal: 5, unit: 'かい' },

    // --- アイテム収集系 (種類) ---
    { id: 50, title: 'コレクションはじめました', description: 'はじめてアイテムをゲットした (種類)', icon: <GiStoneBlock size={24} />, isUnlocked: false, progressKey: 'collectedItemTypesCount', goal: 1, unit: 'しゅるい' },
    { id: 51, title: 'かけだしコレクター', description: 'アイテムを10種類集めた', icon: <GiAcorn size={24} />, isUnlocked: false, progressKey: 'collectedItemTypesCount', goal: 10, unit: 'しゅるい' },
    { id: 52, title: 'ノーマルマスター', description: 'ノーマルアイテムを5種類集めた', icon: <FaSeedling size={24} />, isUnlocked: false, progressKey: 'collectedNormalItemTypesCount', goal: 5, unit: 'しゅるい' },
    { id: 53, title: 'アンコモンハンター', description: 'アンコモンアイテムを3種類集めた', icon: <GiSnail size={24} />, isUnlocked: false, progressKey: 'collectedUncommonItemTypesCount', goal: 3, unit: 'しゅるい' },
    { id: 54, title: 'レアハンター', description: 'レアアイテムを3種類集めた', icon: <FaStar size={24} />, isUnlocked: false, progressKey: 'collectedRareItemTypesCount', goal: 3, unit: 'しゅるい' },
    { id: 55, title: 'エピックゲッター', description: 'エピックアイテムをはじめてゲットした', icon: <FaTrophy size={24} />, isUnlocked: false, progressKey: 'collectedEpicItemTypesCount', goal: 1, unit: 'しゅるい' },
    { id: 56, title: 'レジェンドとの遭遇', description: 'レジェンダリーアイテムをはじめてゲットした', icon: <FaTrophy size={24} />, isUnlocked: false, progressKey: 'collectedLegendaryItemTypesCount', goal: 1, unit: 'しゅるい' },
    { id: 60, title: 'ずかんコンプリート！', description: 'すべてのアイテムを集めた！', icon: <FaBookOpen size={24} />, isUnlocked: false, progressKey: 'collectedItemTypesCount', goal: 40, unit: 'しゅるい' }, // ★ goal は全アイテム数に合わせて変更

    // --- 継続系 ---
    { id: 70, title: '三日坊主じゃない！', description: '3日連続でおさんぽした', icon: <IoCalendarClearOutline size={24} />, isUnlocked: false, progressKey: 'consecutiveWalkDays', goal: 3, unit: 'にち' },
    { id: 71, title: '一週間チャレンジ', description: '7日連続でおさんぽした', icon: <IoCalendarClearOutline size={24} />, isUnlocked: false, progressKey: 'consecutiveWalkDays', goal: 7, unit: 'にち' },
    { id: 72, title: '継続は力なり', description: '30日連続でおさんぽした', icon: <FaTrophy size={24} />, isUnlocked: false, progressKey: 'consecutiveWalkDays', goal: 30, unit: 'にち' },
];
// --- ▲▲▲ 実績マスターデータここまで ▲▲▲ ---


// 実績の進捗と達成状況を計算する関数 (★ 修正: progressKey の型チェックを改善)
const calculateAchievements = (progress: UserProgress | null, achievements: Achievement[]) => {
    // ★ progress が null (取得失敗時など) の場合のフォールバックを追加
    if (!progress) {
        return achievements.map(ach => ({
            ...ach,
            isUnlocked: false,
            progress: 0,
        }));
    }

    const calculated = achievements.map(ach => {
        // ★ progressKey が progress オブジェクトに存在するか確認
        const currentProgress = (ach.progressKey in progress) ? (progress[ach.progressKey] || 0) : 0;
        // ★ currentProgress が数値であることを保証 (Date型などを弾く)
        const numericProgress = typeof currentProgress === 'number' ? currentProgress : 0;

        const isUnlocked = numericProgress >= ach.goal;
        const actualProgress = isUnlocked ? ach.goal : numericProgress;

        return {
            ...ach,
            isUnlocked: isUnlocked,
            progress: actualProgress,
        };
    });

    // ソートロジックは変更なし
    return calculated.sort((a, b) => {
        if (a.isUnlocked && !b.isUnlocked) return -1;
        if (!a.isUnlocked && b.isUnlocked) return 1;
        // 未達成同士、達成済み同士は ID 順にするなど
        return a.id - b.id;
    });
};


export default function AchievementsPage() {
    // ★ 背景色のための State
    const [dynamicBackgroundClass, setDynamicBackgroundClass] = useState('bg-sunny');

    // ★ UserProgress | null 型を受け付けるように変更
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [achievements, setAchievements] = useState<(Achievement & { progress: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // ★ エラー状態を追加

    // ★ 背景色を localStorage から読み込む useEffect
    useEffect(() => {
        const storedWeather = localStorage.getItem(CURRENT_WEATHER_KEY) as WeatherType | null;
        setDynamicBackgroundClass(getBackgroundGradientClass(storedWeather));
    }, []);

    useEffect(() => {
        const fetchProgress = async () => {
            setLoading(true);
            setError(null); // ★ エラーをリセット
            try {
                const progressResponse = await fetch('/api/progress');
                // ★ レスポンスが NG の場合の処理を追加
                if (!progressResponse.ok) {
                    const errorData = await progressResponse.json();
                    throw new Error(errorData.message || '進捗情報の取得に失敗しました');
                }
                const progressData: UserProgress = await progressResponse.json();
                setUserProgress(progressData); // ★ 取得したデータを state に保存

                // ★ 最新の進捗データを使って実績を計算
                const calculatedAchievements = calculateAchievements(progressData, masterAchievements);
                setAchievements(calculatedAchievements);

            } catch (err: any) { // ★ any 型でエラーを受け取る
                console.error("進捗情報の取得または実績計算に失敗しました", err);
                setError(err.message || '情報の取得に失敗しました。'); // ★ エラーメッセージを設定
                // ★ エラー時は進捗 0 として表示
                setAchievements(calculateAchievements(null, masterAchievements));
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []); // 依存配列は空のまま

    // 実績カードコンポーネント (AchievementItem) は変更なし ...
    // 実績カードコンポーネント
    const AchievementItem = ({ achievement }: { achievement: Achievement & { progress: number } }) => {
        // 進捗が100%を超えないように調整
        const progressPercentage = achievement.goal > 0 ? Math.min((achievement.progress / achievement.goal) * 100, 100) : (achievement.isUnlocked ? 100 : 0);
        const progressBarColor = achievement.isUnlocked ? 'bg-green-600' : 'bg-yellow-500';

        return (
            <div className={`p-4 rounded-2xl shadow-lg transition-all
                ${achievement.isUnlocked ? 'bg-white' : 'bg-white/80 opacity-90'}`}
            >
                <div className="flex items-start gap-4">
                    {/* アイコン部分 */}
                    <div className={`flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-1 border border-gray-300
                        ${achievement.isUnlocked ? 'text-green-600' : 'text-gray-400 opacity-70'}
                    `}>
                        <div className="text-3xl">
                            {achievement.icon}
                        </div>
                    </div>

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
                                // 達成済み
                                <button className="w-full bg-black text-white font-bold py-2 rounded-lg text-sm shadow-md cursor-default">
                                    完了！
                                </button>
                            ) : (
                                // 未達成
                                <div className="space-y-1">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-slate-500 font-bold">
                                            {achievement.unit}
                                        </p>
                                        <span className="text-sm font-bold text-slate-700">
                                            {/* goal が 0 の場合表示がおかしくなる可能性があるので考慮 */}
                                            {achievement.goal > 0 ? `${achievement.progress}/${achievement.goal}` : `${achievement.progress}`}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden"> {/* ★ overflow-hidden を追加 */}
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
            {/* ★★★ main タグの className を変更 ★★★ */}
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <header className="mb-8">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← もどる</Link>
                        {/* ★★★ h1 タグの className を変更 (視認性UP) ★★★ */}
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider flex items-center gap-2 backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1">
                            実績
                            {/* ★ アイコンを FaTrophy に変更 */}
                            <FaTrophy size={28} className="text-slate-500" />
                        </h1>
                        <p className="text-slate-500 mt-1">てんちゃんとの思い出を見てみよう</p>
                    </header>

                    {/* ★ ローディングとエラー表示を追加 */}
                    {loading ? (
                        <p className="text-center animate-pulse text-slate-500">実績を読み込み中...</p>
                    ) : error ? (
                        <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg shadow-sm">{error}</p>
                    ) : achievements.length > 0 ? (
                        <div className="space-y-4">
                            {achievements.map(ach => (
                                <AchievementItem key={ach.id} achievement={ach} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500">まだ実績がありません。</p>
                    )}
                </div>

                <Footer />
            </main>
        </div>
    );
}