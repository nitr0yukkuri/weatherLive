'use client'; // ★ この一行を追加！

import WeatherIcon from './WeatherIcon';

// ( ... 以下、ファイルの中身は変更なし ... )
type WeatherDisplayProps = {
    weather: string | null;
    timeOfDay: string;
    isClient: boolean;
    currentTime: Date;
    temperature: number | null;
    location: string | null;
    onCycleWeather: () => void;
};

export default function WeatherDisplay({
    weather,
    timeOfDay,
    isClient,
    currentTime,
    temperature,
    location,
    onCycleWeather,
}: WeatherDisplayProps) {
    return (
        <div className="pt-8 text-center h-[150px] flex flex-col justify-center">
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onCycleWeather}>
                {weather ? (
                    <>
                        {timeOfDay === 'night' ? (
                            <WeatherIcon type="night" size={96} />
                        ) : (
                            <WeatherIcon type={weather} size={96} />
                        )}
                        <div className="flex items-center justify-center gap-2 text-sm text-[#5D4037]/80 bg-white/30 backdrop-blur-sm rounded-md px-2 py-1">
                            {isClient && <span>{currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')}</span>}
                            {temperature !== null && <span>・{temperature}°C</span>}
                            {location && <span>・{location}</span>}
                        </div>
                    </>
                ) : (
                    <div className="h-[120px] flex items-center justify-center">
                        <p className="text-sm text-[#5D4037]/80 animate-pulse bg-white/30 backdrop-blur-sm rounded-md px-2 py-1">おてんき しらべちゅう...</p>
                    </div>
                )}
            </div>
        </div>
    );
}