'use client';

import { useState, useEffect } from 'react';
import CharacterFace from '../components/CharacterFace';
import ForecastCard from '../components/ForecastCard';
import Link from 'next/link';
import Footer from '../components/Footer';

// 型定義
interface Forecast {
    day: string;
    date: string;
    weather: string;
    high: number;
    low: number;
    pop: number;
}
interface DailyData {
    temps: number[];
    pops: number[];
    weathers: string[];
}

export default function WeatherPage() {
    const [location, setLocation] = useState('位置情報を取得中...');
    const [forecast, setForecast] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mapWeatherType = (weatherCode: string): string => {
        const code = weatherCode.toLowerCase();
        if (code.includes("rain")) return "rainy";
        if (code.includes("snow")) return "snowy";
        if (code.includes("clouds")) return "cloudy";
        return "sunny";
    };

    useEffect(() => {
        const fetchWeatherData = async (latitude: number, longitude: number) => {
            setError(null);
            try {
                const forecastResponse = await fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
                const data = await forecastResponse.json();

                if (!forecastResponse.ok) {
                    throw new Error(data.message || '予報の取得に失敗しました');
                }

                setLocation(data.city.name || "不明な場所");

                const dailyForecasts = new Map<string, DailyData>();
                data.list.forEach((item: any) => {
                    const date = new Date(item.dt * 1000).toLocaleDateString('ja-JP');
                    if (!dailyForecasts.has(date)) {
                        dailyForecasts.set(date, { temps: [], pops: [], weathers: [] });
                    }
                    const dayData = dailyForecasts.get(date)!;
                    dayData.temps.push(item.main.temp);
                    dayData.pops.push(item.pop);
                    dayData.weathers.push(item.weather[0].main);
                });
                const formattedForecast = Array.from(dailyForecasts.entries()).slice(0, 5).map(([dateStr, dailyData], index) => {
                    const date = new Date(dateStr);
                    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
                    let dayLabel = index === 0 ? '今日' : index === 1 ? '明日' : `${date.getMonth() + 1}/${date.getDate()}`;
                    const weather = dailyData.weathers.some(w => w.toLowerCase().includes('rain')) ? 'rainy' : mapWeatherType(dailyData.weathers[0]);
                    return {
                        day: dayLabel,
                        date: dayOfWeek,
                        weather: weather,
                        high: Math.round(Math.max(...dailyData.temps)),
                        low: Math.round(Math.min(...dailyData.temps)),
                        pop: Math.round(Math.max(...dailyData.pops) * 100),
                    };
                });
                setForecast(formattedForecast);

            } catch (err: any) {
                console.error("Failed to fetch weather forecast:", err);
                setError(err.message);
                setLocation("天気情報の取得に失敗");
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchWeatherData(position.coords.latitude, position.coords.longitude),
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

    return (
        // ★ 1. トップページと同じ外枠を追加
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* ★ 2. スマホ風のメインコンテナに変更 */}
            <main className="w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 bg-sky-100">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                {/* ★ 3. コンテンツがはみ出た場合にスクロールするエリアを追加 */}
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="max-w-md mx-auto">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← もどる</Link>

                        <header className="mb-8">
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider">天気予報</h1>
                            <p className="text-slate-500 mt-1">{location}</p>
                        </header>

                        <div className="flex items-center gap-4 p-4 mb-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-md">
                            <CharacterFace mood={error ? 'sad' : 'happy'} />
                            <p className="text-slate-600 text-sm">{error ? "あれれ、うまくお天気を調べられなかったみたい..." : "今週の天気を教えるね！"}</p>
                        </div>

                        <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar min-h-[260px]">
                            {loading ? (
                                <p className="w-full text-center text-slate-500 pt-20">お天気を調べてるよ...</p>
                            ) : error ? (
                                <p className="w-full text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>
                            ) : (
                                forecast.map((data, index) => (
                                    <ForecastCard key={index} {...data} />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* ★ 4. Footerをメインコンテナの末尾に移動 */}
                <Footer />
            </main>
        </div>
    );
}