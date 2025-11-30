
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

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
    orange: '#F7941E',
    teal: '#40DEC7',
    gradient: 'linear-gradient(135deg, #F7941E 0%, #E0183C 100%)',
    gradientHover: 'linear-gradient(135deg, #FFAF4B 0%, #FF4D6D 100%)',
  },
  bg: {
    light: '#FFFFFF',
    dark: '#1A202C',
    subtle: '#F7FAFC',
  },
};

const fonts = {
  heading: 'Poppins, sans-serif',
  body: 'Inter, sans-serif',
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode('gray.50', 'gray.900')(props),
      color: mode('gray.800', 'whiteAlpha.900')(props),
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'full',
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorScheme === 'brand' ? 'brand.gradient' : undefined,
        color: 'white',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.gradientHover' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
      }),
      outline: {
        borderRadius: 'full',
        borderWidth: '2px',
      },
      ghost: {
        borderRadius: 'full',
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
        transition: 'all 0.2s',
        _hover: {
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        },
      },
    },
    variants: {
      glass: (props: any) => ({
        container: {
          bg: mode('whiteAlpha.800', 'whiteAlpha.100')(props),
          backdropFilter: 'blur(10px)',
          borderWidth: '1px',
          borderColor: mode('whiteAlpha.300', 'whiteAlpha.100')(props),
        },
      }),
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      letterSpacing: 'tight',
    },
  },
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
});
