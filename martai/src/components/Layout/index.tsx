import { type FC, type ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => (
  <Box minH="100vh" w="100%">
    {children}
  </Box>
);

