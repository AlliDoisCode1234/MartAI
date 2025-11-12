import React from 'react';
import { VStack, HStack, Text, Heading, Box } from '@chakra-ui/react';

interface StatItemProps {
  icon: string;
  label: string;
  value: string;
  iconBg: string;
  valueColor: string;
}

export const StatItem: React.FC<StatItemProps> = ({ icon, label, value, iconBg, valueColor }) => (
  <VStack align="start" gap={1}>
    <HStack gap={2}>
      <Box w={6} h={6} bg={iconBg} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xs">{icon}</Text>
      </Box>
      <Text fontSize="xs" color="gray.600">{label}</Text>
    </HStack>
    <Heading size="xl" color={valueColor} fontWeight="bold">{value}</Heading>
  </VStack>
);

