// src/app/components/WeatherIcon.tsx
'use client';

// ★ 1. アイコンのインポートを削除
// ... (import文をごっそり削除)

// ★ 2. 共通ヘルパーをインポート (itemUtils を天候アイコンにも使います)
import { getItemIcon } from '../lib/itemUtils';

// ★ 3. weatherMap を削除

export default function WeatherIcon({ type, size = 80 }: { type: string; size?: number }) {

    // ★ 4. 共通ヘルパーを使用 (元の weatherMap のキーに対応するアイコン名で呼び出す)
    const iconNameMap: { [key: string]: string } = {
        sunny: 'IoSunny',
        clear: 'BsSunFill',
        rainy: 'IoRainy',
        cloudy: 'IoCloudy',
        snowy: 'IoSnow', // 元の IoSnow を使う
        thunderstorm: 'IoThunderstorm',
        windy: 'GiWhirlwind',
        night: 'FaMoon',
    };

    const iconName = iconNameMap[type as keyof typeof iconNameMap] || 'IoSunny';

    return (
        <div className= "inline-block drop-shadow-lg" >
        {/* itemUtils の getItemIcon を呼び出す */ }
    { getItemIcon(iconName, 'normal', size) }
    </div>
    );
}