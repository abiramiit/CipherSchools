/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B0D12',
                sidebar: '#0F1218',
                topnav: '#12151C',
                card: '#151922',
                cardHover: '#1B2030',
                input: '#0D1016',
                border: '#262C38',

                foreground: '#F5F7FF', /* Primary text */
                secondary: '#B7BFCE',
                muted: '#7F899B',

                accent: {
                    DEFAULT: '#8B5CF6',
                    hover: '#A78BFA',
                    soft: 'rgba(139, 92, 246, 0.12)',
                    activebg: 'rgba(139, 92, 246, 0.16)'
                },
                cyan: {
                    DEFAULT: '#06b6d4',
                    light: '#22d3ee',
                    dark: '#0891b2',
                },
                success: '#34D399',
                warning: '#FBBF24',
                error: '#F87171',
                info: '#60A5FA'
            },
            fontFamily: {
                sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
                mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
            },
            animation: {
                'subtle-pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'spin-slow': 'spin 20s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
