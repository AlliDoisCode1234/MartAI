'use client';

/**
 * DangerAction Component
 *
 * Component Hierarchy:
 * App → Any Page → DangerZone → DangerAction (this file)
 *
 * Single action row for danger zone sections.
 */

import { HStack, Box, Text, Button } from '@chakra-ui/react';

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
};

export function DangerAction({ title, description, buttonLabel, onClick }: Props) {
  return (
    <HStack justify="space-between" p={4} bg="red.50" borderRadius="md">
      <Box>
        <Text fontWeight="semibold">{title}</Text>
        <Text fontSize="sm" color="gray.600">
          {description}
        </Text>
      </Box>
      <Button colorScheme="red" variant="outline" onClick={onClick}>
        {buttonLabel}
      </Button>
    </HStack>
  );
}
