module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-main)'],
        alt: ['var(--font-alt)']
      }
    }
  },
  plugins: [],
}
