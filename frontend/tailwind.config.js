/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './examples/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui CSS variable-based colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        'orange': {
          DEFAULT: '#FF7425',
          300: '#FFBB80',
          400: '#FFA14D',
          500: '#FF7425',
          600: '#E05E12',
        },
        'blue': {
          DEFAULT: '#0066FF',
          300: '#66D9FF',
          400: '#3092FF',
          500: '#0066FF',
          700: '#003E9A',
        },
        'gold': {
          DEFAULT: '#EABB54', 
          500: '#EABB54',
        },
        'red': {
          DEFAULT: '#f02024', 
        },
        'dark': {
          DEFAULT: '#090F1A', 
          400: '#0D1424',
          500: '#090F1A',
          600: '#070B14',
          700: '#050A14',
        },
        'portal-glow': '#FF5522',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        roboto: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        tech: ['Orbitron', 'monospace'],
        monderna: ['Monderna', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue':
          '0 0 5px rgba(0, 102, 255, 0.5), 0 0 15px rgba(0, 102, 255, 0.3)',
        'neon-orange':
          '0 0 5px rgba(255, 116, 37, 0.5), 0 0 15px rgba(255, 116, 37, 0.3)',
        'portal-glow':
          '0 0 40px rgba(255, 85, 34, 0.8), 0 0 80px rgba(255, 85, 34, 0.4)',
        glass: '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'portal-radial':
          'radial-gradient(circle at center, #FF5522, transparent 70%)',
        'mascot-gradient':
          'linear-gradient(135deg, rgba(255, 116, 37, 0.2), rgba(0, 102, 255, 0.2))',
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow-blue': 'glow-blue 2s ease-in-out infinite alternate',
        'glow-orange': 'glow-orange 2s ease-in-out infinite alternate',
        'glow-gold': 'glow-gold 2s ease-in-out infinite alternate',
        float: 'float 6s ease-in-out infinite',
        'portal-pulse': 'portal-pulse 4s ease-in-out infinite',
        'atmosphere-shift': 'atmosphere-shift 20s ease infinite',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        slideDown: {
          from: { height: '0px' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0px' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'glow-blue': {
          '0%': { textShadow: '0 0 5px rgba(0, 102, 255, 0.5)' },
          '100%': { textShadow: '0 0 15px rgba(0, 102, 255, 0.8)' },
        },
        'glow-orange': {
          '0%': { textShadow: '0 0 5px rgba(255, 116, 37, 0.5)' },
          '100%': { textShadow: '0 0 15px rgba(255, 116, 37, 0.8)' },
        },
        'glow-gold': {
          '0%': { textShadow: '0 0 5px rgba(234, 187, 84, 0.5)' },
          '100%': { textShadow: '0 0 15px rgba(234, 187, 84, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'portal-pulse': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        'atmosphere-shift': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        portal: '150px 150px 0 0 / 170px 170px 0 0',
      },
      scale: {
        103: '1.03',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': '0 0 4px rgba(0, 0, 0, 0.5)',
        },
        '.clip-path-portal': {
          'clip-path': 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
