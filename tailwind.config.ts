import type { Config } from "tailwindcss";

export default {
	important: true,
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "rgb(247,247,247)",
				primary: "rgb(156,39,176)",
				card: "rgb(237,237,237)",
				title: "rgb(71,71,71)",
				foreground: "var(--foreground)",
				footer: "rgb(240,240,240)",
				head: "rgb(120,120,120)",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
			animation: {
				fadeIn: "fadeIn 0.5s ease",
			},
			fontSize: {
				low: "14px",
			},
		},
	},
	plugins: [],
} satisfies Config;
