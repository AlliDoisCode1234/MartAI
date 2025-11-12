import React from 'react';
import { Button } from '@chakra-ui/react';

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ children, variant = 'primary', onClick }) => {
  if (variant === 'primary') {
    return (
      <Button bg="orange.500" color="white" size="lg" borderRadius="md" _hover={{ bg: 'orange.600' }} onClick={onClick}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="outline" borderColor="gray.300" color="gray.700" size="lg" borderRadius="md" onClick={onClick}>
      {children}
    </Button>
  );
};

