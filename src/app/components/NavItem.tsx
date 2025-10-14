'use client';

import { useRouter } from 'next/navigation';

export default function NavItem({ icon, label, isActive, onClick, hasNotification = false, href }) {
    const router = useRouter();
    const textColor = isActive ? 'text-amber-600' : 'text-amber-800';

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
                        <span className="h-2 w-2 rounded-full bg-amber-300"></span>
                        <span className="h-2 w-2 rounded-full bg-amber-400 -ml-1"></span>
                    </div>
                )}
            </div>
            {/* ↓↓↓ ここの文字サイズを小さくしました ↓↓↓ */}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};