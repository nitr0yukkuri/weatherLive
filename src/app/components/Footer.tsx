// src/app/components/Footer.tsx

'use client';

import { useState } from 'react';
import NavItem from './NavItem'; // NavItemコンポーネントをインポート
// BsBook アイコンを追加でインポート
import { BsCloud, BsCollectionFill, BsBook } from 'react-icons/bs';
import { MdDirectionsWalk } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaSeedling } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Footer({ onWalkClick }: { onWalkClick?: () => void }) {
    const router = useRouter();
    const [activePage, setActivePage] = useState('');

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        { name: 'おさんぽ', href: undefined, icon: <MdDirectionsWalk size={28} />, onClick: onWalkClick },
        // 「ずかん」のアイコンを BsBook に変更
        { name: 'ずかん', href: '/collection', icon: <BsBook size={28} /> },
        { name: '実績', href: '/achievements', icon: <FaSeedling size={28} /> },
        { name: '設定', href: '#', icon: <IoSettingsSharp size={28} /> },
    ];

    const handleNavClick = (item: any) => {
        if (item.onClick) {
            item.onClick();
        } else if (item.href) {
            setActivePage(item.name);
            router.push(item.href);
        }
    };

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
                        // NavItem コンポーネント内で router.push が実行されるため、
                        // ここでは onClick ハンドラは activePage の更新のみ（または onClick があればそれを実行）
                        onClick={item.onClick ? item.onClick : () => setActivePage(item.name)}
                    />
                ))}
            </nav>
        </footer>
    );
}