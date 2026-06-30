/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        cosmo: {
          dark: '#1F1F24',      // Luxury Black
          light: '#FFF9F6',     // Soft Ivory Rose (Main Background)
          secondary: '#FFF1EA', // Warm Blush
          primary: '#D98A8A',   // Rose Nude (Buttons, Links)
          accent: '#C8A96B',    // Soft Moroccan Gold (VIP badges, Highlights)
          textGray: '#6E6E73',  // Soft Gray
          glass: 'rgba(255, 255, 255, 0.15)',
          glassBorder: 'rgba(255, 255, 255, 0.35)',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'luxury-glow': 'radial-gradient(circle, rgba(217,138,138,0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        '2xl': '24px', // Standard rounded corners for glass cards
      }
    },
  },
  plugins: [],
}