'use client';

/**
 * DashboardHero Component
 *
 * Component Hierarchy:
 * App → Dashboard → DashboardHero (this file)
 *
 * Welcome banner with project name and CTA.
 */

import { Box, HStack, Heading, Text, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

type Props = {
  userName?: string;
  projectName: string;
};

export function DashboardHero({ userName, projectName }: Props) {
  const router = useRouter();

  return (
    <MotionBox
      bg="brand.orange"
      bgGradient="linear(to-r, #FF6B35, #F7931E)"
      borderRadius="2xl"
      p={8}
      color="white"
      boxShadow="xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // @ts-ignore
      transition={{ duration: 0.5 }}
    >
      <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
        <Box>
          <Heading size="lg" mb={2} color="white">
            Welcome back, {userName || 'there'}!
          </Heading>
          <Text fontSize="lg" color="whiteAlpha.900">
            Here's what's happening with <b>{projectName}</b>
          </Text>
        </Box>
        <Button
          bg="whiteAlpha.300"
          _hover={{ bg: 'whiteAlpha.400' }}
          color="white"
          onClick={() => router.push('/strategy')}
          rightIcon={<ArrowForwardIcon />}
        >
          View Strategy
        </Button>
      </HStack>
    </MotionBox>
  );
}
