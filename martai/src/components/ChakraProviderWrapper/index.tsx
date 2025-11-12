'use client';

import { type ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        px: 6,
        py: 3,
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

