'use client';

// react-iconsから天気のアイコンをインポート
import { IoSunny, IoRainy, IoCloudy, IoSnow } from 'react-icons/io5';

// 天気タイプとアイコン、色の対応表を作成
const weatherMap = {
    sunny: { component: IoSunny, color: '#ffd900ff' },
    rainy: { component: IoRainy, color: '#4682B4' },
    cloudy: { component: IoCloudy, color: '#A0A0A0' },
    snowy: { component: IoSnow, color: '#87CEEB' },
};

export default function WeatherIcon({ type, size = 80 }: { type: string; size?: number }) {
    // typeに対応するアイコン情報を取得
    const iconInfo = weatherMap[type];

    // 対応するアイコンがない場合は何も表示しない
    if (!iconInfo) {
        return null;
    }

    // 表示するアイコンコンポーネントを決定
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