import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
    day: string;
    date: string;
    weather: string;
    high: number;
    low: number;
    pop: number;
    // ★ 1. クリックハンドラが天気詳細オブジェクトを受け取るように変更
    onClick: (data: { day: string; weather: string; high: number; low: number; pop: number }) => void;
}

export default function ForecastCard({ day, date, weather, high, low, pop, onClick }: ForecastCardProps) {
    const getWeatherText = (weatherType: string) => {
        switch (weatherType) {
            case 'partlyCloudy': return '晴れ時々くもり';
            case 'cloudy': return 'くもり';
            case 'sunny': return '晴れ';
            case 'rainy': return '雨';
            case 'snowy': return '雪';
            case 'night': return '夜';
            default: return '晴れ';
        }
    };

    // ★ 2. クリック時に渡すデータをオブジェクトとして用意
    const cardData = { day, weather, high, low, pop };

    return (
        // ★ 3. focus:ring-pink-300 を focus:ring-sky-400 に変更し、フォーカス時の外枠の色を青系にしました
        <button
            onClick={() => onClick(cardData)}
            className="flex-shrink-0 w-32 text-center p-4 bg-white/40 backdrop-blur-md rounded-[2rem] shadow-lg flex flex-col items-center transition-transform active:scale-[0.98] cursor-pointer hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
            <p className="font-bold text-slate-700">{day}</p>
            <p className="text-sm text-slate-500 -mt-1">{date}</p>

            <div className="my-3">
                <WeatherIcon type={weather} size={40} />
            </div>

            <p className="text-xs font-semibold text-slate-600 h-8 flex items-center justify-center">
                {getWeatherText(weather)}
            </p>

            <div className="text-lg">
                <span className="font-bold text-slate-800">{high}°</span>
                <span className="text-sm text-slate-400">/{low}°</span>
            </div>

            <p className="text-xs text-cyan-600 font-bold mt-2">{pop}%</p>
        </button>
    );
}