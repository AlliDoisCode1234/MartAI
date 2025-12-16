'use client';

/**
 * FAQsCard Component
 *
 * Component Hierarchy:
 * App → Content → BriefTab → FAQsCard (this file)
 *
 * Editable FAQ list.
 */

import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
} from '@chakra-ui/react';

type FAQ = { question: string; answer: string };

type Props = {
  faqs: FAQ[];
  onAdd: () => void;
  onUpdate: (index: number, field: 'question' | 'answer', value: string) => void;
};

export function FAQsCard({ faqs, onAdd, onUpdate }: Props) {
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <Heading size="md">FAQs</Heading>
            <Button size="sm" onClick={onAdd}>
              + Add
            </Button>
          </HStack>
          {faqs.map((faq, index) => (
            <VStack key={index} align="stretch" spacing={2}>
              <Input
                value={faq.question}
                onChange={(e) => onUpdate(index, 'question', e.target.value)}
                placeholder="Question"
              />
              <Textarea
                value={faq.answer}
                onChange={(e) => onUpdate(index, 'answer', e.target.value)}
                placeholder="Answer"
                rows={2}
              />
            </VStack>
          ))}
          {faqs.length === 0 && (
            <Text color="gray.500" fontSize="sm" fontStyle="italic">
              Add frequently asked questions
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
