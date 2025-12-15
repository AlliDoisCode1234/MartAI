'use client';

/**
 * StatCard Component
 *
 * Component Hierarchy:
 * App → Any Page → StatCard (this file)
 *
 * Reusable stat display card used across admin and member portals.
 */

import { Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

type Props = {
  label: string;
  value: string | number;
  helpText?: string;
  valueSize?: 'xs' | 'sm' | 'md' | 'lg';
  fontFamily?: string;
};

export function StatCard({ label, value, helpText, valueSize = 'md', fontFamily }: Props) {
  return (
    <Card>
      <CardBody py={3}>
        <Stat size="sm">
          <StatLabel>{label}</StatLabel>
          <StatNumber fontSize={valueSize} fontFamily={fontFamily}>
            {value}
          </StatNumber>
          {helpText && <StatHelpText>{helpText}</StatHelpText>}
        </Stat>
      </CardBody>
    </Card>
  );
}
