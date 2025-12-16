'use client';

/**
 * H2OutlineCard Component
 *
 * Component Hierarchy:
 * App → Content → BriefTab → H2OutlineCard (this file)
 *
 * Editable H2 outline sections.
 */

import { Card, CardBody, VStack, HStack, Heading, Text, Button, Input } from '@chakra-ui/react';

type Props = {
  sections: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
};

export function H2OutlineCard({ sections, onAdd, onUpdate }: Props) {
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="md">H2 Outline</Heading>
            <Button size="sm" onClick={onAdd}>
              + Add
            </Button>
          </HStack>
          {sections.map((section, index) => (
            <Input
              key={index}
              value={section}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`H2 Section ${index + 1}`}
            />
          ))}
          {sections.length === 0 && (
            <Text color="gray.500" fontSize="sm" fontStyle="italic">
              Add main content sections
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
