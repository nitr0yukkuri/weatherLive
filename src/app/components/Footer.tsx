'use client';

import { useState } from 'react';
import NavItem from './NavItem';

export default function Footer() {
    const [activePage, setActivePage] = useState('コレクション');

    const navItems = [
        { name: '天気予報', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg> },
        { name: 'おさんぽ', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 12.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" /><path d="M12.5 12.5 15 22l5-5-1.5-1.5" /><path d="M5 22s3-3 3-5" /><path d="M12.5 7.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" /></svg> },
        { name: 'コレクション', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>, hasNotification: true },
        { name: '実績', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
        { name: '設定', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg> },
    ];

    return (
        <footer className="w-full bg-pink-50/80 backdrop-blur-sm flex-shrink-0">
            <nav className="flex items-center h-20">
                {navItems.map((item) => (
                    <NavItem
                        key={item.name}
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