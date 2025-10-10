'use client';

import { useState, useEffect } from 'react';
import CharacterFace from '../components/CharacterFace';
import ForecastCard from '../components/ForecastCard';
import Link from 'next/link';
import Footer from '../components/Footer';

const dummyForecast = [
    { day: '今日', date: '金', weather: 'partlyCloudy', high: 21, low: 12, pop: 51 },
    { day: '明日', date: '土', weather: 'partlyCloudy', high: 22, low: 15, pop: 48 },
    { day: '10/12', date: '日', weather: 'cloudy', high: 25, low: 16, pop: 2 },
    { day: '10/13', date: '月', weather: 'sunny', high: 26, low: 17, pop: 0 },
    { day: '10/14', date: '火', weather: 'rainy', high: 23, low: 18, pop: 80 },
    { day: '10/15', date: '水', weather: 'sunny', high: 27, low: 18, pop: 0 },
];

export default function WeatherPage() {
    const [location, setLocation] = useState('位置情報を取得中...');

    useEffect(() => {
        // (位置情報取得のコードは変更なし)
        setTimeout(() => { // 動作確認しやすいように仮で大阪市を設定
            setLocation("大阪市");
        }, 1500);
    }, []);

    return (
        <div className="w-full min-h-screen bg-sky-100 flex flex-col">
            <main className="flex-grow p-6 font-sans text-slate-700">
                <div className="max-w-md mx-auto">
                    <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← もどる</Link>

                    <header className="mb-8">
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider">天気予報</h1>
                        <p className="text-slate-500 mt-1">{location}</p>
                    </header>

                    <div className="flex items-center gap-4 p-3 mb-8 bg-cyan-200/30 rounded-3xl">
                        <CharacterFace mood="happy" />
                        <div className="bg-white rounded-full px-5 py-2 text-sm shadow">
                            <p className="text-slate-600">今週の天気を教えるね！</p>
                        </div>
                    </div>

                    <div className="flex space-x-3 overflow-x-auto pb-4 custom-scrollbar">
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