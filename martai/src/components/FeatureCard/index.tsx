'use client';

import { type FC } from 'react';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';

type Props = {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
};

export const FeatureCard: FC<Props> = ({ icon, title, description, iconBg }) => (
  <VStack
    spacing={4}
    p={6}
    bg="white"
    borderRadius="lg"
    shadow="sm"
    align="start"
    h="full"
    transition="all 0.3s ease"
    _hover={{
      shadow: 'xl',
      transform: 'translateY(-4px)',
      borderColor: 'orange.200',
      borderWidth: '1px',
    }}
    cursor="pointer"
  >
    <Box w={12} h={12} bg={iconBg} borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontSize="xl">
      {icon}
    </Box>
    <Heading size="md" fontWeight="bold">{title}</Heading>
    <Text fontSize="sm" color="gray.600">{description}</Text>
  </VStack>
);

