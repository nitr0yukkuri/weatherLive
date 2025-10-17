// src/app/walk/page.tsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // ★ useRouterをインポート
import CharacterFace from '../components/CharacterFace';
import WeatherIcon from '../components/WeatherIcon';
import Link from 'next/link';
import Footer from '../components/Footer';
import ItemGetModal from '../components/ItemGetModal'; // ★ 作成したモーダルをインポート

// (型定義やヘルパー関数は変更なし)
// ===================================
// 型定義 (WeatherPage.tsxから流用)
// ===================================
interface Forecast {
    day: string;
    date: string;
    weather: string;
    high: number;
    low: number;
    pop: number;
}
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

// ===================================
// ヘルパー関数 (WeatherPage.tsxから流用/調整)
// ===================================

const mapWeatherType = (weatherCode: string): string => {
    const code = weatherCode.toLowerCase();
    if (code.includes("rain")) return "rainy";
    if (code.includes("snow")) return "snowy";
    if (code.includes("clouds")) return "cloudy";
    return "sunny";
};

const getBackgroundColorClass = (weatherType: string | undefined): string => {
    if (!weatherType) return 'bg-sky-200';

    switch (weatherType) {
        case 'sunny':
        case 'night':
            return 'bg-orange-200';
        case 'rainy':
            return 'bg-blue-200';
        case 'cloudy':
            return 'bg-gray-200';
        case 'snowy':
            return 'bg-sky-100';
        default:
            return 'bg-sky-200';
    }
};

const getWalkMessage = (weatherType: string | undefined): string => {
    if (!weatherType) return 'おさんぽに出発！';

    switch (weatherType) {
        case 'sunny':
            return '太陽が気持ちいいね！今日はたくさん歩けそう！';
        case 'rainy':
            return '雨だけど、特別なアイテムを見つけられるかも！';
        case 'cloudy':
            return 'くもりの日は、のんびりおさんぽにぴったり。';
        case 'snowy':
            return '雪だ！積もる前に、ちょっとだけおさんぽしよう。';
        case 'night':
            return '夜のおさんぽは静かでいいね。星を探してみよう。';
        default:
            return '今日も良いおさんぽ日和！';
    }
}


// ===================================
// メインコンポーネント
// ===================================

export default function WalkPage() {
    const router = useRouter(); // ★ routerインスタンスを取得
    const [weather, setWeather] = useState<string | null>(null);
    const [location, setLocation] = useState('位置情報を取得中...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ★ アイテム獲得モーダルのためのStateを追加
    const [obtainedItem, setObtainedItem] = useState<string | null>(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);


    const mood = useMemo(() => (error ? 'sad' : 'happy'), [error]);
    const dynamicBackgroundClass = useMemo(() => getBackgroundColorClass(weather || undefined), [weather]);

    // ★ 天気データ取得後にアイテム獲得をシミュレート
    useEffect(() => {
        const fetchCurrentWeather = async (latitude: number, longitude: number) => {
            setError(null);
            try {
                const response = await fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (!response.ok || !data.list || data.list.length === 0) {
                    throw new Error(data.message || '天気情報の取得に失敗');
                }

                setLocation(data.city.name || "不明な場所");
                const currentWeather = data.list[0];
                const weatherCode = currentWeather.weather[0].main.toLowerCase();

                const mappedWeather = mapWeatherType(weatherCode);

                const hour = new Date().getHours();
                const isNight = hour < 5 || hour >= 19;

                setWeather((isNight && mappedWeather === 'sunny') ? 'night' : mappedWeather);

            } catch (err: any) {
                console.error("Failed to fetch weather on client:", err);
                setError(err.message);
                setLocation("天気情報の取得に失敗");
            } finally {
                setLoading(false);
                // ★ ここから追加：おさんぽ完了とアイテム獲得をシミュレート
                setTimeout(() => {
                    // ここで天候に応じたアイテム取得ロジックなどを実装できます
                    // 今回は「あじさい」で固定
                    setObtainedItem('あじさい');
                    setIsItemModalOpen(true);
                }, 3000); // 3秒後におさんぽが終わる想定
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchCurrentWeather(position.coords.latitude, position.coords.longitude),
                () => {
                    setLocation("位置情報が取得できませんでした");
                    setError("位置情報の取得を許可してください。");
                    setLoading(false);
                }
            );
        } else {
            setLocation("位置情報機能が利用できません");
            setLoading(false);
        }
    }, []);

    // ★ OKボタンが押された時の処理
    const handleModalClose = () => {
        setIsItemModalOpen(false);
        router.push('/'); // ホーム画面に戻る
    };

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* ★ 作成したモーダルをレンダリング */}
            <ItemGetModal
                isOpen={isItemModalOpen}
                onClose={handleModalClose}
                itemName={obtainedItem}
            />

            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 transition-colors duration-500 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow flex flex-col p-6 items-center justify-between">
                    <div className="w-full">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← ホームにもどる</Link>

                        <header className="mb-8 text-center">
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-wider">おさんぽ中...</h1>
                            <p className="text-slate-500 mt-1">現在地: {location}</p>
                        </header>
                    </div>

                    <div className="flex flex-col items-center justify-center flex-grow p-4">
                        {loading ? (
                            <p className="text-lg text-slate-600 animate-pulse">おさんぽの準備中...</p>
                        ) : error ? (
                            <p className="text-center text-red-600 p-4 bg-white/70 rounded-xl max-w-[200px]">{error}</p>
                        ) : (
                            <>
                                {/* 天気アイコンの表示 */}
                                <div className="mb-4">
                                    <WeatherIcon type={weather || 'sunny'} size={60} />
                                </div>
                                {/* キャラクター */}
                                <div className="w-40 h-40 rounded-full bg-white p-2 mb-4">
                                    <div className="w-full h-full rounded-full flex items-center justify-center">
                                        <CharacterFace mood={mood} />
                                    </div>
                                </div>

                                {/* メッセージ吹き出し */}
                                <div className="p-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-md max-w-xs text-center">
                                    <p className="text-slate-700 text-base font-medium">{getWalkMessage(weather || undefined)}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}