import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode, type StyleFunctionProps } from '@chakra-ui/theme-tools';

/**
 * MartAI Theme Configuration
 *
 * Design System Standards:
 * - 8px grid spacing system
 * - Semantic color tokens
 * - Mobile-first responsive
 *
 * @see docs/STYLE_GUIDE.md
 * @see docs/BRAND_GUIDE.md
 */

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// ============================================
// SPACING (8px Grid)
// ============================================
const space = {
  px: '1px',
  0: '0',
  0.5: '2px', // 0.5 = 2px (fine-tuning)
  1: '4px', // 1 = 4px (tight)
  2: '8px', // 2 = 8px (base unit)
  3: '12px', // 3 = 12px
  4: '16px', // 4 = 16px (standard)
  5: '20px', // 5 = 20px
  6: '24px', // 6 = 24px (card padding)
  7: '28px', // 7 = 28px
  8: '32px', // 8 = 32px (section)
  10: '40px', // 10 = 40px
  12: '48px', // 12 = 48px
  14: '56px', // 14 = 56px
  16: '64px', // 16 = 64px (page margins)
  20: '80px', // 20 = 80px (hero)
  24: '96px', // 24 = 96px
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
};

// ============================================
// COLORS
// ============================================
const colors = {
  brand: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F56565',
    500: '#E53E3E',
    600: '#C53030',
    700: '#9B2C2C',
    800: '#822727',
    900: '#63171B',
    // Named brand colors
    orange: '#F7941E',
    red: '#E0183C',
    teal: '#40DEC7',
    // Gradients
    gradient: 'linear-gradient(135deg, #F7941E 0%, #E0183C 100%)',
    gradientHover: 'linear-gradient(135deg, #FFAF4B 0%, #FF4D6D 100%)',
  },
  // Semantic background tokens
  bg: {
    light: '#FFFFFF',
    dark: '#1A202C',
    subtle: '#F7FAFC',
    card: {
      light: '#FFFFFF',
      dark: '#2D3748',
    },
  },
};

// ============================================
// TYPOGRAPHY
// ============================================
const fonts = {
  heading: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
};

const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px (base)
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem', // 72px
  '8xl': '6rem', // 96px
  '9xl': '8rem', // 128px
};

const lineHeights = {
  normal: 'normal',
  none: 1,
  shorter: 1.25,
  short: 1.375,
  base: 1.5,
  tall: 1.625,
  taller: 2,
};

// ============================================
// RADII (8px base)
// ============================================
const radii = {
  none: '0',
  sm: '4px', // Small elements
  base: '6px', // Inputs
  md: '8px', // Buttons, badges
  lg: '12px', // Cards
  xl: '16px', // Large cards, modals
  '2xl': '24px', // Hero sections
  full: '9999px', // Pills, avatars
};

// ============================================
// SHADOWS
// ============================================
const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(247, 148, 30, 0.5)', // Brand orange focus
  none: 'none',
};

// ============================================
// TRANSITIONS
// ============================================
const transition = {
  property: {
    common: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
    colors: 'background-color, border-color, color, fill, stroke',
    dimensions: 'width, height',
    position: 'left, right, top, bottom',
    background: 'background-color, background-image, background-position',
  },
  easing: {
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  duration: {
    'ultra-fast': '50ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    'ultra-slow': '500ms',
  },
};

// ============================================
// GLOBAL STYLES
// ============================================
const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'bg.dark' : 'bg.subtle',
      color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      lineHeight: 'base',
    },
    '*::placeholder': {
      color: props.colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.400',
    },
    '*, *::before, *::after': {
      borderColor: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
    },
  }),
};

// ============================================
// COMPONENTS
// ============================================
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'full',
      transition: 'all 0.2s',
    },
    variants: {
      solid: (props: StyleFunctionProps) => ({
        bg: props.colorScheme === 'brand' ? 'brand.gradient' : undefined,
        color: 'white',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.gradientHover' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
          boxShadow: 'sm',
        },
      }),
      gradient: {
        bg: 'brand.gradient',
        color: 'white',
        _hover: {
          bg: 'brand.gradientHover',
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
      outline: {
        borderRadius: 'full',
        borderWidth: '2px',
      },
      ghost: {
        borderRadius: 'full',
      },
    },
    sizes: {
      sm: { h: 8, px: 3, fontSize: 'sm' }, // 32px height
      md: { h: 10, px: 4, fontSize: 'md' }, // 40px height
      lg: { h: 12, px: 6, fontSize: 'lg' }, // 48px height
      xl: { h: 14, px: 8, fontSize: 'xl' }, // 56px height
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg', // 12px
        boxShadow: 'sm',
        transition: 'all 0.2s',
        _hover: {
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        },
      },
    },
    variants: {
      glass: (props: StyleFunctionProps) => ({
        container: {
          bg: mode('whiteAlpha.800', 'whiteAlpha.100')(props),
          backdropFilter: 'blur(10px)',
          borderWidth: '1px',
          borderColor: mode('whiteAlpha.300', 'whiteAlpha.100')(props),
        },
      }),
      elevated: {
        container: {
          boxShadow: 'lg',
          _hover: {
            boxShadow: 'xl',
          },
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      letterSpacing: 'tight',
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'brand.orange',
    },
    variants: {
      outline: {
        field: {
          borderRadius: 'base', // 6px
          _focus: {
            borderColor: 'brand.orange',
            boxShadow: 'outline',
          },
        },
      },
    },
  },
};

// ============================================
// EXPORT THEME
// ============================================
export const theme = extendTheme({
  config,
  space,
  colors,
  fonts,
  fontSizes,
  lineHeights,
  radii,
  shadows,
  transition,
  styles,
  components,
});
