'use client';

import { useState } from 'react';
import NavItem from './NavItem';
// BsCollectionFillを再インポート
import { BsCloud, BsCollectionFill } from 'react-icons/bs';
import { MdDirectionsWalk } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaSeedling } from 'react-icons/fa'; // 実績のアイコンはそのままFaSeedlingを使います

export default function Footer() {
    const [activePage, setActivePage] = useState('コレクション');

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        // ★ リンク先を '/walk' に修正
        { name: 'おさんぽ', href: '/walk', icon: <MdDirectionsWalk size={28} /> },
        // hasNotificationを削除
        { name: 'コレクション', href: '#', icon: <BsCollectionFill size={28} /> },
        { name: '実績', href: '#', icon: <FaSeedling size={28} /> },
        { name: '設定', href: '#', icon: <IoSettingsSharp size={28} /> },
    ];

    return (
        <footer className="w-full bg-white/20 backdrop-blur-sm flex-shrink-0">
            <nav className="flex items-center h-20">
                {navItems.map((item) => (
                    <NavItem
                        key={item.name}
                        href={item.href}
                        icon={item.icon}
                        label={item.name}
                        isActive={activePage === item.name}
                        onClick={() => setActivePage(item.name)}
                    // ★ hasNotificationの渡しを削除 (エラー対応)
                    />
                ))}
            </nav>
        </footer>
    );
}