'use client';

import { useState } from 'react';
import NavItem from './NavItem';
// ★ 必要なアイコンをすべて正しいパスからインポート
import { BsCloud, BsCollectionFill } from 'react-icons/bs';
import { MdDirectionsWalk } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaSeedling } from 'react-icons/fa';

export default function Footer() {
    const [activePage, setActivePage] = useState('コレクション');

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        { name: 'おさんぽ', href: '#', icon: <MdDirectionsWalk size={28} /> },
        // コレクション: BsCollectionFill、hasNotificationプロパティなし
        { name: 'コレクション', href: '#', icon: <BsCollectionFill size={28} /> },
        // 実績: FaSeedling、hasNotificationプロパティなし
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
                    // ★ エラーを解消するため、item.hasNotificationの渡しを削除します
                    // hasNotificationプロパティはNavItemコンポーネント内でデフォルト値(false)が適用されます
                    />
                ))}
            </nav>
        </footer>
    );
}