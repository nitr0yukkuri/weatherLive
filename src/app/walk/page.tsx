// nitr0yukkuri/weatherlive/weatherLive-b3045c8544f8e00c4dffca0c24f4db06f823d485/src/app/walk/page.tsx

'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CharacterFace from '../components/CharacterFace';
import WeatherIcon from '../components/WeatherIcon';
import Link from 'next/link';
import Footer from '../components/Footer';
import ItemGetModal from '../components/ItemGetModal';

type ObtainedItem = {
    id: number | null; // ★★★ id を追加 ★★★
    name: string | null;
    iconName: string | null;
};

// (mapWeatherType, getBackgroundColorClass, getWalkMessage は省略)

function WalkPageComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [weather, setWeather] = useState<string | null>(null);
    const [location, setLocation] = useState('...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [obtainedItem, setObtainedItem] = useState<ObtainedItem>({ id: null, name: null, iconName: null });
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    const dynamicBackgroundClass = useMemo(() => getBackgroundColorClass(weather || undefined), [weather]);

    useEffect(() => {
        const debugWeather = searchParams.get('weather');

        const obtainItem = (currentWeather: string) => {
            setTimeout(async () => {
                try {
                    // 1. アイテムを抽選
                    const itemResponse = await fetch('/api/items/obtain', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ weather: currentWeather }),
                    });
                    const item = await itemResponse.json();
                    if (!itemResponse.ok) throw new Error('アイテム獲得失敗');

                    setObtainedItem({ id: item.id, name: item.name, iconName: item.iconName });
                    setIsItemModalOpen(true);

                    // 2. コレクションに記録
                    await fetch('/api/collection', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ itemId: item.id }),
                    });

                    // ★★★ 修正点: おさんぽ回数を記録するAPIを呼び出し追加 ★★★
                    await fetch('/api/walk/complete', { method: 'POST' });

                } catch (err) {
                    setObtainedItem({ id: null, name: 'ふしぎな石', iconName: 'IoHelpCircle' });
                    setIsItemModalOpen(true);

                    // ★★★ 修正点: エラー時もおさんぽ回数だけは記録を試みる ★★★
                    try {
                        await fetch('/api/walk/complete', { method: 'POST' });
                    } catch (e) {
                        console.error('おさんぽ回数の記録に失敗', e);
                    }

                }
            }, 3000);
        };
        // (省略) 以降のuseEffectの内容は変更なし
        if (debugWeather) {
            setWeather(debugWeather);
            setLocation("デバッグ中");
            setLoading(false);
            obtainItem(debugWeather);
            return;
        }

        const fetchCurrentWeather = (lat: number, lon: number) => {
            fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.list) throw new Error(data.message || '天気情報取得失敗');
                    setLocation(data.city.name || "不明な場所");
                    const current = data.list[0];
                    const hour = new Date().getHours();
                    const isNight = hour < 5 || hour >= 19;
                    const realWeather = isNight ? 'night' : mapWeatherType(current);
                    setWeather(realWeather);
                    obtainItem(realWeather);
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        };

        navigator.geolocation?.getCurrentPosition(
            (pos) => fetchCurrentWeather(pos.coords.latitude, pos.coords.longitude),
            () => {
                setError("位置情報の取得を許可してください。");
                setLoading(false);
            }
        );
    }, [searchParams]);

    const handleModalClose = () => {
        setIsItemModalOpen(false);
        router.push('/');
    };

    // (省略) return文は変更なし
    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <ItemGetModal isOpen={isItemModalOpen} onClose={handleModalClose} itemName={obtainedItem.name} iconName={obtainedItem.iconName} />
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 transition-colors duration-500 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>
                <div className="flex-grow flex flex-col p-6 items-center justify-between">
                    <div className="w-full">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← ホーム</Link>
                        <header className="mb-8 text-center">
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-wider">おさんぽ中...</h1>
                            <p className="text-slate-500 mt-1">{location}</p>
                        </header>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow p-4">
                        {loading ? <p className="animate-pulse">準備中...</p> : error ? <p className="text-red-600">{error}</p> : (
                            <>
                                <div className="mb-4"><WeatherIcon type={weather || 'sunny'} size={60} /></div>
                                <div className="w-40 h-40 rounded-full bg-white p-2 mb-4">
                                    <CharacterFace mood={'happy'} />
                                </div>
                                <div className="p-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-md max-w-xs text-center">
                                    <p className="text-slate-700 font-medium">{getWalkMessage(weather || undefined)}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}

const mapWeatherType = (weatherData: any): string => {
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

const getBackgroundColorClass = (weatherType?: string): string => {
    switch (weatherType) {
        case 'clear': return 'bg-clear';
        case 'sunny': return 'bg-sunny';
        case 'rainy': return 'bg-rainy';
        case 'cloudy': return 'bg-cloudy';
        case 'snowy': return 'bg-snowy';
        case 'thunderstorm': return 'bg-thunderstorm';
        case 'windy': return 'bg-windy';
        case 'night': return 'bg-night';
        default: return 'bg-sky-200';
    }
};

const getWalkMessage = (weatherType?: string): string => {
    switch (weatherType) {
        case 'sunny': return '太陽が気持ちいいね！';
        case 'clear': return '雲ひとつない快晴だ！';
        case 'rainy': return '雨だけど、特別な出会いがあるかも！';
        case 'cloudy': return 'くもりの日は、のんびりおさんぽにぴったり。';
        case 'snowy': return '雪だ！足跡をつけて歩こう！';
        case 'thunderstorm': return 'すごい音！急いで帰ろう！';
        case 'windy': return '風が強いね！飛ばされないように気をつけて！';
        case 'night': return '夜のおさんぽは静かでいいね。';
        default: return '今日も良いおさんぽ日和！';
    }
}

export default function WalkPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WalkPageComponent />
        </Suspense>
    );
}