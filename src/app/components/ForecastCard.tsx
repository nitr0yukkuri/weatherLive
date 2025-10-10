import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
    day: string;
    date: string;
    weather: string;
    high: number;
    low: number;
    pop: number;
}

export default function ForecastCard({ day, date, weather, high, low, pop }: ForecastCardProps) {
    // 天気の種類に応じて日本語のテキストを返すヘルパー関数
    const getWeatherText = (weatherType: string) => {
        switch (weatherType) {
            case 'partlyCloudy': return '晴れ時々くもり';
            case 'cloudy': return 'くもり';
            case 'sunny': return '晴れ';
            case 'rainy': return '雨';
            case 'snowy': return '雪';
            default: return '晴れ';
        }
    };

    return (
        <div className="flex-shrink-0 w-32 text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md flex flex-col items-center gap-2">
            <p className="font-bold">{day}</p>
            <p className="text-sm text-gray-500 -mt-2">{date}</p>

            <div className="my-2">
                <WeatherIcon type={weather} size={48} />
            </div>

            <p className="text-sm">{getWeatherText(weather)}</p>

            <div className="text-lg">
                <span className="font-bold text-red-500">{high}°</span>
                <span className="text-sm text-gray-500"> / {low}°</span>
            </div>

            <p className="text-sm text-blue-500">{pop}%</p>
        </div>
    );
}