// src/app/components/WeatherIcon.tsx
'use client';

// ★ 1. 必要なアイコンを直接インポート
import { IoSunny, IoRainy, IoCloudy, IoThunderstorm } from 'react-icons/io5';
import { MdCloudySnowing } from 'react-icons/md';
import { FaMoon } from 'react-icons/fa';
import { BsSunFill } from 'react-icons/bs';
import { GiWhirlwind } from 'react-icons/gi';
import React from 'react'; // ★ Reactをインポート

// ★ 2. アイコンマップを「コンポーネントと色」を保持するように変更
// (ハードコードされた <IoSunny size={80} ... /> ではなく、コンポーネント自体を値にする)
const weatherMap: { [key: string]: { component: React.ElementType, color: string } } = {
    sunny: { component: IoSunny, color: '#FFC700' },
    clear: { component: BsSunFill, color: '#FFB300' },
    rainy: { component: IoRainy, color: '#4682B4' },
    cloudy: { component: IoCloudy, color: '#A0A0A0' },
    snowy: { component: MdCloudySnowing, color: '#6495ED' },
    thunderstorm: { component: IoThunderstorm, color: 'gold' },
    windy: { component: GiWhirlwind, color: '#34d399' },
    night: { component: FaMoon, color: '#FFD700' }, // ★ 1e4338b のコミットでの色 #FFD700 を使用
};

export default function WeatherIcon({ type, size = 80 }: { type: string; size?: number }) {

    // ★ 3. デフォルト（sunny）の情報を取得
    const iconInfo = weatherMap[type as keyof typeof weatherMap] || weatherMap.sunny;

    // ★ 4. IconComponent にコンポーネントを格納
    const IconComponent = iconInfo.component;

    return (
        <div className="inline-block drop-shadow-lg">
            {/* ★ 5. size prop と color prop を渡してコンポーネントを描画 */}
            <IconComponent size={size} color={iconInfo.color} />
        </div>
    );
}