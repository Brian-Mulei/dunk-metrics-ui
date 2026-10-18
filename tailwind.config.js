/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['Inter','system-ui','sans-serif'],
        display:['Outfit','Inter','sans-serif'],
      },
      gridTemplateColumns:{
        '70/30':'70% 28%'
      },
      colors: {
        dark: {
          a0: "#070A12",
        },
        light: {
          a0: "#E9EDF5",
        },
        muted: "#8E9AB5",
        // court green
        primary: {
          a0: "#2BD576",
          a10: "#46DC88",
          a20: "#62E29A",
          a30: "#7FE8AD",
          a40: "#9DEEC1",
          a50: "#BBF4D5",
        },
        // scoreboard amber, for scores and stat numbers
        score: "#FFC247",
        win: "#5BE49B",
        loss: "#FF5D6C",
        // arena navy, a20 is the page background and a0/a10 are panels on top of it
        surface: {
          a0: "#131A2B",
          a10: "#18213A",
          a20: "#0B101C",
          a30: "#0F1626",
          a40: "#2A3552",
          a50: "#3A4769",
        },
        surfaceTonal: {
          a0: "#1A2236",
          a10: "#222C45",
          a20: "#2A3552",
          a30: "#34405F",
          a40: "#46537A",
          a50: "#5A6890",
        },
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },


  },
  plugins: [],
}