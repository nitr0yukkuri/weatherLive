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
                'sunny': 'linear-gradient(to top, #FFD700, #87CEEB)',
                'cloudy': 'linear-gradient(to top, #778899, #B0C4DE)',
                'rainy': 'linear-gradient(to top, #708090, #4682B4)',
                'snowy': 'linear-gradient(to top, #B0E0E6, #E0FFFF)',
                'night': 'linear-gradient(to top, #483D8B, #00008B)',
            },
        },
    },
    plugins: [],
};