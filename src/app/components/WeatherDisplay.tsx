'use client';

import { motion, AnimatePresence } from 'framer-motion';
import WeatherIcon from './WeatherIcon';

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

    // ★★★ ここを修正しました ★★★
    // 親コンポーネントから渡された天気をそのまま使うようにシンプル化
    const displayWeather = weather;

    return (
        <div className="pt-8 text-center h-[150px] flex flex-col justify-center">
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onCycleWeather}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={displayWeather || 'loading'}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center gap-2"
                    >
                        {displayWeather ? (
                            <>
                                <WeatherIcon type={displayWeather} size={96} />
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
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}