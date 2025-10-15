/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // 色の定義はそのまま
            colors: {
                'sunny-from': '#87CEEB',
                'sunny-to': '#FFD700',
                'cloudy-from': '#B0C4DE',
                'cloudy-to': '#778899',
                'rainy-from': '#4682B4',
                'rainy-to': '#708090',
                'snowy-from': '#E0FFFF',
                'snowy-to': '#B0E0E6',
                'night-from': '#00008B',
                'night-to': '#483D8B',
            },
            // ★★★ この backgroundImage の部分を丸ごと追加してください ★★★
            backgroundImage: {
                'gradient-sunny': "linear-gradient(to top, var(--tw-gradient-stops))",
                'gradient-cloudy': "linear-gradient(to top, var(--tw-gradient-stops))",
                'gradient-rainy': "linear-gradient(to top, var(--tw-gradient-stops))",
                'gradient-snowy': "linear-gradient(to top, var(--tw-gradient-stops))",
                'gradient-night': "linear-gradient(to top, var(--tw-gradient-stops))",
            }
        },
    },
    plugins: [],
};
export default config;