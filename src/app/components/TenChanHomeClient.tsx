'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import WeatherDisplay from './WeatherDisplay';
import CharacterDisplay from './CharacterDisplay';
import ConfirmationModal from './ConfirmationModal';

// ★★★ 型定義を更新 ★★★
type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface PetState {
    name: string;
}

// ★★★ セリフを追加 ★★★
const conversationMessages = {
    sunny: ["おひさまが気持ちいいね！", "こんな日はおさんぽしたくなるな〜"],
    clear: ["雲ひとつないね！", "空がとっても青いよ！"],
    cloudy: ["今日は過ごしやすいね！", "雲の形をずっと見ていられるなあ…"],
    rainy: ["雨の音が聞こえるね", "傘は持った？"],
    thunderstorm: ["ゴロゴロって音がする…！", "ちょっとだけこわいかも…"],
    snowy: ["わー！雪だ！", "雪だるま、作れるかな？"],
    windy: ["風がびゅーびゅー言ってる！", "帽子が飛ばされそうだ〜"],
    night: ["今日もおつかれさま", "星が見えるかな？"],
    default: ["こんにちは！", "なになに？", "えへへっ"]
};

// ★★★ 背景クラスを更新 ★★★
const getBackgroundGradientClass = (weather: WeatherType | null, timeOfDay: TimeOfDay): string => {
    if (timeOfDay === 'night') return 'bg-night';
    switch (weather) {
        case 'clear': return 'bg-clear';
        case 'cloudy': return 'bg-cloudy';
        case 'rainy': return 'bg-rainy';
        case 'thunderstorm': return 'bg-thunderstorm';
        case 'snowy': return 'bg-snowy';
        case 'windy': return 'bg-windy';
        case 'sunny':
        default: return 'bg-sunny';
    }
};

// ★★★ 天候判定ロジックを更新 ★★★
const mapWeatherType = (weatherData: any): WeatherType => {
    const main = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind.speed;

    if (windSpeed >= 10) return "windy";
    if (main.includes("thunderstorm")) return "thunderstorm";
    if (main.includes("rain")) return "rainy";
    if (main.includes("snow")) return "snowy";
    if (main.includes("clear")) return "clear";
    if (main.includes("clouds")) return "sunny"; // 晴れ間ありの曇りは 'sunny' とする
    return "sunny"; // デフォルト
};


export default function TenChanHomeClient({ initialData }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weather, setWeather] = useState<WeatherType | null>(initialData?.weather || null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(initialData?.temperature || null);
    const [petState] = useState<PetState>({ name: "てんちゃん" });
    const [location, setLocation] = useState<string | null>(initialData?.location || null);
    const [isClient, setIsClient] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCharacterClick = () => {
        if (messageTimeoutRef.current) { clearTimeout(messageTimeoutRef.current); }
        const currentHour = new Date().getHours();
        const isNight = currentHour < 5 || currentHour >= 19;
        let messageOptions = conversationMessages.default;
        if (isNight) { messageOptions = conversationMessages.night; }
        else if (weather && conversationMessages[weather]) { messageOptions = conversationMessages[weather]; }
        const randomMessage = messageOptions[Math.floor(Math.random() * messageOptions.length)];
        setMessage(randomMessage);
        messageTimeoutRef.current = setTimeout(() => { setMessage(null); }, 2000);
    };

    const getTimeOfDay = (date: Date): TimeOfDay => {
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 19) return "evening";
        return "night";
    };
    const timeOfDay = getTimeOfDay(currentTime);

    const cycleWeather = () => {
        setWeather(prev => {
            const weathers: WeatherType[] = ["sunny", "clear", "cloudy", "rainy", "thunderstorm", "snowy", "windy", "night"];
            const currentIndex = weathers.indexOf(prev!);
            return weathers[(currentIndex + 1) % weathers.length];
        });
    };

    useEffect(() => {
        setIsClient(true);
        if (initialData) return; // サーバーからの初期データがあればクライアントでの取得はスキップ

        const fetchWeatherData = () => {
            navigator.geolocation?.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
                        if (!response.ok) throw new Error('Failed to fetch weather');
                        const data = await response.json();
                        const currentWeather = data.list[0];
                        setLocation(data.city.name || "不明な場所");
                        setTemperature(Math.round(currentWeather.main.temp));
                        setWeather(mapWeatherType(currentWeather));
                    } catch (error) {
                        console.error("Failed to fetch weather on client:", error);
                    }
                },
                () => console.error("Geolocation was denied.")
            );
        };

        fetchWeatherData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => {
            clearInterval(timer);
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        };
    }, [initialData]);

    const handleConfirmWalk = () => {
        setIsModalOpen(false);
        const finalWeather = timeOfDay === 'night' ? 'night' : weather;
        router.push(`/walk?weather=${finalWeather || 'sunny'}`);
    };

    const dynamicBackgroundClass = getBackgroundGradientClass(weather, timeOfDay);
    const displayWeather = timeOfDay === 'night' ? 'night' : weather;

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main
                className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-[#5D4037] ${dynamicBackgroundClass} transition-all duration-500`}
            >
                <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmWalk}>
                    <p className="text-center text-xl font-bold leading-relaxed text-gray-800">
                        おさんぽにでかけますか？
                    </p>
                </ConfirmationModal>

                <div className="relative z-10 flex flex-col flex-grow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl"></div>
                    <WeatherDisplay
                        weather={displayWeather}
                        timeOfDay={timeOfDay}
                        isClient={isClient}
                        currentTime={currentTime}
                        temperature={temperature}
                        location={location}
                        onCycleWeather={cycleWeather}
                    />
                    <CharacterDisplay
                        petName={petState.name}
                        mood={"happy"}
                        message={message}
                        onCharacterClick={handleCharacterClick}
                    />
                    <Footer onWalkClick={() => setIsModalOpen(true)} />
                </div>
            </main>
        </div>
    );
}