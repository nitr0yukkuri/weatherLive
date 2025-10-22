// src/app/components/TenChanHomeClient.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import WeatherDisplay from './WeatherDisplay';
import CharacterDisplay from './CharacterDisplay';
import ConfirmationModal from './ConfirmationModal';

type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

// PetState 型定義は useState で直接管理するため不要

// localStorage のキー (設定ページと合わせる)
const PET_NAME_STORAGE_KEY = 'otenki-gurashi-petName';

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

const getBackgroundGradientClass = (weather: WeatherType | null): string => {
    switch (weather) {
        case 'clear': return 'bg-clear';
        case 'cloudy': return 'bg-cloudy';
        case 'rainy': return 'bg-rainy';
        case 'thunderstorm': return 'bg-thunderstorm';
        case 'snowy': return 'bg-snowy';
        case 'windy': return 'bg-windy';
        case 'night': return 'bg-night';
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
    // 曇り ("clouds") を sunny にマッピングしている点に注意
    if (main.includes("clouds")) return "sunny";
    return "sunny";
};

export default function TenChanHomeClient({ initialData }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weather, setWeather] = useState<WeatherType | null>(initialData?.weather || 'sunny');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(initialData?.temperature || null);
    // --- 変更: useState でペット名を管理 ---
    const [petName, setPetName] = useState<string>("てんちゃん"); // 初期値
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

    // --- キャラクタークリック時のメッセージ表示機能 (変更なし) ---
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

    const cycleWeather = () => {
        setWeather(prev => {
            const weathers: WeatherType[] = ["sunny", "clear", "cloudy", "rainy", "thunderstorm", "snowy", "windy", "night"];
            const currentIndex = weathers.indexOf(prev!);
            return weathers[(currentIndex + 1) % weathers.length];
        });
    };

    useEffect(() => {
        setIsClient(true);

        // --- 追加: localStorage からペット名を読み込む ---
        const storedName = localStorage.getItem(PET_NAME_STORAGE_KEY);
        if (storedName) {
            setPetName(storedName);
        }
        // --- ここまで追加 ---

        // initialData がある場合は API 呼び出しをスキップ
        if (initialData) {
            // initialData があっても localStorage から名前を読む必要があるので return しない
            // return;
        } else {
            // initialData がない場合のみ天気情報をフェッチ
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
        }

        // 時間更新用のタイマー
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        // クリーンアップ関数
        return () => {
            clearInterval(timer);
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        };
        // initialData を依存配列に含めることで、サーバー/クライアントでの初期化を制御
    }, [initialData]);

    const handleConfirmWalk = () => {
        setIsModalOpen(false);
        const walkWeather = timeOfDay === 'night' ? 'night' : weather;
        router.push(`/walk?weather=${walkWeather}`);
    };

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
                        weather={displayWeatherType}
                        timeOfDay={timeOfDay}
                        isClient={isClient}
                        currentTime={currentTime}
                        temperature={temperature}
                        location={location}
                        onCycleWeather={cycleWeather}
                    />
                    {/* --- 変更: petName state を CharacterDisplay に渡す --- */}
                    <CharacterDisplay
                        petName={petName} // petState.name から petName に変更
                        mood={"happy"}
                        message={message} // メッセージ表示用の state
                        onCharacterClick={handleCharacterClick} // クリックハンドラー
                    />
                    <Footer onWalkClick={() => setIsModalOpen(true)} />
                </div>
            </main>
        </div>
    );
}