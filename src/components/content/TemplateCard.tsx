'use client';

/**
 * TemplateCard Component
 *
 * Component Hierarchy:
 * App → Content → ContentStudioLanding → TemplateCard (this file)
 *
 * Visual card for content template selection.
 */

import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Badge,
  Button,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import type { ContentTemplate } from '@/lib/constants/contentTemplates';

type Props = {
  template: ContentTemplate;
  onSelect: (template: ContentTemplate) => void;
};

export function TemplateCard({ template, onSelect }: Props) {
  return (
    <Card
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
        borderColor: `${template.color}.300`,
      }}
      borderWidth="2px"
      borderColor="transparent"
      onClick={() => onSelect(template)}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <HStack>
              <Icon as={template.icon} boxSize={6} color={`${template.color}.500`} />
              <Heading size="sm">{template.name}</Heading>
            </HStack>
            <Badge colorScheme={template.color} fontSize="2xs">
              {template.useCase}
            </Badge>
          </HStack>

          <Text fontSize="sm" color="gray.600">
            {template.description}
          </Text>

          <HStack fontSize="xs" color="gray.500" flexWrap="wrap" spacing={1}>
            {template.structure.slice(0, 4).map((section, i) => (
              <Badge key={i} variant="outline" colorScheme="gray" size="sm">
                {section}
              </Badge>
            ))}
            {template.structure.length > 4 && <Text>+{template.structure.length - 4} more</Text>}
          </HStack>

          <Button
            size="sm"
            variant="ghost"
            colorScheme={template.color}
            rightIcon={<FiArrowRight />}
            justifyContent="flex-start"
          >
            Use Template
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
