'use client';

// ★ 変更点 1: 必要なコンポーネントとフックのみインポート
import CharacterFace from '../components/CharacterFace';
import ForecastCard from '../components/ForecastCard';
import Link from 'next/link';
import Footer from '../components/Footer';
// ★ 新しいカスタムフックをインポート
import { useWeatherForecast, Forecast } from './useWeatherForecast';

// ===================================
// メインコンポーネント (UIを担当)
// ===================================
export default function WeatherPage() {

    // ★ カスタムフックからロジックと状態を受け取る
    const {
        location,
        forecast,
        loading,
        error,
        selectedDayMessage,
        handleCardClick,
        dynamicBackgroundClass
    } = useWeatherForecast();

    // --- UIレンダリング ---
    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-700 transition-colors duration-500 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="max-w-md mx-auto">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← もどる</Link>

                        <header className="mb-8">
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider">天気予報</h1>
                            <p className="text-slate-500 mt-1">{location}</p>
                        </header>

                        <div className="flex items-center gap-4 p-4 mb-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-md">
                            <div className="w-16 h-16 flex-shrink-0">
                                <CharacterFace mood={error ? 'sad' : 'happy'} />
                            </div>
                            <p className="text-slate-600 text-sm">
                                {selectedDayMessage || "お天気を調べてるよ..."}
                            </p>
                        </div>

                        <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar min-h-[260px]">
                            {loading ? (
                                <p className="w-full text-center text-slate-500 pt-20">お天気を調べてるよ...</p>
                            ) : error ? (
                                <p className="w-full text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>
                            ) : (
                                // ★ 変更点: 型エラーを防ぐため (data: any) -> (data: Forecast)
                                forecast.map((data: Forecast, index: number) => (
                                    <ForecastCard
                                        key={index}
                                        {...data}
                                        onClick={handleCardClick}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}