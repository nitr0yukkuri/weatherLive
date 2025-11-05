// src/app/walk/page.tsx

'use client';

// useRef をインポートに追加
import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CharacterFace from '../components/CharacterFace';
import WeatherIcon from '../components/WeatherIcon';
import Link from 'next/link';
import Footer from '../components/Footer';
import ItemGetModal from '../components/ItemGetModal';

type ObtainedItem = {
    id: number | null;
    name: string | null;
    iconName: string | null;
    rarity: string | null; // ★ rarity を追加
};

// (mapWeatherType, getBackgroundColorClass, getWalkMessage は省略)

function WalkPageComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [weather, setWeather] = useState<string | null>(null);
    const [location, setLocation] = useState('...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [obtainedItem, setObtainedItem] = useState<ObtainedItem>({ id: null, name: null, iconName: null, rarity: null }); // ★ 初期値に rarity を追加
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // ★★★ 変更点1: 処理が開始されたかを記録する Ref を追加 ★★★
    const hasStartedProcessing = useRef(false);

    const dynamicBackgroundClass = useMemo(() => getBackgroundColorClass(weather || undefined), [weather]);

    useEffect(() => {
        // ★★★ 変更点2: 既に処理が開始されていたら、何もしない ★★★
        if (hasStartedProcessing.current || isProcessing) return;

        const debugWeather = searchParams.get('weather');

        const obtainItem = (currentWeather: string) => {
            // ★★★ 変更点3: 処理開始フラグを立てる (Ref も更新) ★★★
            if (hasStartedProcessing.current) return; // 二重実行防止
            hasStartedProcessing.current = true; // 処理開始を記録
            setIsProcessing(true); // 状態フラグも更新

            // --- ▼▼▼ ここを 3000 (3秒) に変更 ▼▼▼ ---
            setTimeout(async () => {
                try {
                    // 1. アイテムを抽選
                    const itemResponse = await fetch('/api/items/obtain', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ weather: currentWeather }),
                    });
                    // エラーレスポンスもJSONとして解析試行
                    const itemResult = await itemResponse.json();
                    if (!itemResponse.ok) {
                        // API側からのエラーメッセージがあればそれを使う
                        throw new Error(itemResult.message || 'アイテム獲得に失敗しました');
                    }
                    const item = itemResult; // 成功時はそのまま使う

                    setObtainedItem({ id: item.id, name: item.name, iconName: item.iconName, rarity: item.rarity }); // ★ rarity をセット
                    setIsItemModalOpen(true);

                    // 2. コレクションに記録
                    const collectionResponse = await fetch('/api/collection', { // ★ レスポンスを変数に追加
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ itemId: item.id }),
                    });
                    // ★ コレクション記録のエラーチェックを追加
                    if (!collectionResponse.ok) {
                        const collectionError = await collectionResponse.json();
                        console.error("コレクション記録失敗:", collectionError.message);
                        // 必要であればエラー処理を追加 (例: setError)
                    }

                    // 3. おさんぽ回数を記録
                    const walkCompleteResponse = await fetch('/api/walk/complete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ weather: currentWeather }), // ★ 天候情報を渡す
                    });
                    // ★ おさんぽ回数記録のエラーチェックを追加
                    if (!walkCompleteResponse.ok) {
                        const walkError = await walkCompleteResponse.json();
                        console.error("おさんぽ回数記録失敗:", walkError.message);
                        // 必要であればエラー処理を追加 (例: setError)
                    }

                } catch (err: any) { // any型でエラーを受け取る
                    console.error("アイテム取得または記録処理中にエラー:", err);
                    setError(err.message || 'アイテム処理中にエラーが発生しました'); // エラーメッセージを設定
                    // エラー時でもモーダルは表示する（例: ふしぎな石）
                    setObtainedItem({ id: null, name: 'ふしぎな石', iconName: 'IoHelpCircle', rarity: 'normal' }); // ★ rarity をセット (normalで代用)
                    setIsItemModalOpen(true);

                    // エラー時もおさんぽ回数だけ記録を試みる (フォールバック)
                    try {
                        await fetch('/api/walk/complete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ weather: currentWeather }), // ★ 天候情報を渡す
                        });
                    } catch (e) {
                        console.error('フォールバックのおさんぽ回数記録にも失敗', e);
                    }

                } finally {
                    setLoading(false);
                    // isProcessing フラグはここでリセットしても良いが、
                    // このページは一度きりの処理なので、必須ではない
                    // setIsProcessing(false);
                }
            }, 3000); // 3秒の待機時間
            // --- ▲▲▲ 変更ここまで ▲▲▲ ---
        };

        // 位置情報取得 & 天気取得 & アイテム取得開始のロジック
        if (debugWeather) {
            setWeather(debugWeather);
            setLocation("デバッグ中");
            setLoading(false); // ローディング完了
            obtainItem(debugWeather); // アイテム取得処理を開始
            return; // 位置情報取得はスキップ
        }

        const fetchCurrentWeather = (lat: number, lon: number) => {
            // ★★★ 変更点4: 天気取得前に Ref をチェック ★★★
            if (hasStartedProcessing.current) return;

            fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}`)
                .then(res => {
                    if (!res.ok) { // レスポンスがOKでない場合
                        return res.json().then(errData => { // エラー内容をJSONとして解析試行
                            throw new Error(errData.message || `HTTP error! status: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    // ★★★ 変更点5: 正常取得後も Ref をチェック ★★★
                    if (hasStartedProcessing.current) return;

                    if (!data.list) throw new Error(data.message || '天気情報が取得できませんでした');
                    setLocation(data.city.name || "不明な場所");
                    const current = data.list[0];
                    const realWeather = mapWeatherType(current); // ★ mapWeatherType を使用
                    setWeather(realWeather);
                    obtainItem(realWeather); // 天気取得後にアイテム取得処理を開始
                })
                .catch(err => {
                    // ★★★ 変更点6: エラー時も Ref をチェック ★★★
                    if (hasStartedProcessing.current) return;

                    console.error("天気情報の取得に失敗:", err);
                    setError(err.message || "天気情報の取得に失敗しました。");
                    setLocation("天気取得失敗");
                    setLoading(false);
                    // 天気取得失敗時はアイテム取得処理に進まない
                    hasStartedProcessing.current = true; // エラーでも処理開始済みとする
                    setIsProcessing(false); // 処理は中断
                });
        };

        if (navigator.geolocation) {
            // ★★★ 変更点7: 位置情報取得前にも Ref をチェック ★★★
            if (!hasStartedProcessing.current) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => fetchCurrentWeather(pos.coords.latitude, pos.coords.longitude),
                    (geoError) => {
                        // ★★★ 変更点8: エラー時も Ref をチェック ★★★
                        if (hasStartedProcessing.current) return;
                        console.error("位置情報の取得に失敗:", geoError);
                        setError("位置情報の取得を許可してください。");
                        setLocation("位置情報取得失敗");
                        setLoading(false);
                        // 位置情報取得失敗時もアイテム取得処理に進まない
                        hasStartedProcessing.current = true; // エラーでも処理開始済みとする
                        setIsProcessing(false); // 処理は中断
                    }
                );
            }
        } else {
            // ★★★ 変更点9: Geolocation非対応時も Ref をチェック ★★★
            if (!hasStartedProcessing.current) {
                setError("このブラウザでは位置情報機能が利用できません。");
                setLocation("位置情報取得不可");
                setLoading(false);
                hasStartedProcessing.current = true; // エラーでも処理開始済みとする
                setIsProcessing(false); // 処理は中断
            }
        }
        // ★★★ 変更点10: 依存配列から isProcessing を削除 (意図的に初回実行のみを狙う) ★★★
        // searchParams はURLクエリが変わった場合に再実行するため残す
    }, [searchParams]);

    const handleModalClose = () => {
        setIsItemModalOpen(false);
        router.push('/');
    };

    // (省略) return文は変更なし
    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <ItemGetModal isOpen={isItemModalOpen} onClose={handleModalClose} itemName={obtainedItem.name} iconName={obtainedItem.iconName} rarity={obtainedItem.rarity} />
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 transition-colors duration-500 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>
                <div className="flex-grow flex flex-col p-6 items-center justify-between">
                    <div className="w-full">
                        {/* エラーがない場合、またはローディング中でもホームへ戻れるように Link は常に表示 */}
                        {(!error || loading) && (
                            <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← ホーム</Link>
                        )}
                        <header className="mb-8 text-center">
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-wider">
                                {/* ローディング状態に応じて表示変更 */}
                                {loading ? 'おさんぽ準備中...' : error ? 'おさんぽ失敗...' : 'おさんぽ中...'}
                            </h1>
                            <p className="text-slate-500 mt-1">{location}</p>
                        </header>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow p-4">
                        {loading ? (
                            <div className="animate-pulse text-center">
                                <div className="w-40 h-40 rounded-full bg-white/50 p-2 mb-4 mx-auto"></div>
                                <p>てんちゃん準備中...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center">
                                <div className="w-40 h-40 rounded-full bg-white p-2 mb-4 mx-auto">
                                    <CharacterFace mood={'sad'} />
                                </div>
                                <p className="text-red-600 bg-red-100 p-3 rounded-lg shadow-sm">{error}</p>
                                <Link href="/" className="mt-4 inline-block bg-gray-900 text-white font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-700 transition-colors">
                                    ホームへもどる
                                </Link>
                            </div>
                        ) : (
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
                {/* エラー時はフッターを表示しない */}
                {!error && <Footer />}
            </main>
        </div>
    );
}

// Helper functions (そのまま)
const mapWeatherType = (weatherData: any): string => {
    // Check if weatherData and necessary nested properties exist
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0 || !weatherData.wind) {
        console.warn('Incomplete weather data received in mapWeatherType:', weatherData);
        return "sunny"; // Return a default value
    }
    const main = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind.speed;

    // ★★★ 変更点: 夜判定を追加 ★★★
    const hour = new Date().getHours();
    const isNight = hour < 5 || hour >= 19;
    // ★★★ 変更点ここまで ★★★

    if (windSpeed >= 10) return "windy";
    if (main.includes("thunderstorm")) return "thunderstorm";
    if (main.includes("rain") || main.includes("drizzle")) return "rainy"; // drizzle も雨に含める
    if (main.includes("snow")) return "snowy";

    // ★★★ 変更点: clear と cloudy の判定を修正 ★★★
    if (main.includes("clear")) {
        return isNight ? "night" : "clear";
    }
    if (main.includes("clouds")) {
        const cloudiness = weatherData.clouds?.all;
        if (cloudiness !== undefined && cloudiness > 75) {
            // 曇りの場合も夜判定
            return isNight ? "night" : "cloudy";
        }
        // 雲が少ない場合は晴れ扱い (夜判定も)
        return isNight ? "night" : "sunny";
    }

    // ★★★ 変更点: デフォルトも夜判定 ★★★
    return isNight ? "night" : "sunny";
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
        default: return 'bg-sky-200'; // デフォルト (読み込み中など)
    }
};

const getWalkMessage = (weatherType?: string): string => {
    switch (weatherType) {
        case 'sunny': return '太陽が気持ちいいね！何が見つかるかな？';
        case 'clear': return '雲ひとつない快晴だ！遠くまで見えるよ！';
        case 'rainy': return '雨だけど、特別な出会いがあるかも！しずくの音がきれい。';
        case 'cloudy': return 'くもりの日は、のんびりおさんぽにぴったり。';
        case 'snowy': return '雪だ！足跡をつけて歩こう！ふわふわ！';
        case 'thunderstorm': return 'すごい音！ちょっと怖いけど、珍しいものが見つかるかも？急いで探そう！';
        case 'windy': return '風が強いね！飛ばされないように気をつけて！';
        case 'night': return '夜のおさんぽは静かでいいね。星がきれい。';
        default: return 'てくてく…何が見つかるかな？'; // デフォルトメッセージ
    }
}

// Suspense でラップする部分は変更なし
export default function WalkPage() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center">ローディング中...</div>}>
            <WalkPageComponent />
        </Suspense>
    );
}