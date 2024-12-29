/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.{js,jsx,ts,tsx}",
    "./frontend/screens/**/*.{js,jsx,ts,tsx}",
    "./frontend/auth/**/*.{js,jsx,ts,tsx}",
    "./frontend/components/**/*.{js,jsx,ts,tsx}",
    "./frontend/pages/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}