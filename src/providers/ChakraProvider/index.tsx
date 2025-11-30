'use client';

import { type ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { theme } from '../../theme';

type Props = {
  children: ReactNode;
};

export const ChakraProviderWrapper: React.FC<Props> = ({ children }) => (
  <ChakraProvider theme={theme}>
    {children}
  </ChakraProvider>
);

