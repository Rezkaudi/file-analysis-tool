import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        text: 'var(--color-text)',
        background: "var(--background)",
        foreground: "var(--foreground)",
        mainPurple: "#8926a4",
      },
      backgroundImage: {
        gradiantPurple: "linear-gradient(to right, #a855f7, #ec4899)"
      }
    },
  },
  plugins: [],
} satisfies Config;
