/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                // 'bg-main-bg'というクラス名で画像を指定できるようにする
                // 画像のパスは public/img/background.jpg を想定しています
                'main-bg': "url('/img/background.jpg')",
            }
        },
    },
    plugins: [],
};
export default config;