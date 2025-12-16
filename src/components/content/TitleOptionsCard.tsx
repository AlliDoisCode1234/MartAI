'use client';

/**
 * TitleOptionsCard Component
 *
 * Component Hierarchy:
 * App → Content → BriefTab → TitleOptionsCard (this file)
 *
 * Editable list of title options for brief.
 */

import { Card, CardBody, VStack, HStack, Heading, Text, Button, Input } from '@chakra-ui/react';

type Props = {
  titles: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
};

export function TitleOptionsCard({ titles, onAdd, onUpdate }: Props) {
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="md">Title Options</Heading>
            <Button size="sm" onClick={onAdd}>
              + Add
            </Button>
          </HStack>
          {titles.map((title, index) => (
            <Input
              key={index}
              value={title}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`Title option ${index + 1}`}
            />
          ))}
          {titles.length === 0 && (
            <Text color="gray.500" fontSize="sm" fontStyle="italic">
              Click "Generate Brief Details" or add title options manually
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
