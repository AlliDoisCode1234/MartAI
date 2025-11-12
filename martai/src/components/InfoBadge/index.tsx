import React from 'react';
import { Badge } from '@chakra-ui/react';

interface InfoBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'live';
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({ children, variant = 'primary' }) => {
  if (variant === 'live') {
    return (
      <Badge position="absolute" top={4} right={4} bg="orange.500" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
        ⚡ {children}
      </Badge>
    );
  }
  return (
    <Badge bg="orange.50" color="gray.800" px={4} py={1.5} borderRadius="lg" fontSize="xs" fontWeight="medium" border="1px solid" borderColor="orange.200">
      {children}
    </Badge>
  );
};

