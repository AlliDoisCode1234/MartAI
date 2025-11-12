import React from 'react';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, iconBg }) => (
  <VStack gap={4} p={6} bg="white" borderRadius="lg" shadow="sm" align="start" h="full">
    <Box w={12} h={12} bg={iconBg} borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontSize="xl">
      {icon}
    </Box>
    <Heading size="md" fontWeight="bold">{title}</Heading>
    <Text fontSize="sm" color="gray.600">{description}</Text>
  </VStack>
);

