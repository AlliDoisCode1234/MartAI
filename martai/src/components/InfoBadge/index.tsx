'use client';

import { type FC, type ReactNode } from 'react';
import { Badge } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'live';
};

export const InfoBadge: FC<Props> = ({ children, variant = 'primary' }) => {
  if (variant === 'live') {
    return (
      <Badge position="absolute" top={4} right={4} bg="brand.orange" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
        ⚡ {children}
      </Badge>
    );
  }
  return (
    <Badge bg="brand.orange" bgOpacity={0.1} color="gray.800" px={4} py={1.5} borderRadius="lg" fontSize="xs" fontWeight="medium" border="1px solid" borderColor="brand.orange" borderOpacity={0.3}>
      {children}
    </Badge>
  );
};

