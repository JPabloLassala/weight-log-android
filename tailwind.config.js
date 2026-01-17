/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#11c8b0",
          tealDark: "#0fa7bf",
          tealLight: "#e8f7f4",
          tealAccent: "#3adfce",
        },
        accent: {
          orange: "#f6a623",
        },
      },
    },
  },
  plugins: [],
}
