import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: { '2xl': '1400px' }
		},
		extend: {
			fontFamily: {
				display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				crackit: {
					'50':  'hsl(240 60% 96%)',
					'100': 'hsl(240 55% 92%)',
					'200': 'hsl(240 55% 84%)',
					'300': 'hsl(234 80% 74%)',
					'400': 'hsl(240 70% 60%)',
					'500': 'hsl(243 75% 59%)',
					'600': 'hsl(244 65% 48%)',
					'700': 'hsl(244 60% 38%)',
					'800': 'hsl(244 55% 28%)',
					'900': 'hsl(240 47% 12%)',
					'950': 'hsl(240 47% 6%)',
				},
				darkBlue: {
					'50':  'hsl(var(--darkBlue-50))',
					'100': 'hsl(var(--darkBlue-100))',
					'200': 'hsl(var(--darkBlue-200))',
					'300': 'hsl(var(--darkBlue-300))',
					'400': 'hsl(var(--darkBlue-400))',
					'500': 'hsl(var(--darkBlue-500))',
					'600': 'hsl(var(--darkBlue-600))',
					'700': 'hsl(var(--darkBlue-700))',
					'800': 'hsl(var(--darkBlue-800))',
					'900': 'hsl(var(--darkBlue-900))',
					'950': 'hsl(var(--darkBlue-950))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-indigo': 'var(--gradient-indigo)',
				'gradient-aurora': 'var(--gradient-aurora)',
				'gradient-hero': 'var(--gradient-hero)',
			},
			boxShadow: {
				glow: 'var(--shadow-glow)',
				elevated: 'var(--shadow-elevated)',
				soft: 'var(--shadow-soft)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'crack': {
					'0%':   { transform: 'scale(1)', opacity: '1' },
					'40%':  { transform: 'scale(1.04)', opacity: '0.9' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'fade-in-up': {
					'0%':   { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'shimmer': {
					'0%':   { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up':   'accordion-up 0.2s ease-out',
				'crack':          'crack 0.7s ease-in-out',
				'fade-in-up':     'fade-in-up 0.6s ease-out both',
				'shimmer':        'shimmer 3s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
