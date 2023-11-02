/** @type {import('tailwindcss').Config} */
import { withUt } from 'uploadthing/tw';

export default withUt({
	// Your existing Tailwind config
	darkMode: 'class',
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'primary-bg': '#1C1B22',
				'primary-fg': '#262626',
				'secondary-bg': '#525252',
				'secondary-hover': '#6B7280',
				'light-primary-bg': '#F9FAFB',
				'light-primary-fg': '#E5E5E5',
				'light-secondary-bg': '#D1D5DB',
				'tertiary-hover': '#1F2937',
			},
		},
	},
	plugins: [],
});
