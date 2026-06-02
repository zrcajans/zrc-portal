/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Firmamızın kurumsal renk kodunu buraya tanımladık
        brand: {
          DEFAULT: '#ff3600',
          hover: '#ff4d1a', // Butonların üzerine gelince oluşacak biraz daha açık turuncu
        }
      }
    },
  },
  plugins: [],
}