import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate'; // Changed from require

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['MiSans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      colors: {
        // Original HTML colors
        'primary-light': '#89FFE6',
        'primary-html': '#4EBFFF', // Renamed to avoid conflict if shadcn 'primary' is kept
        'primary-dark': '#6941FF',
        'success-html': '#10B981',
        'warning-html': '#F59E0B',
        'danger-html': '#EF4444',
        'info-html': '#3B82F6',
        'text-primary-html': '#1F2937',
        'text-secondary-html': '#6B7280',
        'text-light-html': '#9CA3AF',
        'bg-card-html': '#FFFFFF',
        'bg-main-html': '#F9FAFB', // This will be our default body bg
        'bg-sidebar-html': '#1E293B',
        'bg-sidebar-grad-end': '#0F172A', // For sidebar gradient

        // shadcn/ui variables - we can override these in index.css or map them here
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))', // Should map to bg-main-html
        foreground: 'hsl(var(--foreground))', // Should map to text-primary-html
        primary: {
          DEFAULT: 'hsl(var(--primary))', // This will be controlled by index.css :root
          foreground: 'hsl(var(--primary-foreground))',
          // We can add our specific shades if needed, or rely on index.css overrides
          // light: '#89FFE6', // Example if we want to use primary.light
          // DEFAULT: '#4EBFFF',
          // dark: '#6941FF',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))', // Can map to danger-html
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))', // Can map to bg-card-html
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)', // Default shadcn
        md: 'calc(var(--radius) - 2px)', // Default shadcn
        sm: 'calc(var(--radius) - 4px)', // Default shadcn
        DEFAULT: '20px', // from --border-radius
        xl: '20px', // alias for default from original html
      },
      boxShadow: {
        'sm-html': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md-html': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg-html': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate], // Changed from require
} satisfies Config;

export default config;