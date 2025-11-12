'use client';

import { type FC } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

export const GrowthChart: FC = () => {
  const heights = [40, 50, 60, 70, 80, 90, 100];
  const gradientColors = [
    ['#FBD38D', '#F6AD55'], // orange.300 to orange.400
    ['#F6AD55', '#ED8936'], // orange.400 to orange.500
    ['#ED8936', '#DD6B20'], // orange.500 to orange.600
    ['#ED8936', '#DD6B20'], // orange.500 to orange.600
    ['#DD6B20', '#C05621'], // orange.600 to orange.700
    ['#DD6B20', '#C05621'], // orange.600 to orange.700
    ['#C05621', '#9C4221']  // orange.700 to orange.800
  ];

  return (
    <Box w="full" mt={4}>
      <HStack w="full" justify="space-between" mb={2} fontSize="xs" color="gray.600">
        <Text>Week 1</Text>
        <Text>Week 7</Text>
      </HStack>
      <HStack spacing={1} align="end" h="120px">
        {[1, 2, 3, 4, 5, 6, 7].map((week, i) => (
          <Box
            key={week}
            flex={1}
            h={`${heights[i]}px`}
            borderRadius="md"
            style={{
              background: `linear-gradient(to top, ${gradientColors[i][0]}, ${gradientColors[i][1]})`
            }}
          />
        ))}
      </HStack>
    </Box>
  );
};

