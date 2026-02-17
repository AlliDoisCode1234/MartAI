'use client';

/**
 * IntentBadge
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordTable -> IntentBadge (this file)
 *
 * Solid colored intent pill with white text — matching the mockup exactly.
 * Each intent type has a distinct saturated background color.
 */

import { Badge } from '@chakra-ui/react';

type Props = {
  intent: string | null;
};

const INTENT_STYLES: Record<string, { bg: string; label: string }> = {
  commercial: { bg: '#d97706', label: 'COMMERCIAL' },
  transactional: { bg: '#dc2626', label: 'TRANSACTIONAL' },
  informational: { bg: '#2563eb', label: 'INFORMATIONAL' },
  navigational: { bg: '#7c3aed', label: 'NAVIGATIONAL' },
  promotional: { bg: '#059669', label: 'PROMOTIONAL' },
};

const DEFAULT_STYLE = { bg: '#475569', label: 'N/A' };

export function IntentBadge({ intent }: Props) {
  const style = intent ? (INTENT_STYLES[intent.toLowerCase()] ?? DEFAULT_STYLE) : DEFAULT_STYLE;

  return (
    <Badge
      bg={style.bg}
      color="white"
      fontSize="9px"
      fontWeight="bold"
      px={2.5}
      py={1}
      borderRadius="4px"
      textTransform="uppercase"
      letterSpacing="wider"
    >
      {style.label}
    </Badge>
  );
}
