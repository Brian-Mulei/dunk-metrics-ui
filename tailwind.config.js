/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['Roboto','sans-serif']
      },
      gridTemplateColumns:{
        '70/30':'70% 28%'
      },
      colors: {
        dark: {
          a0: "#000000",
        },
        light: {
          a0: "#ffffff",
        },
        primary: {
          a0: "#bff538",
          a10: "#c8f656",
          a20: "#d0f76f",
          a30: "#d8f985",
          a40: "#e0fa9a",
          a50: "#e7fbaf",
        },
        surface: {
          a0: "#121212",
          a10: "#282828",
          a20: "#3f3f3f",
          a30: "#575757",
          a40: "#717171",
          a50: "#8b8b8b",
        },
        surfaceTonal: {
          a0: "#222519",
          a10: "#37392e",
          a20: "#4d4f45",
          a30: "#64665c",
          a40: "#7c7e75",
          a50: "#94968f",
        },
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },


  },
  plugins: [],
}