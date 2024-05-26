import type { Config } from "tailwindcss";

const config = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx,mdx}",
    "../packages/ui/src/**/*.{ts,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    extend: {
      animation: {
        "caret-blink": "caret-blink 1.2s ease-out infinite",
      },
      fontSize: {
        "2xs": ".6875rem",
      },
      fontFamily: {
        sans: "var(--font-inter)",
        display: "var(--font-mona-sans)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      opacity: {
        2.5: "0.025",
        7.5: "0.075",
        15: "0.15",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;

export default config;
