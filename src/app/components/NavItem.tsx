'use client';

export default function NavItem({ icon, label, isActive, onClick, hasNotification = false }) {
    const textColor = isActive ? 'text-pink-600' : 'text-pink-800';
    return (
        <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 h-full ${textColor} border-none outline-none`}>
            <div className="relative">
                {icon}
                {hasNotification && (
                    <div className="absolute -top-1 -right-1 flex">
                        <span className="h-2 w-2 rounded-full bg-pink-300"></span>
                        <span className="h-2 w-2 rounded-full bg-pink-400 -ml-1"></span>
                    </div>
                )}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
};