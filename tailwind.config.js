/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Blade Runner × TradingView × Notion Design Tokens
      colors: {
        // Core Brand Palette
        brand: '#FF6200',        // Primary brand orange
        accent: '#00FF66',       // Neon green accent
        cyan: '#00E5FF',         // Cyan accent for highlights
        
        // Surfaces & Backgrounds
        bg: {
          DEFAULT: '#0A0A0A',    // Deep black background
          elevated: '#121212',   // Slightly elevated surface
          card: '#1A1A1A',       // Card background
        },
        surface: {
          DEFAULT: '#121212',
          hover: '#1A1A1A',
          active: '#222222',
        },
        
        // Text Hierarchy
        text: {
          primary: '#E6EEF2',    // Primary text
          secondary: '#C5F6FF',  // Secondary/muted text
          tertiary: '#8899A6',   // Tertiary text
          mono: '#C5F6FF',       // Monospace text
        },
        
        // Trading-specific
        bull: '#00FF66',         // Bullish/long
        bear: '#FF6B6B',         // Bearish/short
        
        // Semantic overlays
        border: {
          DEFAULT: '#2A2A2A',
          subtle: '#1A1A1A',
          accent: '#00FF66',
        },
      },
      
      // Typography Scale (Blade Runner inspired)
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      
      lineHeight: {
        'tight': '1.15',
        'body': '1.45',
        'relaxed': '1.65',
      },
      
      // Spacing (consistent scale)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // Border Radius (softer cyberpunk)
      borderRadius: {
        'sm': '6px',
        'md': '14px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
      },
      
      // Shadows & Glows
      boxShadow: {
        'glow-accent': '0 0 10px rgba(0, 255, 102, 0.22)',
        'glow-brand': '0 0 12px rgba(255, 98, 0, 0.18)',
        'glow-cyan': '0 0 8px rgba(0, 229, 255, 0.2)',
        'card-subtle': '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
        'card-elevated': '0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      
      // Animation Timing (TradingView precision)
      transitionDuration: {
        '140': '140ms',
        '180': '180ms',
        '220': '220ms',
      },
      
      transitionTimingFunction: {
        'soft-out': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      
      // Background Gradients
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF6200 0%, #FF8533 100%)',
        'accent-gradient': 'linear-gradient(135deg, #00FF66 0%, #00CC52 100%)',
        'surface-gradient': 'linear-gradient(180deg, #121212 0%, #0A0A0A 100%)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
      },
      
      // Layout Constraints
      maxWidth: {
        'container': '1240px',
      },
      
      // Typography Plugin Customization
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text.primary'),
            lineHeight: theme('lineHeight.body'),
            fontFamily: theme('fontFamily.sans').join(', '),
            a: {
              color: theme('colors.accent'),
              '&:hover': {
                color: theme('colors.cyan'),
              },
            },
            code: {
              fontFamily: theme('fontFamily.mono').join(', '),
              color: theme('colors.text.mono'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
