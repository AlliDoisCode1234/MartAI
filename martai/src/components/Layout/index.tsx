'use client';

import { type FC, type ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { Navigation } from '../Navigation';

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => (
  <Box minH="100vh" w="100%" bg="brand.light">
    <Navigation />
    {children}
  </Box>
);

