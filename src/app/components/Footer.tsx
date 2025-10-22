// src/app/components/Footer.tsx

'use client';

// useState は不要になったので削除
// import { useState } from 'react';
import NavItem from './NavItem'; // NavItemコンポーネントをインポート
// 「ずかん」用の BsBook と「天気予報」用の BsCloud をインポート
import { BsCloud, BsBook } from 'react-icons/bs';
// 「おさんぽ」用の MdDirectionsWalk をインポート
import { MdDirectionsWalk } from 'react-icons/md';
// 「設定」用の IoSettingsSharp をインポートして元に戻す
import { IoSettingsSharp } from 'react-icons/io5';
// 「実績」用の FaSeedling をインポート
import { FaSeedling } from 'react-icons/fa';
// useRouter は NavItem で Link を使うようになったので不要
// import { useRouter } from 'next/navigation';

export default function Footer({ onWalkClick }: { onWalkClick?: () => void }) {
    // activePage の useState は削除

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        // おさんぽボタンには onClick ハンドラを渡す
        { name: 'おさんぽ', href: undefined, icon: <MdDirectionsWalk size={28} />, onClick: onWalkClick },
        { name: 'ずかん', href: '/collection', icon: <BsBook size={28} /> },
        { name: '実績', href: '/achievements', icon: <FaSeedling size={28} /> },
        // 設定アイコンを IoSettingsSharp に戻す
        { name: '設定', href: '/settings', icon: <IoSettingsSharp size={28} /> },
    ];

    // handleNavClick 関数は不要になったので削除

    return (
        <footer className="w-full bg-white/20 backdrop-blur-sm flex-shrink-0">
            <nav className="flex items-center h-20">
                {navItems.map((item) => (
                    <NavItem
                        key={item.name}
                        href={item.href} // href を NavItem に渡す
                        icon={item.icon}
                        label={item.name}
                        // isActive プロパティは削除
                        // onClick は href がない場合 (おさんぽ) のみ渡す
                        onClick={item.href ? undefined : item.onClick}
                    />
                ))}
            </nav>
        </footer>
    );
}