/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f5f5f7',
        foreground: '#0f172a',
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0b1d3a',
        },
        apple: {
          bg: '#f5f5f7',
          card: '#ffffff',
          navy: '#0b1d3a',
          blue: '#1d4ed8',
          lightBlue: '#eff6ff',
          subtext: '#64748b',
          border: '#e2e8f0',
        },
        dettroin: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#0b192c',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(15, 23, 42, 0.04)',
        'apple-md': '0 4px 20px rgba(15, 23, 42, 0.06)',
        'apple-lg': '0 12px 32px rgba(15, 23, 42, 0.08)',
        'navy-glow': '0 10px 25px -5px rgba(29, 78, 216, 0.25)',
      },
    },
  },
  plugins: [],
}
