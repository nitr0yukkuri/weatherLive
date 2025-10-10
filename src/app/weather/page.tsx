'use client';

import { useState, useEffect } from 'react';
import CharacterFace from '../components/CharacterFace';
import ForecastCard from '../components/ForecastCard';
import Link from 'next/link';
import Footer from '../components/Footer';

// ダミーの天気予報データ
const dummyForecast = [
    { day: '今日', date: '金', weather: 'partlyCloudy', high: 21, low: 12, pop: 51 },
    { day: '明日', date: '土', weather: 'partlyCloudy', high: 22, low: 15, pop: 48 },
    { day: '10/12', date: '日', weather: 'cloudy', high: 25, low: 16, pop: 2 },
    { day: '10/13', date: '月', weather: 'sunny', high: 26, low: 17, pop: 0 },
    { day: '10/14', date: '火', weather: 'rainy', high: 23, low: 18, pop: 80 },
];

export default function WeatherPage() {
    const [location, setLocation] = useState('位置情報を取得中...');

    // ▼▼▼ このuseEffectブロックを追加 ▼▼▼
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // APIに現在の緯度経度を渡して、場所の名前を取得
                    const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
                    if (response.ok) {
                        const data = await response.json();
                        setLocation(data.name || "不明な場所"); // 取得した場所の名前に更新
                    } else {
                        setLocation("場所を取得できませんでした");
                    }
                } catch (error) {
                    console.error("Failed to fetch location name:", error);
                    setLocation("場所の取得に失敗しました");
                }
            });
        } else {
            setLocation("位置情報がサポートされていません");
        }
    }, []); // この空の配列は、ページが最初に読み込まれた時に1回だけ実行するという意味です

    return (
        <div className="w-full min-h-screen bg-sky-100 flex flex-col">
            <main className="flex-grow p-4 font-sans text-gray-700">
                <div className="max-w-sm mx-auto">
                    <Link href="/" className="text-gray-600 mb-4 inline-block">← もどる</Link>
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">天気予報</h1>
                        <p className="text-gray-500">{location}</p> {/* ここの表示が更新される */}
                    </header>
                    <div className="flex items-center gap-4 p-4 mb-6 bg-white/60 rounded-2xl shadow-sm">
                        <CharacterFace mood="happy" />
                        <p className="text-gray-700">今週の天気を教えるね！</p>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4">
                        {dummyForecast.map((data, index) => (
                            <ForecastCard key={index} {...data} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}