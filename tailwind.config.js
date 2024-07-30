/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    animation: {
      // marquee: 'marquee 5s linear infinite',
    },
    keyframes: {
    //   marquee: {
    //     '0%': { transform: 'translate3d(0, 0, 0)',
    //     visibility: 'visible' 
    //    },
    //     '100%': {transform:  'translate3d(-100%, 0, 0)' },
    // },
  },
  plugins: [],
}}
