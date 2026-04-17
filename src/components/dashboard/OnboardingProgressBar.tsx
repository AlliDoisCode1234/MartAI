
'use client';

import { Box, Flex, Text, VStack, HStack, Icon, Circle, useColorModeValue, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCheck, FiGlobe, FiBarChart2, FiSearch } from 'react-icons/fi';
import { STUDIO_COLORS, STUDIO_GRADIENTS } from '@/lib/constants/studioTokens';

interface OnboardingProgressBarProps {
  hasGA4: boolean;
  hasGSC: boolean;
  readOnly?: boolean;
}

const MotionBox = motion(Box);

export function OnboardingProgressBar({ hasGA4, hasGSC, readOnly = false }: OnboardingProgressBarProps) {
  const router = useRouter();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'gray.100');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const badgeBg = useColorModeValue('orange.50', 'orange.700');
  const badgeColor = useColorModeValue('orange.600', 'orange.200');

  // Logic bounds:
  // Step 1: Website is always assumed connected if they are hitting the Studio dashboard 
  // Step 2: GA4 via hasGA4
  // Step 3: GSC via hasGSC
  
  const steps = [
    { id: 1, title: 'Connect Website', icon: FiGlobe, isCompleted: true },
    { id: 2, title: 'Connect GA4', icon: FiBarChart2, isCompleted: hasGA4 },
    { id: 3, title: 'Connect GSC', icon: FiSearch, isCompleted: hasGSC },
  ];

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const isFinished = completedCount === 3;

  if (isFinished && !readOnly) return null; // Component vanishes completely when finished unless admin

  const handleAction = () => {
    if (readOnly) return;
    router.push('/settings');
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      w="100%"
      mb={6}
    >
      <Box
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        boxShadow="sm"
        position="relative"
        overflow="hidden"
      >
        {/* Subtle accent border at top */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bg={STUDIO_GRADIENTS.amber}
        />

        <VStack align="stretch" spacing={6}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg" color={headingColor}>
                Setup Progress
              </Text>
              <Text color={subTextColor} fontSize="sm">
                Connect your platforms to unlock the dashboard and generate metrics.
              </Text>
            </VStack>
            <Box bg={badgeBg} color={badgeColor} px={3} py={1} borderRadius="full" fontSize="sm" fontWeight="bold">
              {completedCount} / 3 Completed
            </Box>
          </Flex>

          {/* Stepper Railroad Track */}
          <Flex 
            justify="space-between" 
            align="flex-start" 
            position="relative" 
            mt={2}
          >
            {/* The background track line */}
            <Box 
               position="absolute"
               top="24px" // align with middle of the circle
               left="10%"
               right="10%"
               h="2px"
               bg="gray.200"
               zIndex={0}
            />
            {/* The active track line */}
            <Box 
               position="absolute"
               top="24px"
               left="10%"
               w={`${(completedCount - 1) * 40}%`}
               h="2px"
               bg="orange.400"
               zIndex={0}
               transition="width 0.5s ease-in-out"
            />

            {steps.map((step) => {
              const active = step.isCompleted;
              return (
                <VStack 
                  key={step.id} 
                  spacing={3} 
                  cursor={readOnly || active ? 'default' : 'pointer'} 
                  onClick={() => !active && handleAction()}
                  onKeyDown={(e) => {
                    if (!active && !readOnly && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleAction();
                    }
                  }}
                  tabIndex={readOnly || active ? -1 : 0}
                  role="button"
                  aria-disabled={readOnly || active}
                  zIndex={1}
                  flex="1"
                  align="center"
                  _hover={!readOnly && !active ? { transform: 'translateY(-2px)' } : {}}
                  transition="all 0.2s"
                >
                  <Circle 
                    size="48px" 
                    bg={active ? 'orange.500' : 'white'} 
                    color={active ? 'white' : 'gray.400'}
                    borderWidth={active ? '0' : '2px'}
                    borderColor={active ? 'transparent' : 'gray.200'}
                    boxShadow={active ? 'md' : 'none'}
                  >
                    <Icon as={active ? FiCheck : step.icon} boxSize={5} />
                  </Circle>
                  <VStack spacing={0} align="center">
                    <Text 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color={active ? 'gray.800' : 'gray.500'}
                      textAlign="center"
                    >
                      {step.title}
                    </Text>
                    {readOnly ? (
                      <Text fontSize="xs" color={active ? 'green.500' : 'red.400'} fontWeight="semibold">
                        {active ? 'Connected' : 'Missing'}
                      </Text>
                    ) : (
                      <Text fontSize="xs" color={active ? 'green.500' : 'orange.500'} fontWeight="semibold">
                        {active ? 'Completed' : 'Action Required'}
                      </Text>
                    )}
                  </VStack>
                </VStack>
              )
            })}
          </Flex>
          
          {!isFinished && !readOnly && (
            <Flex justify="flex-end">
               <Button 
                 variant="link"
                 fontSize="sm" 
                 color="orange.500" 
                 fontWeight="medium" 
                 onClick={handleAction}
                 aria-label="Go to connectors settings page"
                 _hover={{ textDecoration: 'none', color: 'orange.600' }}
               >
                 Go to Connectors &rarr;
               </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
}
