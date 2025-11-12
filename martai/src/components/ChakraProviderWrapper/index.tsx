'use client';

import { type ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      orange: '#F7941E',
      red: '#E0183C',
      teal: '#40DEC7',
      light: '#F4EDED',
      lavender: '#DEC1FF',
    },
  },
  fonts: {
    heading: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  components: {
    Button: {
      defaultProps: {
        px: 6,
        py: 3,
      },
      variants: {
        gradient: {
          bgGradient: 'linear(to-r, brand.orange, brand.teal)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, #E8851A, #3AD4B8)',
          },
        },
      },
    },
  },
});

type Props = {
  children: ReactNode;
};

export const ChakraProviderWrapper: React.FC<Props> = ({ children }) => (
  <ChakraProvider theme={theme}>
    {children}
  </ChakraProvider>
);

