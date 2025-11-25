'use client';

import { type FC, type ReactNode } from 'react';
import { Box, Container } from '@chakra-ui/react';

type PageContainerProps = {
  children: ReactNode;
  maxW?: string;
  py?: number | object;
  px?: number | object;
  fullHeight?: boolean;
};

export const PageContainer: FC<PageContainerProps> = ({
  children,
  maxW = 'container.xl',
  py = { base: 8, md: 12 },
  px = { base: 4, sm: 6, md: 8, lg: 12 },
  fullHeight = false,
}) => {
  return (
    <Box minH={fullHeight ? '100vh' : 'calc(100vh - 64px)'} bg="brand.light">
      <Container maxW={maxW} py={py} px={px}>
        {children}
      </Container>
    </Box>
  );
};

