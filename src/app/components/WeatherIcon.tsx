'use client';

export default function WeatherIcon({ type, size = 80 }: { type: string; size?: number }) {
    const renderIcon = () => {
        switch (type) {
            case "sunny":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="20" fill="#FFD700" stroke="#F4A460" strokeWidth="3" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                            const rad = (angle * Math.PI) / 180;
                            const x1 = 50 + Math.cos(rad) * 28;
                            const y1 = 50 + Math.sin(rad) * 28;
                            const x2 = 50 + Math.cos(rad) * 38;
                            const y2 = 50 + Math.sin(rad) * 38;
                            return (
                                <line
                                    key={angle}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#F4A460"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>
                );
            case "rainy":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path
                            d="M 30 45 Q 30 35 40 35 Q 40 25 50 25 Q 60 25 60 35 Q 70 35 70 45 Q 70 55 60 55 L 40 55 Q 30 55 30 45 Z"
                            fill="#B0C4DE"
                            stroke="#778899"
                            strokeWidth="2.5"
                        />
                        <line x1="35" y1="65" x2="32" y2="75" stroke="#4682B4" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="50" y1="65" x2="47" y2="75" stroke="#4682B4" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="65" y1="65" x2="62" y2="75" stroke="#4682B4" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                );
            case "cloudy":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path
                            d="M 25 50 Q 25 40 35 40 Q 35 30 45 30 Q 55 30 55 40 Q 65 40 65 50 Q 65 60 55 60 L 35 60 Q 25 60 25 50 Z"
                            fill="#E8E8E8"
                            stroke="#B0B0B0"
                            strokeWidth="2.5"
                        />
                        <path
                            d="M 40 55 Q 40 45 50 45 Q 50 35 60 35 Q 70 35 70 45 Q 80 45 80 55 Q 80 65 70 65 L 50 65 Q 40 65 40 55 Z"
                            fill="#D3D3D3"
                            stroke="#A0A0A0"
                            strokeWidth="2.5"
                        />
                    </svg>
                );
            case "snowy":
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
                        <path
                            d="M 30 45 Q 30 35 40 35 Q 40 25 50 25 Q 60 25 60 35 Q 70 35 70 45 Q 70 55 60 55 L 40 55 Q 30 55 30 45 Z"
                            fill="#F0F8FF"
                            stroke="#B0C4DE"
                            strokeWidth="2.5"
                        />
                        {[35, 50, 65].map((x) => (
                            <g key={x}>
                                <line x1={x} y1="65" x2={x} y2="75" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round" />
                                <line x1={x - 3} y1="68" x2={x + 3} y2="68" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round" />
                                <line x1={x - 3} y1="72" x2={x + 3} y2="72" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round" />
                            </g>
                        ))}
                    </svg>
                );
            default:
                return null;
        }
    };

    return <div className="inline-block">{renderIcon()}</div>;
}