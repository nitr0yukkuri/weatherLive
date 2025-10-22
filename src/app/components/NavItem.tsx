// src/app/components/NavItem.tsx

'use client';

import Link from 'next/link';

// isActive プロパティを削除
export default function NavItem({ icon, label, onClick, hasNotification = false, href }: { icon: React.ReactNode, label: string, onClick?: () => void, hasNotification?: boolean, href?: string }) {
    // textColor のロジックを削除し、常に同じ色にする (例: text-slate-700)
    // const textColor = isActive ? 'text-slate-600' : 'text-slate-800';
    const textColor = 'text-slate-700'; // 固定の色に変更

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const content = (
        <>
            <div className="relative">
                {icon}
                {hasNotification && (
                    <div className="absolute -top-1 -right-1 flex">
                        <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                        <span className="h-2 w-2 rounded-full bg-slate-400 -ml-1"></span>
                    </div>
                )}
            </div>
            <span className="text-xs font-medium">{label}</span>
        </>
    );

    // className から textColor を削除 (固定色を使うため)
    const className = `flex-1 flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 h-full ${textColor} border-none outline-none`;

    return href ? (
        // onClick ハンドラは Link 自体ではなく、内部の要素に適用するか、
        // もしくは Link の onClick として渡す（ただし、主に状態更新用）
        <Link href={href} className={className} onClick={handleClick}>
            {content}
        </Link>
    ) : (
        <button onClick={handleClick} className={className}>
            {content}
        </button>
    );
};