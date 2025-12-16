'use client';

/**
 * PlanSelectionStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → PlanSelectionStep (this file)
 *
 * Step 2: Plan selection.
 */

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Icon,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCheck, FiStar } from 'react-icons/fi';
import { PLANS } from '@/lib/constants/onboarding';

const MotionBox = motion(Box);

type Props = {
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function PlanSelectionStep({ selectedPlan, onSelectPlan, onNext, onBack }: Props) {
  return (
    <MotionBox
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Icon as={FiStar} boxSize={8} color="brand.orange" mb={2} />
            <Heading size="lg" mb={2}>
              Choose Your Plan
            </Heading>
            <Text color="gray.600">
              Select the plan that fits your needs. You can upgrade anytime.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                cursor="pointer"
                onClick={() => onSelectPlan(plan.id)}
                borderWidth="2px"
                borderColor={selectedPlan === plan.id ? `${plan.color}.500` : 'gray.200'}
                bg={selectedPlan === plan.id ? `${plan.color}.50` : 'white'}
                _hover={{ borderColor: `${plan.color}.300` }}
                transition="all 0.2s"
                position="relative"
              >
                {'popular' in plan && plan.popular && (
                  <Badge
                    position="absolute"
                    top={-2}
                    right={-2}
                    colorScheme="purple"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    Popular
                  </Badge>
                )}
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    <Heading size="md" color={`${plan.color}.600`}>
                      {plan.name}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold">
                      {plan.price}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {plan.description}
                    </Text>
                    <VStack align="start" spacing={1} pt={2}>
                      {plan.features.map((f) => (
                        <HStack key={f} spacing={2}>
                          <Icon as={FiCheck} color="green.500" boxSize={4} />
                          <Text fontSize="sm">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <HStack justify="space-between" pt={4}>
            <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={onBack}>
              Back
            </Button>
            <Button colorScheme="orange" rightIcon={<FiArrowRight />} onClick={onNext} size="lg">
              Continue
            </Button>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
