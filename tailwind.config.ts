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
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-in2": "fadeIn2 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0", transform: "translateY(-10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      fadeIn2: {
        "0%": { opacity: "0", transform: "translateY(8px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
  },
  plugins: [],
} satisfies Config;
