/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7ff",
          100: "#eef0ff",
          200: "#d9ddff",
          300: "#b7bfff",
          400: "#8f9aff",
          500: "#6872ff",
          600: "#4f58ff",
          700: "#3f43d6",
          800: "#2f339e",
          900: "#1f2266",
        },
      },
      boxShadow: {
        soft: "0 12px 40px rgba(2, 6, 23, 0.12)",
      },
    },
  },
  plugins: [],
};
