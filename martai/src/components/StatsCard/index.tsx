import React from 'react';
import { Box, VStack, HStack } from '@chakra-ui/react';
import { InfoBadge } from '../InfoBadge';
import { StatItem } from '../StatItem';
import { GrowthChart } from '../GrowthChart';

export const StatsCard: React.FC = () => (
  <Box flex={{ base: '1', lg: '0 0 400px' }} w={{ base: 'full', lg: '400px' }}>
    <Box bg="white" p={6} borderRadius="lg" shadow="md" position="relative">
      <InfoBadge variant="live">Live & Automated</InfoBadge>
      <VStack align="start" gap={6} mt={8}>
        <HStack gap={6} w="full">
          <StatItem icon="📈" label="Traffic Growth" value="+247%" iconBg="orange.100" valueColor="orange.500" />
          <StatItem icon="🎯" label="New Leads" value="1,248" iconBg="purple.100" valueColor="purple.500" />
        </HStack>
        <GrowthChart />
      </VStack>
    </Box>
  </Box>
);

