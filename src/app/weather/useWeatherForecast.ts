// src/app/weather/useWeatherForecast.ts
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// 共通の型定義とヘルパー関数をインポート
import { WeatherType, mapWeatherType, getTimeOfDay } from '../lib/weatherUtils';
// ★ ヘルパー関数を別ファイルからインポート
import {
    getBackgroundColorClass,
    generateAdviceMessage
} from './weatherPage.helpers';

// ===================================
// 1. このフック固有の型定義
// (page.tsx がインポートするため export する)
// ===================================
export interface Forecast {
    day: string;
    date: string;
    weather: string;
    high: number;
    low: number;
    pop: number;
}
interface DailyData {
    temps: number[];
    pops: number[];
    weathers: string[];
    // ★★★ 変更点: 3時間ごとの item データを保持する配列を追加 ★★★
    items: any[];
}


// ===================================
// 3. カスタムフック本体
// ===================================
export function useWeatherForecast() {
    // --- State定義 ---
    const [location, setLocation] = useState('位置情報を取得中...');
    const [forecast, setForecast] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDayMessage, setSelectedDayMessage] = useState<string | null>(null);
    const [messageIndex, setMessageIndex] = useState(0);
    const fetchStarted = useRef(false);

    // --- メッセージとカードクリックのハンドラ ---
    const handleInitialMessage = useCallback((data: Forecast[]) => {
        if (data.length > 0) {
            const todayData = data[0];
            // ★ インポートした関数を使用
            const initialMessage = generateAdviceMessage(todayData, 0);
            setSelectedDayMessage(initialMessage);
            setMessageIndex(1);
        }
    }, []);

    const handleCardClick = useCallback((data: { day: string; weather: string; high: number; low: number; pop: number }) => {
        // ★ インポートした関数を使用
        const message = generateAdviceMessage(data, messageIndex);
        setSelectedDayMessage(message);
        setMessageIndex(prevIndex => (prevIndex + 1));
    }, [messageIndex]);

    // --- データ取得ロジック (useEffect) ---
    useEffect(() => {
        if (fetchStarted.current) return;
        fetchStarted.current = true;

        const fetchWeatherData = async (latitude: number, longitude: number) => {
            setError(null);
            try {
                const forecastResponse = await fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`);
                const data = await forecastResponse.json();
                if (!forecastResponse.ok) throw new Error(data.message || '予報の取得に失敗しました');
                setLocation(data.city.name || "不明な場所");

                // 週間予報データの整形
                const dailyForecasts = new Map<string, DailyData>();
                data.list.forEach((item: any) => {
                    const date = new Date(item.dt * 1000).toLocaleDateString('ja-JP');
                    if (!dailyForecasts.has(date)) {
                        // ★★★ 変更点: items を初期化 ★★★
                        dailyForecasts.set(date, { temps: [], pops: [], weathers: [], items: [] });
                    }
                    const dayData = dailyForecasts.get(date)!;
                    dayData.temps.push(item.main.temp);
                    dayData.pops.push(item.pop);
                    dayData.weathers.push(item.weather[0].main);
                    // ★★★ 変更点: item全体を格納 ★★★
                    dayData.items.push(item);
                });

                // ★ インポートした getTimeOfDay を使用
                const timeOfDay = getTimeOfDay(new Date());

                const formattedForecast = Array.from(dailyForecasts.entries()).slice(0, 5).map(([dateStr, dailyData], index) => {
                    const date = new Date(dateStr);
                    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
                    let dayLabel = index === 0 ? '今日' : index === 1 ? '明日' : `${date.getMonth() + 1}/${date.getDate()}`;

                    // ★★★ 変更点: その日の天気を決定するロジックを改善 ★★★

                    // 1. その日の3時間ごと予報(items)の中で、最も優先度の高い天気を採用する
                    //    (雷雨 > 強風 > 雨/雪 > ... の順で mapWeatherType が判定する)

                    //    簡略化のため、その日の最初の予報(items[0])を代表の天気とする。
                    //    これにより、mapWeatherType が windSpeed も見れるようになる。
                    let representativeItem = dailyData.items[0] || { weather: [{ main: "Clear" }] }; // デフォルト

                    // 2. ただし、元のロジックにあった「その日一度でも雨が降るか」の判定は維持する
                    const hasRain = dailyData.weathers.some(w => w.toLowerCase().includes('rain'));

                    // ★ 変更点: mapWeatherType に item を丸ごと渡す
                    let weather: WeatherType | string = mapWeatherType(representativeItem);

                    // 3. もし mapWeatherType が 'rainy' 以外を返したが、
                    //    その日のどこかで雨が降る (hasRain) なら 'rainy' に上書きする
                    if (hasRain && weather !== 'rainy' && weather !== 'thunderstorm') {
                        weather = 'rainy';
                    }

                    // 4. 今日の予報が夜の場合の処理
                    if (index === 0 && (weather === 'sunny' || weather === 'clear') && timeOfDay === 'night') {
                        weather = 'night';
                    }
                    // ★★★ 変更ここまで ★★★

                    return {
                        day: dayLabel, date: dayOfWeek, weather: weather,
                        high: Math.round(Math.max(...dailyData.temps)),
                        low: Math.round(Math.min(...dailyData.temps)),
                        pop: Math.round(Math.max(...dailyData.pops) * 100),
                    };
                });

                setForecast(formattedForecast);
                handleInitialMessage(formattedForecast);
            } catch (err: any) {
                console.error("Failed to fetch weather forecast:", err);
                setError(err.message);
                setLocation("天気情報の取得に失敗");
                setSelectedDayMessage("あれれ、うまくお天気を調べられなかったみたい...");
            } finally {
                setLoading(false);
            }
        };

        // Geolocationロジック (親しみやすいエラーメッセージ)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchWeatherData(position.coords.latitude, position.coords.longitude),
                (geoError) => {
                    console.error("Geolocation Error:", geoError);
                    let errorMessage = "あれれ、いまどこにいるか分かんなくなっちゃった…";
                    let message = "いまどこにいるか分かれば、お天気を調べられるよ！";

                    if (geoError.code === geoError.PERMISSION_DENIED) {
                        errorMessage = "いまどこにいるか、教えてほしいな！\n（ブラウザの設定を確認してみてね）";
                        message = "いまどこにいるか教えてくれたら、お天気予報をお届けするね。";
                    } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
                        errorMessage = "うーん、いまいる場所がうまく掴めないみたい…";
                        message = "うまく場所が掴めないみたい…。もう一度試してみてね。";
                    } else if (geoError.code === geoError.TIMEOUT) {
                        errorMessage = "場所を探すのに時間がかかっちゃった…\nもう一回試してみて！";
                        message = "場所を探すのに時間がかかっちゃったみたい。";
                    }

                    setLocation("？？？");
                    setError(errorMessage);
                    setLoading(false);
                    setSelectedDayMessage(message);
                },
                { timeout: 10000 }
            );
        } else {
            setLocation("？？？");
            setError("ごめんね、このアプリだと\nいまどこにいるかの機能が使えないみたい…");
            setLoading(false);
            setSelectedDayMessage("うーん、このアプリだと場所がわからないみたい…");
        }
    }, [handleInitialMessage]); // useEffect の依存配列

    // --- UI（ビュー）に必要な値を計算 ---
    const todayWeather = useMemo(() => (forecast.length > 0 ? forecast[0].weather : undefined), [forecast]);
    // ★ インポートした関数を使用
    const dynamicBackgroundClass = useMemo(() => getBackgroundColorClass(todayWeather), [todayWeather]);

    // ★★★ 変更点: isNight を計算 ★★★
    const isNight = useMemo(() => todayWeather === 'night', [todayWeather]);

    // --- コンポーネントに渡す値を返す ---
    return {
        location,
        forecast,
        loading,
        error,
        selectedDayMessage,
        handleCardClick,
        dynamicBackgroundClass,
        isNight, // ★★★ 変更点: isNight を返す ★★★
    };
}