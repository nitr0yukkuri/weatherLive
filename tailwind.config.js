/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    // ↓↓↓↓↓↓ ここから追加 ↓↓↓↓↓↓
    safelist: [
        'from-gray-800',
        'to-black',
        'from-pink-400',
        'to-indigo-500',
        'from-pink-200',
        'to-yellow-200',
        'to-blue-300',
        'to-gray-300',
        'from-pink-100',
        'to-blue-200',
        'to-pink-300',
    ],
    // ↑↑↑↑↑↑ ここまで追加 ↑↑↑↑↑↑
    theme: {
        extend: {},
    },
    plugins: [],
};
export default config;