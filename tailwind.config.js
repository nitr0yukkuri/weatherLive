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
                'sunny': 'linear-gradient(to top, #fde68a, #a7ddf4)',
                'cloudy': 'linear-gradient(to top, #9ca3af, #e5e7eb)',
                'rainy': 'linear-gradient(to top, #60a5fa, #bfdbfe)',
                // メリハリをつけた水色のグラデーションに変更
                'snowy': 'linear-gradient(to top, #a7d8e8, #e0f2fe)',
                'night': 'linear-gradient(to top, #6b7280, #4b5563)',
            },
        },
    },
    plugins: [],
};