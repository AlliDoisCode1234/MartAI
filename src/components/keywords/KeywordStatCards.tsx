'use client';

/**
 * KeywordStatCards
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordStatCards (this file)
 *
 * 4 actionable stat cards that double as table filters.
 * Clicking a card filters the keyword table below to the relevant subset.
 * Active card is visually highlighted with colored border and background.
 */

import { SimpleGrid, Box, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiSearch, FiZap, FiLayers, FiList } from 'react-icons/fi';
import { MetricTooltip } from '@/src/components/shared';

const MotionBox = motion(Box);

type CardFilter = 'all' | 'ranking' | 'quickwins' | 'unclustered';

type Props = {
  total: number;
  rankingOnGoogle: number;
  quickWins: number;
  unclustered: number;
  activeFilter: CardFilter;
  onFilterChange: (filter: CardFilter) => void;
};

const CARDS: Array<{
  key: CardFilter;
  label: string;
  sublabel: string;
  icon: typeof FiList;
  accentColor: string;
  borderColor: string;
  bgActive: string;
  metricKey: string;
}> = [
  {
    key: 'all',
    label: 'Total Keywords',
    sublabel: 'All tracked keywords',
    icon: FiList,
    accentColor: '#78716c',
    borderColor: '#78716c',
    bgActive: 'rgba(120, 113, 108, 0.06)',
    metricKey: 'total-keywords',
  },
  {
    key: 'ranking',
    label: 'Ranking on Google',
    sublabel: 'Keywords with GSC position data',
    icon: FiSearch,
    accentColor: '#0d9488',
    borderColor: '#0d9488',
    bgActive: 'rgba(13, 148, 136, 0.06)',
    metricKey: 'ranking-keywords',
  },
  {
    key: 'quickwins',
    label: 'Quick Wins',
    sublabel: 'Low effort, high opportunity',
    icon: FiZap,
    accentColor: '#F99F2A',
    borderColor: '#F99F2A',
    bgActive: 'rgba(249, 159, 42, 0.06)',
    metricKey: 'quick-wins',
  },
  {
    key: 'unclustered',
    label: 'Unclustered',
    sublabel: 'Not assigned to any group',
    icon: FiLayers,
    accentColor: '#475569',
    borderColor: '#475569',
    bgActive: 'rgba(71, 85, 105, 0.06)',
    metricKey: 'unclustered-keywords',
  },
];

function getCount(key: CardFilter, props: Props): number {
  switch (key) {
    case 'all':
      return props.total;
    case 'ranking':
      return props.rankingOnGoogle;
    case 'quickwins':
      return props.quickWins;
    case 'unclustered':
      return props.unclustered;
  }
}

export function KeywordStatCards(props: Props) {
  const { activeFilter, onFilterChange } = props;

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
      {CARDS.map((card, index) => {
        const count = getCount(card.key, props);
        const isActive = activeFilter === card.key;

        return (
          <MotionBox
            key={card.key}
            position="relative"
            overflow="hidden"
            bg={isActive ? card.bgActive : 'white'}
            border="1px solid"
            borderColor={isActive ? card.borderColor : 'gray.200'}
            borderLeft={`3px solid ${card.accentColor}`}
            borderRadius="xl"
            p={5}
            boxShadow={
              isActive
                ? `0 2px 12px rgba(0, 0, 0, 0.1)`
                : '0 2px 12px rgba(0, 0, 0, 0.06)'
            }
            cursor="pointer"
            onClick={() => onFilterChange(card.key)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.06 }}
            _hover={{
              borderColor: card.borderColor,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
            sx={{
              transition: 'all 0.2s ease',
            }}
          >
            <VStack align="stretch" spacing={2}>
              <HStack spacing={2} align="center">
                <Icon
                  as={card.icon}
                  color={isActive ? card.accentColor : 'gray.400'}
                  boxSize={4}
                  flexShrink={0}
                />
                <Text
                  color={isActive ? 'gray.700' : 'gray.400'}
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {card.label}
                </Text>
                <MetricTooltip metricKey={card.metricKey} size={12} />
              </HStack>
              <HStack spacing={2} align="baseline">
                <Text
                  color={card.accentColor}
                  fontSize="3xl"
                  fontWeight="bold"
                  lineHeight="1"
                >
                  {count}
                </Text>
              </HStack>
              <Text color="gray.400" fontSize="xs">
                {card.sublabel}
              </Text>
            </VStack>
          </MotionBox>
        );
      })}
    </SimpleGrid>
  );
}

export type { CardFilter };
