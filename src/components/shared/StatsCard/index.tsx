'use client';

import { type FC } from 'react';
import { Box, VStack, HStack } from '@chakra-ui/react';
import { InfoBadge } from '../InfoBadge';
import { StatItem } from '../StatItem';
import { GrowthChart } from '@/src/components/GrowthChart';

export const StatsCard: FC = () => (
  <Box flex={{ base: '1', lg: '0 0 400px' }} w={{ base: 'full', lg: '400px' }}>
    <Box bg="white" p={6} borderRadius="lg" shadow="md" position="relative">
      <InfoBadge variant="live">Live & Automated</InfoBadge>
      <VStack align="start" spacing={6} mt={8}>
        <HStack spacing={6} w="full">
          <StatItem icon="📈" label="Traffic Growth" value="+247%" iconBg="orange.100" valueColor="brand.orange" />
          <StatItem icon="🎯" label="New Leads" value="1,248" iconBg="purple.100" valueColor="purple.500" />
        </HStack>
        <GrowthChart />
      </VStack>
    </Box>
  </Box>
);

