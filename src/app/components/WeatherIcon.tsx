'use client';

// react-iconsから天気のアイコンをインポート
import { IoSunny, IoRainy, IoCloudy } from 'react-icons/io5';
// ★ 1. GiSnowmanのインポートを削除し、MdCloudySnowingをインポート
import { MdCloudySnowing } from 'react-icons/md';
import { FaMoon } from 'react-icons/fa';

// 天気タイプとアイコン、色の対応表を作成
const weatherMap = {
    sunny: { component: IoSunny, color: '#ffd900ff' },
    rainy: { component: IoRainy, color: '#4682B4' },
    cloudy: { component: IoCloudy, color: '#A0A0A0' },
    // ★ 2. snowyのコンポーネントをMdCloudySnowingに、色を調整
    snowy: { component: MdCloudySnowing, color: '#6495ED' },
    night: { component: FaMoon, color: '#FFD700' },
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