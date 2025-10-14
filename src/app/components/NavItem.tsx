'use client';

import { useRouter } from 'next/navigation';

export default function NavItem({ icon, label, isActive, onClick, hasNotification = false, href }) {
    const router = useRouter();
    // ↓↓↓ 落ち着いたグレー系に変更しました ↓↓↓
    const textColor = isActive ? 'text-slate-600' : 'text-slate-800';

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        if (href) {
            router.push(href);
        }
    };

    return (
        <button onClick={handleClick} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 h-full ${textColor} border-none outline-none`}>
            <div className="relative">
                {icon}
                {hasNotification && (
                    <div className="absolute -top-1 -right-1 flex">
                        {/* ↓↓↓ 通知ドットの色もグレー系に変更しました ↓↓↓ */}
                        <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                        <span className="h-2 w-2 rounded-full bg-slate-400 -ml-1"></span>
                    </div>
                )}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
};