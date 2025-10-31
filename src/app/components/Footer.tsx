// src/app/components/Footer.tsx

'use client';

import { useState, useEffect } from 'react';
import NavItem from './NavItem';
import { BsCloud, BsBook } from 'react-icons/bs';
import { MdDirectionsWalk } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaSeedling } from 'react-icons/fa';

const CURRENT_WEATHER_KEY = 'currentWeather';

export default function Footer({ onWalkClick }: { onWalkClick?: () => void }) {
    const [isNight, setIsNight] = useState(false);

    // ★★★ 修正箇所1: localStorageを読み取る関数を定義 ★★★
    const updateNightMode = () => {
        const storedWeather = localStorage.getItem(CURRENT_WEATHER_KEY);
        setIsNight(storedWeather === 'night');
    };

    useEffect(() => {
        // ★ 1. ページ読み込み時にまず実行
        updateNightMode();

        // ★ 2. 'storage' イベント（localStorageが変更された時）を監視
        const handleStorageChange = (event: StorageEvent) => {
            // 他のタブでの変更を検知
            if (event.key === CURRENT_WEATHER_KEY) {
                updateNightMode();
            }
        };

        // ★ 3. イベントリスナーを追加
        window.addEventListener('storage', handleStorageChange);

        // ★ 4. (おまけ) ホーム画面でのデバッグサイクルに対応するため、
        // カスタムイベント 'weatherChanged' も監視
        const handleWeatherChanged = () => {
            updateNightMode();
        };
        window.addEventListener('weatherChanged', handleWeatherChanged);


        // クリーンアップ関数
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('weatherChanged', handleWeatherChanged);
        };
    }, []); // 依存配列は空のまま

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        { name: 'おさんぽ', href: undefined, icon: <MdDirectionsWalk size={28} />, onClick: onWalkClick },
        { name: 'ずかん', href: '/collection', icon: <BsBook size={28} /> },
        { name: '実績', href: '/achievements', icon: <FaSeedling size={28} /> },
        { name: '設定', href: '/settings', icon: <IoSettingsSharp size={28} /> },
    ];

    const footerBgClass = isNight
        ? 'bg-gray-900/70'
        : 'bg-white/70';

    return (
        <footer className={`w-full ${footerBgClass} backdrop-blur-sm flex-shrink-0 transition-colors duration-300`}>
            <nav className="flex items-center h-20">
                {navItems.map((item) => (
                    <NavItem
                        key={item.name}
                        href={item.href}
                        icon={item.icon}
                        label={item.name}
                        onClick={item.href ? undefined : item.onClick}
                        isNight={isNight}
                    />
                ))}
            </nav>
        </footer>
    );
}