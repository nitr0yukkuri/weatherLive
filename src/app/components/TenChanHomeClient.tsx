'use client';

// framer-motionのインポートを削除
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import WeatherDisplay from './WeatherDisplay';
import CharacterDisplay from './CharacterDisplay';
import ConfirmationModal from './ConfirmationModal';

type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface PetState {
    name: string;
    level: number;
    happiness: number;
    hunger: number;
    lastFed: number;
}

const conversationMessages = {
    sunny: ["おひさまが気持ちいいね！", "こんな日はおさんぽしたくなるな〜", "ぽかぽかするね！"],
    cloudy: ["今日は過ごしやすいね！", "くもり空も、落ち着いてて好きだよ。", "雲の形をずっと見ていられるなあ…"],
    rainy: ["雨の音が聞こえるね", "傘は持った？", "雨の日も、なんだか特別な感じがする！"],
    snowy: ["わー！雪だ！", "雪だるま、作れるかな？", "外は寒いから、暖かくしててね！"],
    night: ["今日もおつかれさま", "星が見えるかな？", "そろそろ眠くなってきたかも..."],
    default: ["こんにちは！", "なになに？", "えへへっ", "タップしてくれてありがとう！"]
};

const getBackgroundGradientClass = (weather: WeatherType | null, timeOfDay: TimeOfDay): string => {
    if (timeOfDay === 'night') {
        return 'bg-night';
    }
    switch (weather) {
        case 'cloudy':
            return 'bg-cloudy';
        case 'rainy':
            return 'bg-rainy';
        case 'snowy':
            return 'bg-snowy';
        case 'sunny':
        default:
            return 'bg-sunny';
    }
};

export default function TenChanHomeClient({ initialData }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weather, setWeather] = useState<WeatherType | null>(initialData?.weather || null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(initialData?.temperature || null);
    const [petState, setPetState] = useState<PetState>({ name: "てんちゃん", level: 1, happiness: 80, hunger: 60, lastFed: Date.now() });
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
            if (prev === "sunny") return "cloudy";
            if (prev === "cloudy") return "rainy";
            if (prev === "rainy") return "snowy";
            if (prev === "snowy") return "sunny";
            return "sunny";
        });
    };

    useEffect(() => {
        setIsClient(true);
        const fetchWeatherData = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const response = await fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
                            if (!response.ok) throw new Error('Failed to fetch weather');

                            const data = await response.json();
                            const currentWeather = data.list[0];
                            setLocation(data.city.name || "不明な場所");
                            setTemperature(Math.round(currentWeather.main.temp));

                            const weatherCode = currentWeather.weather[0].main.toLowerCase();
                            if (weatherCode.includes("rain")) setWeather("rainy");
                            else if (weatherCode.includes("snow")) setWeather("snowy");
                            else if (weatherCode.includes("clouds")) setWeather("cloudy");
                            else setWeather("sunny");
                        } catch (error) {
                            console.error("Failed to fetch weather on client:", error);
                        }
                    },
                    () => { console.error("Geolocation was denied."); }
                );
            }
        };

        fetchWeatherData();

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
            if (messageTimeoutRef.current) { clearTimeout(messageTimeoutRef.current); }
        };
    }, []);

    const getPetMood = (): "happy" | "neutral" | "sad" => {
        if (petState.happiness > 70) return "happy";
        if (petState.happiness > 40) return "neutral";
        return "sad";
    };

    const handleConfirmWalk = () => {
        setIsModalOpen(false);
        router.push('/walk');
    };

    const dynamicBackgroundClass = getBackgroundGradientClass(weather, timeOfDay);

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* ★★★ mainタグに直接背景クラスを適用 ★★★ */}
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-[#5D4037] ${dynamicBackgroundClass}`}>
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmWalk}
                >
                    <p className="text-center text-xl font-bold leading-relaxed text-gray-800">
                        おさんぽは1日<br />3回しかできません<br />大丈夫ですか？
                    </p>
                </ConfirmationModal>

                {/* ★★★ 背景用のdivは完全に削除 ★★★ */}

                <div className="relative z-10 flex flex-col flex-grow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl"></div>
                    <WeatherDisplay
                        weather={weather}
                        timeOfDay={timeOfDay}
                        isClient={isClient}
                        currentTime={currentTime}
                        temperature={temperature}
                        location={location}
                        onCycleWeather={cycleWeather}
                    />
                    <CharacterDisplay
                        petName={petState.name}
                        mood={getPetMood()}
                        message={message}
                        onCharacterClick={handleCharacterClick}
                    />
                    <Footer onWalkClick={() => setIsModalOpen(true)} />
                </div>
            </main>
        </div>
    );
}