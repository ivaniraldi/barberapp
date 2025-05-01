import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme"; // Import default theme for fonts

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: { // Use extend to add to existing theme
        fontFamily: {
            // Removed Geist Sans and Mono as they are not installed
            sans: [...fontFamily.sans],
            mono: [...fontFamily.mono],
            // Example: Add custom elegant fonts if you defined them in globals.css
            // primary: ['var(--font-primary)', ...fontFamily.sans],
            // secondary: ['var(--font-secondary)', ...fontFamily.sans],
        },
        colors: {
            background: 'hsl(var(--background))', // Updated reference
            foreground: 'hsl(var(--foreground))', // Updated reference
            card: {
                DEFAULT: 'hsl(var(--card))', // Updated reference
                foreground: 'hsl(var(--card-foreground))' // Updated reference
            },
            popover: {
                DEFAULT: 'hsl(var(--popover))', // Updated reference
                foreground: 'hsl(var(--popover-foreground))' // Updated reference
            },
            primary: {
                DEFAULT: 'hsl(var(--primary))', // Updated reference
                foreground: 'hsl(var(--primary-foreground))' // Updated reference
            },
            secondary: {
                DEFAULT: 'hsl(var(--secondary))', // Updated reference
                foreground: 'hsl(var(--secondary-foreground))' // Updated reference
            },
            muted: {
                DEFAULT: 'hsl(var(--muted))', // Updated reference
                foreground: 'hsl(var(--muted-foreground))' // Updated reference
            },
            accent: {
                DEFAULT: 'hsl(var(--accent))', // Updated reference
                foreground: 'hsl(var(--accent-foreground))' // Updated reference
            },
            destructive: {
                DEFAULT: 'hsl(var(--destructive))', // Updated reference
                foreground: 'hsl(var(--destructive-foreground))' // Updated reference
            },
            border: 'hsl(var(--border))', // Updated reference
            input: 'hsl(var(--input))', // Updated reference
            ring: 'hsl(var(--ring))', // Updated reference
            chart: {
                '1': 'hsl(var(--chart-1))',
                '2': 'hsl(var(--chart-2))',
                '3': 'hsl(var(--chart-3))',
                '4': 'hsl(var(--chart-4))',
                '5': 'hsl(var(--chart-5))'
            },
            sidebar: { // Updated sidebar colors
                DEFAULT: 'hsl(var(--sidebar-background))',
                foreground: 'hsl(var(--sidebar-foreground))',
                primary: 'hsl(var(--sidebar-primary))',
                'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                accent: 'hsl(var(--sidebar-accent))',
                'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                border: 'hsl(var(--sidebar-border))',
                ring: 'hsl(var(--sidebar-ring))'
            }
        },
        borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)'
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
            // Custom animations defined in globals.css can be referenced here if needed
            'subtle-pulse': { // Updated pulse keyframe
                '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                '50%': { opacity: '0.75', transform: 'scale(1.02)' },
            },
             'subtle-glow': { // Updated glow keyframe
               'from': { 'box-shadow': '0 0 4px 0px hsla(var(--accent) / 0.1)' },
               'to': { 'box-shadow': '0 0 12px 2px hsla(var(--accent) / 0.2)' },
             }
        },
        animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
            // Make custom animations available as utilities
            'subtle-pulse': 'subtle-pulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Updated animation duration
            'subtle-glow': 'subtle-glow 3.5s ease-in-out infinite alternate', // Updated animation duration
        }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

