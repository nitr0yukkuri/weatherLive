'use client';

// moodプロパティを受け取るように変更
export default function CharacterFace({ mood = "happy" }: { mood?: "happy" | "neutral" | "sad" }) {

    // moodに応じて口の形を変更する関数
    const getMouthPath = () => {
        switch (mood) {
            case "happy":
                return "M 45 75 Q 60 90 75 75";
            case "neutral":
                return "M 45 80 L 75 80";
            case "sad":
                return "M 45 85 Q 60 75 75 85";
            default:
                return "M 45 75 Q 60 90 75 75";
        }
    };

    return (
        <svg viewBox="0 0 120 120" width="80" height="80">
            {/* Blush */}
            <circle cx="20" cy="70" r="12" fill="#F8BBD0" opacity="0.7" />
            <circle cx="100" cy="70" r="12" fill="#F8BBD0" opacity="0.7" />
            {/* Eyes */}
            <circle cx="40" cy="55" r="5" fill="#5D4037" />
            <circle cx="80" cy="55" r="5" fill="#5D4037" />
            {/* Mouth */}
            <path d={getMouthPath()} stroke="#5D4037" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
    );
}