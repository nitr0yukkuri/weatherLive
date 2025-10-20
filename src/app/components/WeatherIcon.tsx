'use client';

import { IoSunny, IoRainy, IoCloudy, IoThunderstorm } from 'react-icons/io5';
// ★★★ MdCloudySnowing をインポート ★★★
import { MdCloudySnowing } from 'react-icons/md';
import { FaMoon } from 'react-icons/fa';
import { BsSunFill } from 'react-icons/bs';
// ★★★ GiWhirlwind をインポート ★★★
import { GiWhirlwind } from 'react-icons/gi';


const weatherMap = {
    sunny: { component: IoSunny, color: '#FFC700' },
    clear: { component: BsSunFill, color: '#FFB300' },
    rainy: { component: IoRainy, color: '#4682B4' },
    cloudy: { component: IoCloudy, color: '#A0A0A0' },
    // ★★★ 雪のアイコンを MdCloudySnowing に戻し、色を調整 ★★★
    snowy: { component: MdCloudySnowing, color: '#6495ED' },
    // ★★★ 雷雨の色を黄色系に変更 ★★★
    thunderstorm: { component: IoThunderstorm, color: 'gold' },
    // ★★★ 強風のアイコンを GiWhirlwind に変更 ★★★
    windy: { component: GiWhirlwind, color: '#34d399' },
    night: { component: FaMoon, color: '#FFD700' },
};

export default function WeatherIcon({ type, size = 80 }: { type: string; size?: number }) {
    const iconInfo = weatherMap[type as keyof typeof weatherMap];

    if (!iconInfo) {
        return <IoSunny size={size} color={weatherMap.sunny.color} />;
    }

    const IconComponent = iconInfo.component;

    return (
        <div className="inline-block drop-shadow-lg">
            <IconComponent size={size} color={iconInfo.color} />
        </div>
    );
}