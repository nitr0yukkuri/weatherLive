/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'sunny': 'linear-gradient(to top, #a7ddf4, #fde68a)',
                'clear': 'linear-gradient(to top, #93c5fd, #60a5fa)',
                'cloudy': 'linear-gradient(to top, #9ca3af, #e5e7eb)',
                'rainy': 'linear-gradient(to top, #60a5fa, #bfdbfe)',
                // ★★★ ここを修正しました ★★★
                'thunderstorm': 'linear-gradient(to top, #4b5563, #facc15)', // 雷雨 (黄色系)
                'snowy': 'linear-gradient(to top, #a7d8e8, #e0f2fe)',
                'windy': 'linear-gradient(to top, #a7f3d0, #6ee7b7)',
                'night': 'linear-gradient(to top, #374151, #111827)',
            },
        },
    },
    plugins: [],
};