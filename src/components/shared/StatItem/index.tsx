import { type FC } from 'react';
import { VStack, HStack, Text, Heading, Box } from '@chakra-ui/react';

type Props = {
  icon: string;
  label: string;
  value: string;
  iconBg: string;
  valueColor: string;
};

export const StatItem: FC<Props> = ({ icon, label, value, iconBg, valueColor }) => (
  <VStack align="start" spacing={1}>
    <HStack spacing={2}>
      <Box w={6} h={6} bg={iconBg} borderRadius="md" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xs">{icon}</Text>
      </Box>
      <Text fontSize="xs" color="gray.600">{label}</Text>
    </HStack>
    <Heading size="xl" color={valueColor} fontWeight="bold">{value}</Heading>
  </VStack>
);

