'use client';

// react-iconsから天気のアイコンをインポート
import { IoSunny, IoRainy, IoCloudy, IoSnow } from 'react-icons/io5';
// ★ 1. 月のアイコンを RiMoonFill に変更
import { RiMoonFill } from "react-icons/ri";

// 天気タイプとアイコン、色の対応表を作成
const weatherMap = {
    sunny: { component: IoSunny, color: '#ffd900ff' },
    rainy: { component: IoRainy, color: '#4682B4' },
    cloudy: { component: IoCloudy, color: '#A0A0A0' },
    snowy: { component: IoSnow, color: '#87CEEB' },
    // ★ 2. nightのコンポーネントを RiMoonFill に変更
    night: { component: RiMoonFill, color: '#FFD700' },
};

export default function WeatherIcon({ type, size = 80 }: { type: string; size?: number }) {
    const iconInfo = weatherMap[type];

    if (!iconInfo) {
        return null;
    }

    const IconComponent = iconInfo.component;

    return (
        <div className="inline-block">
            <IconComponent
                size={size}
                color={iconInfo.color}
            />
        </div>
    );
}