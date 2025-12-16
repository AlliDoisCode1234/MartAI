'use client';

/**
 * MetaTagsCard Component
 *
 * Component Hierarchy:
 * App → Content → BriefTab → MetaTagsCard (this file)
 *
 * Meta title and description inputs with character counts.
 */

import {
  Card,
  CardBody,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
} from '@chakra-ui/react';

type Props = {
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
};

export function MetaTagsCard({
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange,
}: Props) {
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Meta Tags</Heading>
          <FormControl>
            <FormLabel>Meta Title</FormLabel>
            <Input
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder="50-60 characters"
            />
            <Text fontSize="xs" color={metaTitle.length > 60 ? 'red.500' : 'gray.500'}>
              {metaTitle.length}/60
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel>Meta Description</FormLabel>
            <Textarea
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder="150-160 characters"
              rows={3}
            />
            <Text fontSize="xs" color={metaDescription.length > 160 ? 'red.500' : 'gray.500'}>
              {metaDescription.length}/160
            </Text>
          </FormControl>
        </VStack>
      </CardBody>
    </Card>
  );
}
