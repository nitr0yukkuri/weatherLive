// src/app/components/Footer.tsx

'use client';

import { useState, useEffect } from 'react'; // ★ useEffect と useState をインポート
import NavItem from './NavItem';
import { BsCloud, BsBook } from 'react-icons/bs';
import { MdDirectionsWalk } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaSeedling } from 'react-icons/fa';

const CURRENT_WEATHER_KEY = 'currentWeather'; // ★ localStorage キー

export default function Footer({ onWalkClick }: { onWalkClick?: () => void }) {
    // ★ 夜モードかどうかを判定する state を追加
    const [isNight, setIsNight] = useState(false);

    // ★ クライアントサイドで localStorage から天気を読み込む
    useEffect(() => {
        const storedWeather = localStorage.getItem(CURRENT_WEATHER_KEY);
        setIsNight(storedWeather === 'night');
    }, []); // ページ読み込み時に一度だけ実行

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        { name: 'おさんぽ', href: undefined, icon: <MdDirectionsWalk size={28} />, onClick: onWalkClick },
        { name: 'ずかん', href: '/collection', icon: <BsBook size={28} /> },
        { name: '実績', href: '/achievements', icon: <FaSeedling size={28} /> },
        { name: '設定', href: '/settings', icon: <IoSettingsSharp size={28} /> },
    ];

    // ★ 夜モードに応じてフッターの背景色を変更
    const footerBgClass = isNight
        ? 'bg-gray-900/70' // 夜用の暗い背景
        : 'bg-white/70';   // 昼用の明るい背景

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
                        isNight={isNight} // ★ NavItem に isNight 情報を渡す
                    />
                ))}
            </nav>
        </footer>
    );
}