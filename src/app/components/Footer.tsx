'use client';

import { useState } from 'react';
import NavItem from './NavItem';
// ↓↓↓ BsCollectionFill をインポートします ↓↓↓
import { BsCloud, BsCollectionFill, BsStarFill } from 'react-icons/bs';
import { MdDirectionsWalk } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';

export default function Footer() {
    const [activePage, setActivePage] = useState('コレクション');

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        { name: 'おさんぽ', href: '#', icon: <MdDirectionsWalk size={28} /> },
        // ↓↓↓ アイコンを BsCollectionFill に変更しました ↓↓↓
        { name: 'コレクション', href: '#', icon: <BsCollectionFill size={28} />, hasNotification: true },
        { name: '実績', href: '#', icon: <BsStarFill size={28} /> },
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
                        hasNotification={item.hasNotification}
                    />
                ))}
            </nav>
        </footer>
    );
}