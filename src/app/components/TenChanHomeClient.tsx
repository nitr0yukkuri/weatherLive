// src/app/components/TenChanHomeClient.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';
import WeatherDisplay from './WeatherDisplay';
import CharacterDisplay from './CharacterDisplay';
import ConfirmationModal from './ConfirmationModal';
// ★ 1. ItemGetModal をインポート
import ItemGetModal from './ItemGetModal';

// --- ★ 型定義 ---
type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

// --- ▼▼▼ 変更点1: キー定義を修正 ▼▼▼ ---
const PET_NAME_STORAGE_KEY = 'otenki-gurashi-petName';
const PET_COLOR_STORAGE_KEY = 'otenki-gurashi-petColor'; // ★ 色のキー
const CURRENT_WEATHER_KEY = 'currentWeather';
const PET_SETTINGS_CHANGED_EVENT = 'petSettingsChanged'; // ★ 設定変更イベント
// --- ▲▲▲ 変更点1ここまで ▲▲▲ ---

// --- ★ ヘルパー関数 (変更なし) ---
// ★★★ ここを修正: 各パターンのセリフをてんちゃん風に修正・増量 ★★★
const conversationMessages = {
    sunny: ["おひさまが気持ちいいね！", "こんな日はおさんぽしたくなるな〜", "あったかいね〜！", "ぽかぽかするね", "おせんたくびよりだ！", "まぶしいな〜！"],
    clear: ["雲ひとつないね！", "空がとっても青いよ！", "どこまでも見えそう！", "すがすがしい気分！", "飛行機雲が見えるかも？", "深呼吸したくなるね〜"],
    cloudy: ["今日は過ごしやすいね！", "雲の形をずっと見ていられるなあ…", "おひさまはどこかな？", "雨、降らないといいな〜", "雲がゆっくり動いてるよ", "日焼けの心配がなくていいね！"],
    rainy: ["雨の音が聞こえるね", "傘は持った？", "あめ、あめ、ふれ、ふれ♪", "かたつむりさん、いるかな？", "しっとりするね", "雨宿りしよっか！"],
    thunderstorm: ["ゴロゴロって音がする…！", "ちょっとだけこわいかも…", "おへそ隠さなきゃ！", "ひゃっ！光った！", "はやくおさまるといいね", "嵐が来てるみたい…！"],
    snowy: ["わー！雪だ！", "雪だるま、作れるかな？", "ふわふわしてるね", "まっしろだね！", "さむいけど、きれい！", "こんこんっ"],
    windy: ["風がびゅーびゅー言ってる！", "帽子が飛ばされそうだ〜", "わわっ！とばされちゃう〜！", "色んなものが飛んでる！", "髪がぐちゃぐちゃだよ〜！", "風ぐるまがよく回りそう！"],
    night: ["今日もおつかれさま", "星が見えるかな？", "そろそろ眠いかも…", "いい夢みてね", "静かだね…", "おやすみなさい…"],
    default: ["こんにちは！", "なになに？", "えへへっ", "今日も元気だよ！", "何か用かな？", "わーい！", "やっほー！", "（なでなでして！）", "今日はどんな日？", "るんるん♪"]
};
// ★★★ 修正ここまで ★★★

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
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
        return "sunny";
    }
    const main = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind?.speed;
    const hour = new Date().getHours();
    const isNight = hour < 5 || hour >= 19;

    if (windSpeed !== undefined && windSpeed >= 10) return "windy";
    if (main.includes("thunderstorm")) return "thunderstorm";
    if (main.includes("rain")) return "rainy";
    if (main.includes("snow")) return "snowy";
    if (main.includes("clouds")) return "cloudy";
    if (main.includes("clear")) {
        return isNight ? "night" : "clear";
    }
    return isNight ? "night" : "sunny";
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
export default function TenChanHomeClient({ initialData }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weather, setWeather] = useState<WeatherType | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [temperature, setTemperature] = useState<number | null>(null);
    // --- ▼▼▼ 変更点2: 色の State を追加 ▼▼▼ ---
    const [petName, setPetName] = useState<string>("てんちゃん");
    const [petColor, setPetColor] = useState<string>("white"); // ★ 色の State
    // --- ▲▲▲ 変更点2ここまで ▲▲▲ ---
    const [location, setLocation] = useState<string | null>("場所を取得中...");
    const [isClient, setIsClient] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ★ 2. アイテム取得モーダルのための State を追加
    const [isItemGetModalOpen, setIsItemGetModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<{ name: string; iconName: string | null; rarity: string | null } | null>(null);


    const timeOfDay = getTimeOfDay(currentTime);

    const setWeatherAndNotify = (newWeather: WeatherType | null) => {
        const weatherValue = newWeather || 'sunny';
        setWeather(weatherValue);
        localStorage.setItem(CURRENT_WEATHER_KEY, weatherValue);
        window.dispatchEvent(new CustomEvent('weatherChanged'));
    };

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

    // デバッグ（おさんぽ）用
    const cycleWeather = () => {
        console.log("Cycling weather"); // 既存のログ
        setWeather(prev => {
            // ★★★ 修正: "clear" と "night" を追加 ★★★
            const weathers: WeatherType[] = ["sunny", "clear", "cloudy", "rainy", "thunderstorm", "snowy", "windy", "night"];
            const currentIndex = prev ? weathers.indexOf(prev) : -1;
            const nextWeather = weathers[(currentIndex + 1) % weathers.length];

            console.log("Current weather:", prev, "Next weather:", nextWeather); // ログ追加

            // 状態を更新し、localStorageにも保存
            setWeatherAndNotify(nextWeather);
            return nextWeather;
        });
    };


    // --- ▼▼▼ 変更点3: 設定読み込み関数とイベントリスナーを追加 ▼▼▼ ---
    useEffect(() => {
        setIsClient(true);
        setError(null);
        setIsLoading(true);

        // ★ 名前と色を読み込む関数
        const updatePetSettings = () => {
            const storedName = localStorage.getItem(PET_NAME_STORAGE_KEY);
            if (storedName) {
                setPetName(storedName);
            }
            const storedColor = localStorage.getItem(PET_COLOR_STORAGE_KEY);
            if (storedColor) {
                setPetColor(storedColor);
            }
        };

        // ★ 1. マウント時に設定を読み込む
        updatePetSettings();

        // ★ 2. 設定変更イベントを監視 (設定ページでの変更を即時反映)
        const handleSettingsChanged = () => {
            updatePetSettings();
        };
        window.addEventListener(PET_SETTINGS_CHANGED_EVENT, handleSettingsChanged);
        // ★ 3. 他のタブでの変更も監視
        window.addEventListener('storage', handleSettingsChanged);

        // --- (↓既存の天気取得ロジック↓) ---
        const fetchWeatherDataByLocation = (latitude: number, longitude: number) => {
            setError(null);
            fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(errData => {
                            throw new Error(errData.message || `HTTP error! status: ${res.status}`);
                        }).catch(() => {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data?.list?.[0]?.weather?.[0]?.main || typeof data.list[0].main?.temp !== 'number') {
                        throw new Error('天気データの形式が正しくありません。');
                    }
                    const currentWeather = data.list[0];
                    const newWeather = mapWeatherType(currentWeather);
                    setLocation(data.city?.name || "不明な場所");
                    setTemperature(Math.round(currentWeather.main.temp));
                    setWeatherAndNotify(newWeather);
                })
                .catch(err => {
                    console.error("Failed to fetch weather on client:", err);
                    setError(err.message || "お天気情報の取得に失敗しました。");
                    setLocation("取得失敗");
                    setTemperature(null);
                    setWeatherAndNotify(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        // ★★★ ここから修正 (initialData の扱い) ★★★
        // initialData があっても、weather が null ならクライアントで取得
        if (initialData && initialData.weather) {
            setLocation(initialData.location);
            setTemperature(initialData.temperature);
            setWeatherAndNotify(initialData.weather);
            setIsLoading(false);
        } else {
            // initialData が null、または weather が null の場合
            // (page.tsx で weather: null を渡すようにしたため、こちらが実行される)
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
                        setTemperature(null);
                        setWeatherAndNotify(null);
                        setIsLoading(false);
                    },
                    { timeout: 10000 }
                );
            } else {
                setError("ごめんね、このアプリだと\nいまどこにいるかの機能が使えないみたい…");
                setLocation("？？？");
                setTemperature(null);
                setWeatherAndNotify(null);
                setIsLoading(false);
            }
        }
        // ★★★ 修正ここまで ★★★

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        // --- (↑既存の天気取得ロジック↑) ---

        return () => {
            clearInterval(timer);
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
            // ★ イベントリスナーを解除
            window.removeEventListener(PET_SETTINGS_CHANGED_EVENT, handleSettingsChanged);
            window.removeEventListener('storage', handleSettingsChanged);
        };
    }, [initialData]); // ★ 依存配列に initialData を追加
    // --- ▲▲▲ 変更点3ここまで ▲▲▲ ---

    // ★ 3. おさんぽ完了時の処理
    const handleConfirmWalk = async () => {
        setIsModalOpen(false);
        const walkWeather = weather || 'sunny';

        // 開発用の /walk ページへの遷移を維持
        if (process.env.NODE_ENV === 'development' || (isClient && window.location.search.includes('debug'))) {
            router.push(`/walk?weather=${walkWeather}`);
            return;
        }

        // --- 本番用: APIを叩いてアイテムゲット ---
        try {
            const response = await fetch('/api/walk/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weather: walkWeather }),
            });

            if (!response.ok) {
                throw new Error('おさんぽに失敗しました');
            }

            const data = await response.json();

            // アイテム取得モーダルを表示
            if (data.item) {
                setNewItem({
                    name: data.item.name,
                    iconName: data.item.iconName,
                    rarity: data.item.rarity,
                });
                setIsItemGetModalOpen(true);
            } else {
                // アイテムがなかった場合 (デバッグ用アラートなど)
                alert("アイテムは見つからなかったみたい…");
            }

        } catch (err) {
            console.error(err);
            // エラー時も /walk にフォールバック (必要に応じて)
            // router.push(`/walk?weather=${walkWeather}`);
            alert("エラーが発生しました: " + (err as Error).message);
        }
    };


    const displayWeatherType = weather || 'sunny';
    const dynamicBackgroundClass = getBackgroundGradientClass(displayWeatherType);

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* ★ 4. アイテム取得モーダルをレンダリング */}
            <ItemGetModal
                isOpen={isItemGetModalOpen}
                onClose={() => setIsItemGetModalOpen(false)}
                itemName={newItem?.name || null}
                iconName={newItem?.iconName || null}
                rarity={newItem?.rarity || null}
            />

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmWalk}>
                <p className="text-center text-xl font-bold leading-relaxed text-gray-800">
                    おさんぽにでかけますか？
                </p>
            </ConfirmationModal>

            <main
                className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-[#5D4037] ${dynamicBackgroundClass} transition-all duration-500`}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl"></div>

                {/* ★ 5. onCycleWeather を WeatherDisplay に渡す */}
                <WeatherDisplay
                    weather={isLoading || error ? null : displayWeatherType}
                    timeOfDay={timeOfDay}
                    isClient={isClient}
                    currentTime={currentTime}
                    temperature={temperature}
                    location={isLoading ? "取得中..." : (error ? "？？？" : location)}
                    onCycleWeather={cycleWeather} // ★ これ
                />

                {error && (
                    <p className="text-center text-sm text-red-600 bg-red-100 p-2 mx-4 rounded -mt-4 mb-2 shadow-sm whitespace-pre-line">
                        {error}
                    </p>
                )}

                {isLoading ? (
                    <div className="flex-grow flex flex-col items-center justify-center gap-y-4 p-3 text-center pb-20">
                        <div className="w-40 h-40 flex items-center justify-center">
                        </div>
                        <div>
                            <h1 className="text-xl font-medium text-slate-500 animate-pulse">てんちゃん じゅんびちゅう...</h1>
                        </div>
                    </div>
                ) : (
                    // --- ▼▼▼ 変更点4: petColor を渡す ▼▼▼ ---
                    <CharacterDisplay
                        petName={petName}
                        petColor={petColor}
                        mood={error ? "sad" : "happy"}
                        message={message}
                        onCharacterClick={handleCharacterClick}
                    />
                    // --- ▲▲▲ 変更点4ここまで ▲▲▲ ---
                )}

                <Footer onWalkClick={() => setIsModalOpen(true)} />
            </main>
        </div>
    );
}