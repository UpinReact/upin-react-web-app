/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    
      extends: {backgroundImage: {"upinBackgroundImg" : "url('upin-react-web-app/upin/public/Screen Shot 2020-03-12 at 9.26.39 AM.png"}}
    ,
    screens: {
      'phone': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
      
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
    },
  },
  plugins: [],
}
