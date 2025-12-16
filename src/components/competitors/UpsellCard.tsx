'use client';

/**
 * UpsellCard Component
 *
 * Component Hierarchy:
 * App → Competitors → UpsellCard (this file)
 *
 * Gradient upsell card for premium features.
 */

import { Card, CardBody, VStack, HStack, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';

const MotionCard = motion(Card);

type Props = {
  onViewPlans: () => void;
};

export function UpsellCard({ onViewPlans }: Props) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      bg="linear-gradient(135deg, #F7941E 0%, #E0183C 100%)"
      borderRadius="xl"
      color="white"
    >
      <CardBody>
        <VStack spacing={4} align="start">
          <HStack>
            <Icon as={FiLock} boxSize={6} />
            <Heading size="md">Unlock Unlimited SERP Analysis</Heading>
          </HStack>
          <Text>
            Upgrade to Growth or Pro to analyze unlimited keywords and discover more competitor
            insights.
          </Text>
          <Button bg="white" color="brand.orange" _hover={{ bg: 'gray.100' }} onClick={onViewPlans}>
            View Plans
          </Button>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
