'use client';

/**
 * FoundingMemberBadge
 *
 * Component Hierarchy: Profile/Header > FoundingMemberBadge
 *
 * Displays a permanent "Founding Member" badge for beta cohort users.
 * This badge never expires and shows the cohort (e.g., "Beta 2026").
 */

import { Badge, HStack, Icon, Text } from '@chakra-ui/react';
import { LuCrown } from 'react-icons/lu';

interface Props {
  cohort?: string;
  size?: 'sm' | 'md';
}

export function FoundingMemberBadge({ cohort = 'Beta 2026', size = 'md' }: Props) {
  const iconSize = size === 'sm' ? 12 : 16;
  const fontSize = size === 'sm' ? 'xs' : 'sm';
  // cohort is available for future tooltip or display
  void cohort;

  return (
    <Badge
      colorScheme="yellow"
      variant="subtle"
      px={size === 'sm' ? 2 : 3}
      py={1}
      borderRadius="full"
      cursor="default"
      title={`You're part of the ${cohort} cohort - thank you for being an early believer!`}
    >
      <HStack gap={1}>
        <Icon boxSize={iconSize + 'px'} color="yellow.500">
          <LuCrown />
        </Icon>
        <Text fontSize={fontSize} fontWeight="semibold">
          Founding Member
        </Text>
      </HStack>
    </Badge>
  );
}

export default FoundingMemberBadge;
