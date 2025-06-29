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
        mainPurple: "#2563eb",
      },
      backgroundImage: {
        gradiantPurple: "linear-gradient(to right, #2563eb, #2563eb)"
      }
    },
  },
  plugins: [],
} satisfies Config;
