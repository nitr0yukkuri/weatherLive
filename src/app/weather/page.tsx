'use client';

import { useState, useEffect, useCallback } from 'react';
import CharacterFace from '../components/CharacterFace';
import ForecastCard from '../components/ForecastCard';
import Link from 'next/link';
import Footer from '../components/Footer';

// ===================================
// ★ 1. 型定義をコンポーネントの外に移動
// ===================================
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
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

// ===================================
// ★ 2. ロジック関数をコンポーネントの外に移動
// ===================================

const mapWeatherType = (weatherCode: string): string => {
    const code = weatherCode.toLowerCase();
    if (code.includes("rain")) return "rainy";
    if (code.includes("snow")) return "snowy";
    if (code.includes("clouds")) return "cloudy";
    return "sunny";
};

const getWeatherText = (weatherType: string): string => {
    switch (weatherType) {
        case 'partlyCloudy': return '晴れ時々くもり';
        case 'cloudy': return 'くもり';
        case 'sunny': return '晴れ';
        case 'rainy': return '雨';
        case 'snowy': return '雪';
        case 'night': return '夜';
        default: return '晴れ';
    }
};

const getTimeOfDay = (date: Date): TimeOfDay => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 19) return "evening";
    return "night";
};

// 背景色決定ロジック
const getBackgroundColorClass = (weatherType: string | undefined): string => {
    if (!weatherType) return 'bg-sky-200';

    switch (weatherType) {
        case 'sunny':
            return 'bg-orange-200';
        case 'rainy':
            return 'bg-blue-200';
        case 'cloudy':
        case 'partlyCloudy':
            return 'bg-gray-200';
        case 'night':
        case 'snowy':
        default:
            return 'bg-sky-200';
    }
};

// メッセージ生成ロジック
const generateAdviceMessage = (data: { day: string; weather: string; high: number; low: number; pop: number }, index: number): string => {
    const { day, weather, high, low, pop } = data;
    const weatherText = getWeatherText(weather);

    let messages: string[] = [];

    if (pop >= 50) {
        messages = [
            `☔ ${day}は雨が降るみたい！傘を忘れないでね。`,
            `💧 降水確率は${pop}%だよ。今日はお気に入りのレイングッズを用意しよう！`,
            `🌧️ ${day}は雨模様...。濡れないように気をつけてね。`,
        ];
    } else if (high >= 25) {
        messages = [
            `🥵 ${day}は${high}°Cまで上がるよ！半袖のほうがいいかも。`,
            `☀️ 暑い一日になりそう！水分補給を忘れずにね。`,
            `💦 ${day}はとっても暑くなるよ。熱中症には気をつけて。`,
        ];
    } else if (low <= 5) {
        messages = [
            `🥶 ${day}は${low}°Cまで下がるよ...。しっかり防寒してね。`,
            `❄️ 寒い日が続きそうだね。温かい飲み物を飲んで体を冷やさないように！`,
            `🌬️ ${day}は冷え込む予報だよ。マフラーや手袋が必要かも。`,
        ];
    } else {
        messages = [
            `${day}の天気は${weatherText}だよ。最高${high}°C、最低${low}°C。`,
            `${day}の予報は${weatherText}だね。穏やかな一日になりますように。`,
            `今日（${day}）の天気予報は、${weatherText}！`,
        ];
    }

    const selectedIndex = index % messages.length;
    return messages[selectedIndex];
};


// ===================================
// ★ 3. メインコンポーネント本体 (短縮)
// ===================================
export default function WeatherPage() {
    // --- State定義 (短縮) ---
    const [location, setLocation] = useState('位置情報を取得中...');
    const [forecast, setForecast] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDayMessage, setSelectedDayMessage] = useState<string | null>(null);
    const [messageIndex, setMessageIndex] = useState(0);

    // --- メモ化された関数 (ロジックを簡潔に保つ) ---
    const handleInitialMessage = useCallback((data: Forecast[]) => {
        if (data.length > 0) {
            const todayData = data[0];
            const initialMessage = generateAdviceMessage(todayData, 0);
            setSelectedDayMessage(initialMessage);
            setMessageIndex(1);
        }
    }, []);

    const handleCardClick = useCallback((data: { day: string; weather: string; high: number; low: number; pop: number }) => {
        const message = generateAdviceMessage(data, messageIndex);
        setSelectedDayMessage(message);
        setMessageIndex(prevIndex => (prevIndex + 1));
    }, [messageIndex]);


    // --- データ取得ロジック (useEffect内に集約) ---
    useEffect(() => {
        const fetchWeatherData = async (latitude: number, longitude: number) => {
            setError(null);
            try {
                // APIからのデータ取得
                const forecastResponse = await fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
                const data = await forecastResponse.json();
                if (!forecastResponse.ok) throw new Error(data.message || '予報の取得に失敗しました');
                setLocation(data.city.name || "不明な場所");

                // 週間予報データの整形ロジック
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

                const timeOfDay = getTimeOfDay(new Date());

                const formattedForecast = Array.from(dailyForecasts.entries()).slice(0, 5).map(([dateStr, dailyData], index) => {
                    const date = new Date(dateStr);
                    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
                    let dayLabel = index === 0 ? '今日' : index === 1 ? '明日' : `${date.getMonth() + 1}/${date.getDate()}`;
                    let weather = dailyData.weathers.some(w => w.toLowerCase().includes('rain')) ? 'rainy' : mapWeatherType(dailyData.weathers[0]);

                    if (index === 0 && weather === 'sunny' && timeOfDay === 'night') {
                        weather = 'night';
                    }

                    return {
                        day: dayLabel, date: dayOfWeek, weather: weather,
                        high: Math.round(Math.max(...dailyData.temps)),
                        low: Math.round(Math.min(...dailyData.temps)),
                        pop: Math.round(Math.max(...dailyData.pops) * 100),
                    };
                });
                setForecast(formattedForecast);
                handleInitialMessage(formattedForecast);
            } catch (err: any) {
                console.error("Failed to fetch weather forecast:", err);
                setError(err.message);
                setLocation("天気情報の取得に失敗");
                setSelectedDayMessage("あれれ、うまくお天気を調べられなかったみたい...");
            } finally {
                setLoading(false);
            }
        };

        // Geolocationロジック
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchWeatherData(position.coords.latitude, position.coords.longitude),
                () => {
                    setLocation("位置情報が取得できませんでした");
                    setError("位置情報の取得を許可してください。");
                    setLoading(false);
                    setSelectedDayMessage("位置情報の取得を許可してね...");
                }
            );
        } else {
            setLocation("位置情報機能が利用できません");
            setLoading(false);
            setSelectedDayMessage("この端末では位置情報機能が利用できません。");
        }
    }, [handleInitialMessage]);


    // --- UIレンダリング (短縮) ---
    const todayWeather = forecast.length > 0 ? forecast[0].weather : undefined;
    const dynamicBackgroundClass = getBackgroundColorClass(todayWeather);

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 transition-colors duration-500 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="max-w-md mx-auto">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← もどる</Link>

                        <header className="mb-8">
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider">天気予報</h1>
                            <p className="text-slate-500 mt-1">{location}</p>
                        </header>

                        <div className="flex items-center gap-4 p-4 mb-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-md">
                            <div className="w-16 h-16 flex-shrink-0">
                                <CharacterFace mood={error ? 'sad' : 'happy'} />
                            </div>
                            <p className="text-slate-600 text-sm">
                                {selectedDayMessage || "お天気を調べてるよ..."}
                            </p>
                        </div>

                        <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar min-h-[260px]">
                            {loading ? (
                                <p className="w-full text-center text-slate-500 pt-20">お天気を調べてるよ...</p>
                            ) : error ? (
                                <p className="w-full text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>
                            ) : (
                                forecast.map((data, index) => (
                                    <ForecastCard
                                        key={index}
                                        {...data}
                                        onClick={handleCardClick}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}