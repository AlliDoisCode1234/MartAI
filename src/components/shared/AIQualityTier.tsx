'use client';

/**
 * AIQualityTier Selector
 *
 * Component Hierarchy:
 * App → Content → TemplateBasedBriefCreator → AIQualityTier (this file)
 *
 * Reusable component for selecting AI model quality tier.
 * Follows 2025 best practices: radio buttons (not dropdown), show cost/speed, smart defaults.
 */

import { Box, Flex, Text, RadioGroup, Radio, VStack, HStack, Badge, Icon } from '@chakra-ui/react';
import { FiZap, FiCheck, FiStar } from 'react-icons/fi';

export type TaskTier = 'cheap' | 'standard' | 'premium';

interface TierOption {
  id: TaskTier;
  name: string;
  description: string;
  icon: typeof FiZap;
  color: string;
  speed: string;
  cost: string;
  recommended?: boolean;
}

const TIER_OPTIONS: TierOption[] = [
  {
    id: 'cheap',
    name: 'Fast',
    description: 'Quick summaries, translations, simple edits',
    icon: FiZap,
    color: 'green',
    speed: 'Fastest',
    cost: '$',
  },
  {
    id: 'standard',
    name: 'Balanced',
    description: 'Blog posts, articles, briefs',
    icon: FiCheck,
    color: 'blue',
    speed: 'Fast',
    cost: '$$',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Complex analysis, long-form, reasoning',
    icon: FiStar,
    color: 'purple',
    speed: 'Slower',
    cost: '$$$',
  },
];

interface Props {
  value: TaskTier;
  onChange: (tier: TaskTier) => void;
  showAdvanced?: boolean;
}

export function AIQualityTier({ value, onChange, showAdvanced = false }: Props) {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="medium" color="gray.300">
          AI Quality Tier
        </Text>
        {!showAdvanced && (
          <Badge colorScheme="gray" fontSize="xs" variant="subtle">
            Auto-optimized
          </Badge>
        )}
      </Flex>

      <RadioGroup value={value} onChange={(v: TaskTier) => onChange(v)}>
        <VStack align="stretch" spacing={2}>
          {TIER_OPTIONS.map((tier) => (
            <Box
              key={tier.id}
              as="label"
              cursor="pointer"
              bg={value === tier.id ? `${tier.color}.900` : 'whiteAlpha.50'}
              border="1px solid"
              borderColor={value === tier.id ? `${tier.color}.500` : 'whiteAlpha.100'}
              borderRadius="lg"
              p={3}
              transition="all 0.2s"
              _hover={{
                borderColor: `${tier.color}.400`,
                bg: value === tier.id ? `${tier.color}.900` : 'whiteAlpha.100',
              }}
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={3}>
                  <Radio value={tier.id} colorScheme={tier.color} />
                  <Icon as={tier.icon} color={`${tier.color}.400`} />
                  <Box>
                    <HStack spacing={2}>
                      <Text fontWeight="medium" color="white">
                        {tier.name}
                      </Text>
                      {tier.recommended && (
                        <Badge colorScheme="blue" fontSize="xs">
                          Recommended
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.400">
                      {tier.description}
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      Speed
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      {tier.speed}
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      Cost
                    </Text>
                    <Text fontSize="sm" color={tier.color === 'green' ? 'green.400' : 'gray.300'}>
                      {tier.cost}
                    </Text>
                  </Box>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      </RadioGroup>

      <Text fontSize="xs" color="gray.500" mt={2}>
        Tier affects model selection. Standard is best for most content.
      </Text>
    </Box>
  );
}
