/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                prime: {
                    bg: '#0F171E',
                    'bg-light': '#1A242F',
                    'bg-hover': '#2A3847',
                    blue: '#00A8E1',
                    'blue-hover': '#00C8FF',
                    text: '#FFFFFF',
                    'text-secondary': '#8197A4',
                    border: '#425265',
                }
            },
            fontFamily: {
                sans: ['Amazon Ember', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
