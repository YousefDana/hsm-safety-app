/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1e293b',
                secondary: '#0ea5e9',
                accent: '#0f766e',
                'accent-2': '#d97706',
                danger: '#be123c',
                success: '#15803d',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                header: ['Big Shoulders Display', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
