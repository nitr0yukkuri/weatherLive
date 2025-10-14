'use client';

import { useEffect, useState } from 'react';
import Footer from './Footer';
import WeatherDisplay from './WeatherDisplay';
import CharacterDisplay from './CharacterDisplay';

type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface PetState {
    name: string;
    level: number;
    happiness: number;
    hunger: number;
    lastFed: number;
}

const conversationMessages = [
    "こんにちは！", "いい天気だね！", "お腹すいたな...", "なになに？",
    "えへへっ", "今日も一日がんばろうね！", "タップしてくれてありがとう！"
];

export default function TenChanHomeClient({ initialData }) {
    const [weather, setWeather] = useState<WeatherType | null>(initialData?.weather || null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(initialData?.temperature || null);
    const [petState, setPetState] = useState<PetState>({
        name: "てんちゃん", level: 1, happiness: 80, hunger: 60, lastFed: Date.now(),
    });
    const [location, setLocation] = useState<string | null>(initialData?.location || null);
    const [isClient, setIsClient] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleCharacterClick = () => {
        const randomMessage = conversationMessages[Math.floor(Math.random() * conversationMessages.length)];
        setMessage(randomMessage);
        setTimeout(() => { setMessage(null); }, 3000);
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

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-[#5D4037] bg-main-bg bg-cover bg-center`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

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

                <Footer />
            </main>
        </div>
    );
}