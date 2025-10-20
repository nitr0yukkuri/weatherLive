'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import WeatherDisplay from './WeatherDisplay';
import CharacterDisplay from './CharacterDisplay';
import ConfirmationModal from './ConfirmationModal';

type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface PetState {
    name: string;
}

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

// ★★★ ここを修正しました ★★★
// 夜の時の優先判定を削除し、常に天気に基づいて背景を決定するようにします
const getBackgroundGradientClass = (weather: WeatherType | null): string => {
    switch (weather) {
        case 'clear': return 'bg-clear';
        case 'cloudy': return 'bg-cloudy';
        case 'rainy': return 'bg-rainy';
        case 'thunderstorm': return 'bg-thunderstorm';
        case 'snowy': return 'bg-snowy';
        case 'windy': return 'bg-windy';
        case 'night': return 'bg-night'; // 'night' という天候タイプを追加
        case 'sunny':
        default: return 'bg-sunny';
    }
};

const mapWeatherType = (weatherData: any): WeatherType => {
    const main = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind.speed;

    if (windSpeed >= 10) return "windy";
    if (main.includes("thunderstorm")) return "thunderstorm";
    if (main.includes("rain")) return "rainy";
    if (main.includes("snow")) return "snowy";
    if (main.includes("clear")) return "clear";
    if (main.includes("clouds")) return "sunny";
    return "sunny";
};

export default function TenChanHomeClient({ initialData }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weather, setWeather] = useState<WeatherType | null>(initialData?.weather || 'sunny');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(initialData?.temperature || null);
    const [petState] = useState<PetState>({ name: "てんちゃん" });
    const [location, setLocation] = useState<string | null>(initialData?.location || null);
    const [isClient, setIsClient] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getTimeOfDay = (date: Date): TimeOfDay => {
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 19) return "evening";
        return "night";
    };
    const timeOfDay = getTimeOfDay(currentTime);

    const handleCharacterClick = () => {
        if (messageTimeoutRef.current) { clearTimeout(messageTimeoutRef.current); }
        const isNight = timeOfDay === 'night';
        let messageOptions = conversationMessages.default;
        if (isNight) { messageOptions = conversationMessages.night; }
        else if (weather && conversationMessages[weather]) { messageOptions = conversationMessages[weather]; }
        const randomMessage = messageOptions[Math.floor(Math.random() * messageOptions.length)];
        setMessage(randomMessage);
        messageTimeoutRef.current = setTimeout(() => { setMessage(null); }, 2000);
    };

    // ★★★ ここを修正しました ★★★
    // 'night' もデバッグのサイクルに含めます
    const cycleWeather = () => {
        setWeather(prev => {
            const weathers: WeatherType[] = ["sunny", "clear", "cloudy", "rainy", "thunderstorm", "snowy", "windy", "night"];
            const currentIndex = weathers.indexOf(prev!);
            return weathers[(currentIndex + 1) % weathers.length];
        });
    };

    useEffect(() => {
        setIsClient(true);
        if (initialData) return;

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
        // おさんぽの時は、実際の時間（夜かどうか）を最優先する
        const walkWeather = timeOfDay === 'night' ? 'night' : weather;
        router.push(`/walk?weather=${walkWeather}`);
    };

    // ★★★ ここを修正しました ★★★
    // 表示する天気を決定。夜 + (晴れ or 快晴) の場合は 'night' をアイコン表示用に使う
    const displayWeatherType = (timeOfDay === 'night' && (weather === 'sunny' || weather === 'clear'))
        ? 'night'
        : weather;

    const dynamicBackgroundClass = getBackgroundGradientClass(displayWeatherType);


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
                        weather={displayWeatherType} // 表示用の天気を渡す
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