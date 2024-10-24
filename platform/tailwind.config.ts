import type { Config } from "tailwindcss";

import typographyStyles from "./typography";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
	darkMode: "selector",
	content: [
		"./app/**/*.{js,jsx,ts,tsx,mdx}",
		"./components/**/*.{js,jsx,ts,tsx,mdx}",
		"../packages/ui/src/**/*.{js,jsx,ts,tsx,mdx}",
	],
	theme: {
		typography: typographyStyles,
		fontSize: {
			"2xs": ["0.75rem", { lineHeight: "1.25rem" }],
			xs: ["0.8125rem", { lineHeight: "1.5rem" }],
			sm: ["0.875rem", { lineHeight: "1.5rem" }],
			base: ["1rem", { lineHeight: "1.75rem" }],
			lg: ["1.125rem", { lineHeight: "1.75rem" }],
			xl: ["1.25rem", { lineHeight: "1.75rem" }],
			"2xl": ["1.5rem", { lineHeight: "2rem" }],
			"3xl": ["1.875rem", { lineHeight: "2.25rem" }],
			"4xl": ["2.25rem", { lineHeight: "2.5rem" }],
			"5xl": ["3rem", { lineHeight: "1" }],
			"6xl": ["3.75rem", { lineHeight: "1" }],
			"7xl": ["4.5rem", { lineHeight: "1" }],
			"8xl": ["6rem", { lineHeight: "1" }],
			"9xl": ["8rem", { lineHeight: "1" }],
		},
		extend: {
			animation: {
				"caret-blink": "caret-blink 1.2s ease-out infinite",
				"spin-reverse": "spin-reverse 1s linear infinite",
			},
			boxShadow: {
				glow: "0 0 4px rgb(0 0 0 / 0.1)",
			},
			maxWidth: {
				lg: "33rem",
				"2xl": "40rem",
				"3xl": "50rem",
				"5xl": "66rem",
			},
			opacity: {
				1: "0.01",
				2.5: "0.025",
				7.5: "0.075",
				15: "0.15",
			},
			fontSize: {
				"2xs": ".6875rem",
			},
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				display: ["Mona Sans", ...defaultTheme.fontFamily.sans],
			},
			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
				"spin-reverse": {
					from: { transform: "rotate(360deg)" },
					to: { transform: "rotate(0deg)" },
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@headlessui/tailwindcss"),
	],
} satisfies Config;

export default config;
