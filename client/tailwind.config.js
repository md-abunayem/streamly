/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable manual toggle via class
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1e3a8a', // blue-800
          dark: '#3b82f6',  // blue-500
        },
        background: {
          light: '#ffffff',
          dark: '#1f2937',
        },
        text: {
          light: '#111827',
          dark: '#f9fafb',
        },
      },
    },
  },
  plugins: [],
}
