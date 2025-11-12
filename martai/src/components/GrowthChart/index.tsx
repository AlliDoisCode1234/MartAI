import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

export const GrowthChart: React.FC = () => {
  const heights = [40, 50, 60, 70, 80, 90, 100];
  const gradients = [
    'linear(to-t, orange.400, orange.300)',
    'linear(to-t, orange.500, orange.400)',
    'linear(to-t, orange.600, orange.500)',
    'linear(to-t, orange.600, orange.500)',
    'linear(to-t, orange.700, orange.600)',
    'linear(to-t, orange.700, orange.600)',
    'linear(to-t, orange.800, orange.700)'
  ];

  return (
    <Box w="full" mt={4}>
      <HStack w="full" justify="space-between" mb={2} fontSize="xs" color="gray.600">
        <Text>Week 1</Text>
        <Text>Week 7</Text>
      </HStack>
      <HStack gap={1} align="end" h="120px">
        {[1, 2, 3, 4, 5, 6, 7].map((week, i) => (
          <Box
            key={week}
            flex={1}
            bgGradient={gradients[i]}
            h={`${heights[i]}px`}
            borderRadius="md"
          />
        ))}
      </HStack>
    </Box>
  );
};

