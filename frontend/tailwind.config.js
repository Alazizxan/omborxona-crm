/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        secondary: "#F5F5F5",
        accent: "#2563EB",
        success: "#16A34A",
        danger: "#DC2626",
        warning: "#F59E0B",
        card: "#FFFFFF",
        borderSoft: "#E5E7EB",
      },
      borderRadius: {
        xl2: "18px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
