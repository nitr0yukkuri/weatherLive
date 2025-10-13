'use client';

import { useEffect, useState } from 'react';
import CharacterFace from './CharacterFace';
import WeatherIcon from './WeatherIcon';
import Footer from './Footer';

// 型定義
type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface PetState {
    name: string;
    level: number;
    happiness: number;
    hunger: number;
    lastFed: number;
}

// ★ propsで初期データを受け取る
export default function TenChanHomeClient({ initialData }) {
    // 州の管理 (propsの初期データで初期化)
    const [weather, setWeather] = useState<WeatherType | null>(initialData?.weather || null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(initialData?.temperature || null);
    const [petState, setPetState] = useState<PetState>({
        name: "てんちゃん",
        level: 1,
        happiness: 80,
        hunger: 60,
        lastFed: Date.now(),
    });
    const [location, setLocation] = useState<string | null>(initialData?.location || null);
    const [isClient, setIsClient] = useState(false);

    // 時間帯を取得する関数
    const getTimeOfDay = (date: Date): TimeOfDay => {
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 20) return "evening";
        return "night";
    };

    // 背景のグラデーションを動的に変更する関数
    const getBackgroundStyle = () => {
        const time = getTimeOfDay(currentTime);

        if (time === "night") return "bg-gradient-to-b from-gray-800 to-black";
        if (time === "evening") return "bg-gradient-to-b from-pink-400 to-indigo-500";
        if (!weather) return "bg-gradient-to-b from-pink-200 to-yellow-200";

        switch (weather) {
            case "rainy": return "bg-gradient-to-b from-pink-200 to-blue-300";
            case "cloudy": return "bg-gradient-to-b from-pink-200 to-gray-300";
            case "snowy": return "bg-gradient-to-b from-pink-100 to-blue-200";
            default: return "bg-gradient-to-b from-pink-200 to-yellow-200";
        }
    };

    // クライアントサイドでのみ実行する処理 (より正確な位置情報で更新)
    useEffect(() => {
        setIsClient(true);
        // ★ 1秒後に実行することで、初期表示への影響をなくす
        setTimeout(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    // 位置情報が初期表示と大きく変わらない場合は再取得しない(任意)
                    // if (Math.abs(latitude - parseFloat(initialData?.lat)) < 0.1) return;

                    try {
                        const response = await fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
                        if (response.ok) {
                            const data = await response.json();
                            const currentWeather = data.list[0];
                            setLocation(data.city.name || "不明な場所");
                            setTemperature(Math.round(currentWeather.main.temp));
                            const weatherCode = currentWeather.weather[0].main.toLowerCase();

                            if (weatherCode.includes("rain")) setWeather("rainy");
                            else if (weatherCode.includes("snow")) setWeather("snowy");
                            else if (weatherCode.includes("clouds")) setWeather("cloudy");
                            else setWeather("sunny");
                        }
                    } catch (error) {
                        console.error("Failed to fetch weather on client:", error);
                    }
                });
            }
        }, 1000);


        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        const hungerTimer = setInterval(() => {
            setPetState((prev) => ({
                ...prev,
                hunger: Math.max(0, prev.hunger - 1),
                happiness: prev.hunger > 20 ? prev.happiness : Math.max(0, prev.happiness - 1),
            }));
        }, 60000 * 5);

        return () => {
            clearInterval(timer);
            clearInterval(hungerTimer);
        };
    }, []);

    const getPetMood = (): "happy" | "neutral" | "sad" => {
        if (petState.happiness > 70) return "happy";
        if (petState.happiness > 40) return "neutral";
        return "sad";
    };

    // ★ ここから下は元のJSXとほぼ同じ
    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-[#5D4037] transition-colors duration-1000 ${getBackgroundStyle()}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="pt-8 text-center min-h-[150px] flex flex-col justify-center">
                    <div className="flex flex-col items-center gap-2">
                        {weather ? (
                            <>
                                <WeatherIcon type={weather} size={96} />
                                <div className="flex items-center justify-center gap-2 text-sm text-[#5D4037]/80">
                                    {isClient && <span>{currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')}</span>}
                                    {temperature !== null && <span>・{temperature}°C</span>}
                                    {location && <span>・{location}</span>}
                                </div>
                            </>
                        ) : (
                            <div className="h-[120px] flex items-center justify-center">
                                <p className="text-sm text-[#5D4037]/80 animate-pulse">おてんき しらべちゅう...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center gap-y-4 p-3 text-center pb-20">
                    <div className="w-64 h-64 rounded-full bg-white/30 p-2 shadow-inner backdrop-blur-sm">
                        <div className="w-full h-full rounded-full border-[3px] border-white/60 flex items-center justify-center">
                            <CharacterFace mood={getPetMood()} />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1">{petState.name}</h1>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}