/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Yahan hum CSS Variables ko Tailwind classes se map kar rahe hain
      colors: {
        primary: 'var(--primary-color)',       // Use as: bg-primary, text-primary
        secondary: 'var(--secondary-color)',   // Use as: bg-secondary
        accent: 'var(--accent-color)',         // Use as: text-accent
        background: 'var(--background-color)', // Use as: bg-background
        textcolor: 'var(--text-color)',        // Use as: text-textcolor
      },
    },
  },
  plugins: [],
}