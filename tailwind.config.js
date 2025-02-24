/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
	  extend: {
		maxWidth: {
		  '8xl': '88rem',
		},
		spacing: {
		  '18': '4.5rem',
		},
		borderRadius: {
		  'xl': '1rem',
		},
		animation: {
		  'gradient': 'gradient 8s linear infinite',
		},
		keyframes: {
		  gradient: {
			'0%, 100%': {
			  'background-size': '200% 200%',
			  'background-position': 'left center'
			},
			'50%': {
			  'background-size': '200% 200%',
			  'background-position': 'right center'
			},
		  },
		},
	  },
	},
	plugins: [],
  }