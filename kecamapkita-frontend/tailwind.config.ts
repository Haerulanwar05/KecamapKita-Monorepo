import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        premium: {
          50: 'var(--premium-50)',
          100: 'var(--premium-100)',
          400: 'var(--premium-400)',
          500: 'var(--premium-500)',
          600: 'var(--premium-600)',
          700: 'var(--premium-700)',
          900: 'var(--premium-900)',
        },
        zinc: {
          950: '#09090b',
        }
      }
    },
  },
  plugins: [],
};
export default config;
