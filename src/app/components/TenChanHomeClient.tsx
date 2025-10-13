'use client';

import { useEffect, useState } from 'react';
import CharacterFace from './CharacterFace';
import WeatherIcon from './WeatherIcon';
import Footer from './Footer';

// 型定義
type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";

interface PetState {
    name: string;
    level: number;
    happiness: number;
    hunger: number;
    lastFed: number;
}

export default function TenChanHomeClient({ initialData }) {
    // ★ 1. 天気や場所の初期値を、常にnullに設定
    const [weather, setWeather] = useState<WeatherType | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);
    const [location, setLocation] = useState<string | null>(null);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [petState, setPetState] = useState<PetState>({
        name: "てんちゃん",
        level: 1,
        happiness: 80,
        hunger: 60,
        lastFed: Date.now(),
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const fetchClientWeather = async (position) => {
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
                    // ★ 2. 失敗した場合はサーバーのデータを表示
                    if (initialData) {
                        setWeather(initialData.weather);
                        setTemperature(initialData.temperature);
                        setLocation(initialData.location);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch weather on client:", error);
                if (initialData) {
                    setWeather(initialData.weather);
                    setTemperature(initialData.temperature);
                    setLocation(initialData.location);
                }
            }
        };

        const handleGeolocationError = () => {
            // ★ 3. 位置情報が取得できない場合もサーバーのデータを表示
            if (initialData) {
                setWeather(initialData.weather);
                setTemperature(initialData.temperature);
                setLocation(initialData.location);
            } else {
                setLocation("お天気を取得できませんでした");
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchClientWeather, handleGeolocationError);
        } else {
            handleGeolocationError();
        }

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

                <div className="pt-8 text-center min-h-[150px] flex flex-col justify-center">
                    <div className="flex flex-col items-center gap-2">
                        {weather ? (
                            <>
                                <WeatherIcon type={weather} size={96} />
                                <div className="flex items-center justify-center gap-2 text-sm text-[#5D4037]/80 bg-white/30 backdrop-blur-sm rounded-md px-2 py-1">
                                    {isClient && <span>{new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}</span>}
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