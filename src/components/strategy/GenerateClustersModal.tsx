'use client';

/**
 * GenerateClustersModal Component
 *
 * Component Hierarchy:
 * App → Strategy → GenerateClustersModal (this file)
 *
 * Modal for generating topic clusters.
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
};

export function GenerateClustersModal({ isOpen, onClose, onGenerate, isLoading }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Generate Topic Clusters</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={3}>
            <Text fontWeight="bold">What are Topic Clusters?</Text>
            <Text>
              MartAI analyzes your keyword data to find groups of related terms that should cover a
              single topic. This helps you build authority by covering a subject in depth rather
              than targeting isolated keywords.
            </Text>
            <Alert status="info">
              <AlertIcon />
              This uses your current keywords and optionally imports fresh data from Google Search
              Console.
            </Alert>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button bg="brand.orange" color="white" onClick={onGenerate} isLoading={isLoading}>
            Generate Topics
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
