// nitr0yukkuri/weatherlive/weatherLive-b3045c8544f8e00c4dffca0c24f4db06f823d485/src/app/components/Footer.tsx

'use client';

import { useState } from 'react';
import NavItem from './NavItem'; // ← NavItemはここから読み込む
import { BsCloud, BsCollectionFill } from 'react-icons/bs';
import { MdDirectionsWalk } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaSeedling } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Footer({ onWalkClick }: { onWalkClick?: () => void }) {
    const router = useRouter();
    // 初期状態をホームページに合わせるため、空にしておくのがおすすめです
    const [activePage, setActivePage] = useState('');

    const navItems = [
        { name: '天気予報', href: '/weather', icon: <BsCloud size={28} /> },
        { name: 'おさんぽ', href: undefined, icon: <MdDirectionsWalk size={28} />, onClick: onWalkClick },
        // ★★★ ここを修正しました: 'コレクション' を 'ずかん' に変更 ★★★
        { name: 'ずかん', href: '/collection', icon: <BsCollectionFill size={28} /> },
        { name: '実績', href: '#', icon: <FaSeedling size={28} /> },
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
                        // ★★★ hrefを渡すように修正 ★★★
                        href={item.href}
                        icon={item.icon}
                        label={item.name}
                        isActive={activePage === item.name}
                        onClick={item.onClick ? item.onClick : () => setActivePage(item.name)}
                    />
                ))}
            </nav>
        </footer>
    );
}
// ★★★ このファイルにあった NavItem の定義は削除しました ★★★