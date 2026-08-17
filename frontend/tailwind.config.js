/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gfg: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#2e7d32', // Classic GFG green
          600: '#1b5e20',
          accent: '#00E676', // Vibrant modern GFG Emerald glow
          emerald: '#10B981',
          hover: '#059669'
        },
        dark: {
          bg: '#0B0F17',       // Main dark background
          card: '#111827',     // Container card background
          border: '#1F2937',   // Muted borders
          hover: '#1E293B',    // Hover slate
          muted: '#9CA3AF'     // Subtitle text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'gfg-glow': '0 0 20px rgba(0, 230, 118, 0.15)',
        'gfg-card': '0 4px 20px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
