// src/app/components/TenChanHomeClient.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import WeatherDisplay from './WeatherDisplay';
import CharacterDisplay from './CharacterDisplay';
import ConfirmationModal from './ConfirmationModal';

// --- ★ 型定義 ---
type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

// --- ★ localStorage キー ---
const PET_NAME_STORAGE_KEY = 'otenki-gurashi-petName';

// --- ★ ヘルパー関数 (コンポーネントの外に定義) ---
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
        default: return 'bg-sunny'; // null の場合も sunny (初期表示など)
    }
};

const mapWeatherType = (weatherData: any): WeatherType => {
    // weatherData や weatherData.weather が存在しない場合のガードを追加
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
        return "sunny"; // 不明な場合は sunny を返す
    }

    const main = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind?.speed; // wind が存在しない可能性も考慮
    const hour = new Date().getHours();
    const isNight = hour < 5 || hour >= 19;

    if (isNight) return "night";
    if (windSpeed !== undefined && windSpeed >= 10) return "windy"; // windSpeed の存在確認
    if (main.includes("thunderstorm")) return "thunderstorm";
    if (main.includes("rain")) return "rainy";
    if (main.includes("snow")) return "snowy";
    if (main.includes("clear")) return "clear";
    if (main.includes("clouds")) return "cloudy"; // clouds は cloudy に変更
    return "sunny";
};

const getTimeOfDay = (date: Date): TimeOfDay => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 19) return "evening";
    return "night";
};
// --- ★ ヘルパー関数の定義ここまで ---


// --- ★ メインコンポーネント ---
export default function TenChanHomeClient({ initialData }) { // initialData は null 想定
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weather, setWeather] = useState<WeatherType | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(null);
    const [petName, setPetName] = useState<string>("てんちゃん");
    const [location, setLocation] = useState<string | null>("場所を取得中...");
    const [isClient, setIsClient] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // getTimeOfDay は外で定義したので、ここでは呼び出すだけ
    const timeOfDay = getTimeOfDay(currentTime);

    const handleCharacterClick = () => {
        if (messageTimeoutRef.current) { clearTimeout(messageTimeoutRef.current); }
        const isNight = timeOfDay === 'night';
        let messageOptions = conversationMessages.default;
        // weather が null でないことを確認
        if (isNight) { messageOptions = conversationMessages.night; }
        else if (weather && conversationMessages[weather]) { messageOptions = conversationMessages[weather]; }
        const randomMessage = messageOptions[Math.floor(Math.random() * messageOptions.length)];
        setMessage(randomMessage);
        messageTimeoutRef.current = setTimeout(() => { setMessage(null); }, 2000);
    };

    const cycleWeather = () => { // デバッグ用
        setWeather(prev => {
            const weathers: WeatherType[] = ["sunny", "clear", "cloudy", "rainy", "thunderstorm", "snowy", "windy", "night"];
            // prev が null の場合の考慮を追加
            const currentIndex = prev ? weathers.indexOf(prev) : -1;
            return weathers[(currentIndex + 1) % weathers.length];
        });
    };

    useEffect(() => {
        setIsClient(true);
        setError(null);
        setIsLoading(true);

        const storedName = localStorage.getItem(PET_NAME_STORAGE_KEY);
        if (storedName) {
            setPetName(storedName);
        }

        const fetchWeatherDataByLocation = (latitude: number, longitude: number) => {
            setError(null); // API呼び出し前にエラーをクリア
            fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                            throw new Error(errData.message || `HTTP error! status: ${res.status}`);
                        }).catch(() => { // JSON パース失敗時のフォールバック
                            throw new Error(`HTTP error! status: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    // APIレスポンスの構造をより安全にチェック
                    if (!data?.list?.[0]?.weather?.[0]?.main || typeof data.list[0].main?.temp !== 'number') {
                        throw new Error('天気データの形式が正しくありません。');
                    }
                    const currentWeather = data.list[0];
                    setLocation(data.city?.name || "不明な場所"); // Optional chaining
                    setTemperature(Math.round(currentWeather.main.temp));
                    setWeather(mapWeatherType(currentWeather));
                })
                .catch(err => {
                    console.error("Failed to fetch weather on client:", err);
                    setError(err.message || "お天気情報の取得に失敗しました。");
                    setLocation("取得失敗");
                    setWeather(null);
                    setTemperature(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherDataByLocation(position.coords.latitude, position.coords.longitude);
                },
                (geoError) => {
                    console.error("Geolocation Error:", geoError);
                    let errorMessage = "あれれ、いまどこにいるか分かんなくなっちゃった…";
                    if (geoError.code === geoError.PERMISSION_DENIED) {
                        errorMessage = "いまどこにいるか、教えてほしいな！\n（ブラウザの設定を確認してみてね）";
                    } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
                        errorMessage = "うーん、いまいる場所がうまく掴めないみたい…";
                    } else if (geoError.code === geoError.TIMEOUT) {
                        errorMessage = "場所を探すのに時間がかかっちゃった…\nもう一回試してみて！";
                    }
                    setError(errorMessage);
                    setLocation("？？？");
                    setWeather(null);
                    setTemperature(null);
                    setIsLoading(false);
                },
                { timeout: 10000 }
            );
        } else {
            setError("ごめんね、このアプリだと\nいまどこにいるかの機能が使えないみたい…");
            setLocation("？？？");
            setWeather(null);
            setTemperature(null);
            setIsLoading(false);
        }

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        return () => {
            clearInterval(timer);
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        };
    }, []); // 空の依存配列

    const handleConfirmWalk = () => {
        setIsModalOpen(false);
        const walkWeather = weather || 'sunny';
        router.push(`/walk?weather=${walkWeather}`);
    };

    const displayWeatherType = weather;
    // getBackgroundGradientClass は外で定義したので、ここでは呼び出すだけ
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
                        weather={isLoading || error ? null : displayWeatherType}
                        timeOfDay={timeOfDay}
                        isClient={isClient}
                        currentTime={currentTime}
                        temperature={temperature}
                        location={isLoading ? "取得中..." : (error ? "？？？" : location)}
                        onCycleWeather={cycleWeather}
                    />
                    {error && (
                        <p className="text-center text-sm text-red-600 bg-red-100 p-2 mx-4 rounded -mt-4 mb-2 shadow-sm whitespace-pre-line">
                            {error}
                        </p>
                    )}
                    <CharacterDisplay
                        petName={petName}
                        mood={isLoading ? "neutral" : error ? "sad" : "happy"}
                        message={message}
                        onCharacterClick={handleCharacterClick}
                    />
                    <Footer onWalkClick={() => setIsModalOpen(true)} />
                </div>
            </main>
        </div>
    );
}