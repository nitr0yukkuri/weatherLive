'use client';

// ★ 必要なコンポーネントとフックのみインポート
import CharacterFace from '../components/CharacterFace';
import ForecastCard from '../components/ForecastCard';
import Link from 'next/link';
import Footer from '../components/Footer';
// ★ カスタムフックをインポート
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
        dynamicBackgroundClass,
        isNight // ★ 前回の修正 (isNight) も反映済み
    } = useWeatherForecast();

    // ★ 夜間用の色クラスを定義
    const mainTextColor = isNight ? 'text-white' : 'text-slate-700';
    const linkColor = isNight ? 'text-gray-300 hover:text-white' : 'text-slate-500 hover:text-slate-700';
    const titleColor = isNight ? 'text-white' : 'text-slate-800';
    const subTitleColor = isNight ? 'text-gray-300' : 'text-slate-500';

    // --- UIレンダリング ---
    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* ★ mainTextColor を適用 */}
            <main className={`w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col ${mainTextColor} transition-colors duration-500 ${dynamicBackgroundClass}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="max-w-md mx-auto">
                        {/* ★ linkColor を適用 */}
                        <Link href="/" className={`mb-6 inline-block text-sm ${linkColor} transition-colors`}>← もどる</Link>

                        <header className="mb-8">
                            {/* ★ titleColor を適用 */}
                            <h1 className={`text-4xl font-extrabold ${titleColor} tracking-wider`}>天気予報</h1>
                            {/* ★ subTitleColor を適用 */}
                            <p className={`${subTitleColor} mt-1`}>{location}</p>
                        </header>

                        {/* ★ パネル内の文字色は変更しない (白背景のため) */}
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
                                // ★ subTitleColor を適用 (ローディングテキスト)
                                <p className={`w-full text-center ${subTitleColor} pt-20`}>お天気を調べてるよ...</p>
                            ) : error ? (
                                <p className="w-full text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>
                            ) : (
                                // ★★★ 変更点: onClick の渡し方を修正 ★★★
                                // () => handleCardClick(data) から handleCardClick に変更
                                forecast.map((data: Forecast, index: number) => (
                                    <ForecastCard
                                        key={index}
                                        {...data}
                                        onClick={handleCardClick}
                                    />
                                ))
                                // ★★★ 変更ここまで ★★★
                            )}
                        </div>
                    </div>
                </div>

                {/* ★ フッターに isNight を渡す */}
                <Footer isNight={isNight} />
            </main>
        </div>
    );
}