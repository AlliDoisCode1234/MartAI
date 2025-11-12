'use client';

import { type FC, type ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export const CTAButton: FC<Props> = ({ children, variant = 'primary', onClick }) => {
  if (variant === 'primary') {
    return (
      <Button bg="orange.500" color="white" size="lg" borderRadius="md" px={6} py={3} _hover={{ bg: 'orange.600' }} onClick={onClick}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="outline" borderColor="gray.300" color="gray.700" size="lg" borderRadius="md" px={6} py={3} onClick={onClick}>
      {children}
    </Button>
  );
};

