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

export default function TenChanHomeClient({ initialData }) {
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

    const getTimeOfDay = (date: Date): TimeOfDay => {
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 19) return "evening";
        return "night";
    };

    const timeOfDay = getTimeOfDay(currentTime);

    useEffect(() => {
        setIsClient(true);
        // ↓↓↓ ここからが変更点です ↓↓↓
        setWeather(null); // まずローディング表示に切り替え

        const fetchTimeout = setTimeout(() => {
            const fallbackToInitialData = () => {
                if (initialData) {
                    setWeather(initialData.weather);
                    setTemperature(initialData.temperature);
                    setLocation(initialData.location);
                }
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
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
                            } else {
                                fallbackToInitialData();
                            }
                        } catch (error) {
                            console.error("Failed to fetch weather on client:", error);
                            fallbackToInitialData();
                        }
                    },
                    () => {
                        fallbackToInitialData();
                    }
                );
            } else {
                fallbackToInitialData();
            }
        }, 1000);
        // ↑↑↑ ここまでが変更点です ↑↑↑

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        const hungerTimer = setInterval(() => {
            setPetState((prev) => ({
                ...prev,
                hunger: Math.max(0, prev.hunger - 1),
                happiness: prev.hunger > 20 ? prev.happiness : Math.max(0, prev.happiness - 1),
            }));
        }, 60000 * 5);

        return () => {
            clearTimeout(fetchTimeout); // clearTimeoutを追加
            clearInterval(timer);
            clearInterval(hungerTimer);
        };
    }, [initialData]);

    const getPetMood = (): "happy" | "neutral" | "sad" => {
        if (petState.happiness > 70) return "happy";
        if (petState.happiness > 40) return "neutral";
        return "sad";
    };

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-[#5D4037] bg-main-bg bg-cover bg-center`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="pt-8 text-center h-[150px] flex flex-col justify-center">
                    <div className="flex flex-col items-center gap-2">
                        {weather ? (
                            <>
                                {timeOfDay === 'night' ? (
                                    <WeatherIcon type="night" size={96} />
                                ) : (
                                    <WeatherIcon type={weather} size={96} />
                                )}
                                <div className="flex items-center justify-center gap-2 text-sm text-[#5D4037]/80 bg-white/30 backdrop-blur-sm rounded-md px-2 py-1">
                                    {isClient && <span>{currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')}</span>}
                                    {temperature !== null && <span>・{temperature}°C</span>}
                                    {location && <span>・{location}</span>}
                                </div>
                            </>
                        ) : (
                            <div className="h-[120px] flex items-center justify-center">
                                <p className="text-sm text-[#5D4037]/80 animate-pulse bg-white/30 backdrop-blur-sm rounded-md px-2 py-1">おてんき しらべちゅう...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center gap-y-4 p-3 text-center pb-20">
                    <div className="w-40 h-40 rounded-full bg-white p-2">
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                            <CharacterFace mood={getPetMood()} />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-4xl font-bold backdrop-blur-sm bg-white/30 rounded-lg px-4 py-1">{petState.name}</h1>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}