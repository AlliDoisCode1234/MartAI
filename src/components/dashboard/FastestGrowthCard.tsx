'use client';

/**
 * FastestGrowthCard
 *
 * Component Hierarchy:
 * App → Dashboard → FastestGrowthCard (this file)
 *
 * Growth opportunities + Quick Actions sidebar.
 */

import { Box, VStack, HStack, Text, Icon, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiZap, FiTarget, FiEdit3, FiCalendar, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const MotionBox = motion(Box);

type Props = {
  firstPageReadyCount: number;
  contentRefreshCount: number;
};

type QuickAction = {
  label: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
  iconColor: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Track Keywords',
    subtitle: 'Track Performance',
    href: '/studio/keywords',
    icon: FiTarget,
    iconColor: '#60a5fa',
  },
  {
    label: 'Write Content',
    subtitle: 'Get New Traffic',
    href: '/studio/create',
    icon: FiEdit3,
    iconColor: '#34d399',
  },
  {
    label: 'View Calendar',
    subtitle: 'See Publishing Plan',
    href: '/studio/calendar',
    icon: FiCalendar,
    iconColor: '#a78bfa',
  },
];

export function FastestGrowthCard({ firstPageReadyCount, contentRefreshCount }: Props) {
  const hasOpportunities = firstPageReadyCount > 0 || contentRefreshCount > 0;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      h="100%"
    >
      <VStack align="stretch" spacing={4} h="100%">
        {/* Growth Opportunities */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderLeft="3px solid #F99F2A"
          boxShadow="0 2px 12px rgba(0, 0, 0, 0.08)"
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
        >
          <VStack align="stretch" spacing={3}>
            <HStack spacing={2}>
              <Icon as={FiZap} color="#F99F2A" boxSize={4} />
              <Text color="gray.800" fontWeight="semibold" fontSize="sm">
                Fastest Growth{' '}
                <Text as="span" color="gray.400" fontWeight="normal">
                  Opportunities
                </Text>
              </Text>
            </HStack>

            {hasOpportunities ? (
              <VStack align="start" spacing={2} pl={2}>
                {firstPageReadyCount > 0 && (
                  <HStack spacing={2}>
                    <Box w="6px" h="6px" borderRadius="full" bg="#34d399" />
                    <Text color="gray.600" fontSize="xs">
                      <Text as="span" fontWeight="bold" color="gray.800">
                        {firstPageReadyCount}
                      </Text>{' '}
                      {firstPageReadyCount === 1
                        ? 'Keyword is 1st Page Ready'
                        : 'Keywords are 1st Page Ready'}
                    </Text>
                  </HStack>
                )}
                {contentRefreshCount > 0 && (
                  <HStack spacing={2}>
                    <Box w="6px" h="6px" borderRadius="full" bg="#F99F2A" />
                    <Text color="gray.600" fontSize="xs">
                      <Text as="span" fontWeight="bold" color="gray.800">
                        {contentRefreshCount}
                      </Text>{' '}
                      {contentRefreshCount === 1
                        ? 'Blog Post is Ready for a Refresh'
                        : 'Blog Posts are Ready for a Refresh'}
                    </Text>
                  </HStack>
                )}
              </VStack>
            ) : (
              <Text color="gray.500" fontSize="xs" pl={2}>
                Sync your data to discover growth opportunities
              </Text>
            )}

            <Link href="/studio/create">
              <Button
                size="sm"
                bg="linear-gradient(135deg, #e53e3e 0%, #F99F2A 100%)"
                color="white"
                w="100%"
                rightIcon={<FiArrowRight />}
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 20px rgba(249, 159, 42, 0.3)',
                }}
                transition="all 0.3s"
                fontWeight="semibold"
                fontSize="sm"
              >
                Create Content
              </Button>
            </Link>
          </VStack>
        </Box>

        {/* Quick Actions */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderLeft="3px solid #34d399"
          boxShadow="0 2px 12px rgba(0, 0, 0, 0.08)"
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
          flex={1}
        >
          <VStack align="stretch" spacing={3}>
            <HStack spacing={2}>
              <Icon as={FiZap} color="#34d399" boxSize={4} />
              <Text color="gray.800" fontWeight="semibold" fontSize="sm">
                Quick Actions
              </Text>
            </HStack>

            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href}>
                <HStack
                  spacing={3}
                  p={2}
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
                  transition="all 0.2s"
                >
                  <Box p={2} borderRadius="lg" bg={`${action.iconColor}15`}>
                    <Icon as={action.icon} boxSize={4} color={action.iconColor} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text color="gray.800" fontSize="xs" fontWeight="semibold">
                      {action.label}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {action.subtitle}
                    </Text>
                  </VStack>
                </HStack>
              </Link>
            ))}
          </VStack>
        </Box>
      </VStack>
    </MotionBox>
  );
}
