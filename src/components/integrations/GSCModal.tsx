'use client';

/**
 * GSCModal Component
 *
 * Component Hierarchy:
 * App → Integrations → GSCModal (this file)
 *
 * Modal for entering GSC Site URL.
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
  Button,
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  siteUrl: string;
  onSiteUrlChange: (value: string) => void;
  onSave: () => void;
  loading: boolean;
};

export function GSCModal({ isOpen, onClose, siteUrl, onSiteUrlChange, onSave, loading }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Google Search Console</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              GA4 connected! Now add your Search Console site.
            </Alert>

            <FormControl isRequired>
              <FormLabel>Site URL</FormLabel>
              <Input
                placeholder="https://example.com or sc-domain:example.com"
                value={siteUrl}
                onChange={(e) => onSiteUrlChange(e.target.value)}
              />
            </FormControl>

            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Site URL Format:
              </Text>
              <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
                <Text>
                  • For URL-prefix property: <strong>https://example.com/</strong>
                </Text>
                <Text>
                  • For Domain property: <strong>sc-domain:example.com</strong>
                </Text>
                <Text>The URL must match exactly what's in Search Console.</Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Skip for now
          </Button>
          <Button colorScheme="green" onClick={onSave} isLoading={loading} isDisabled={!siteUrl}>
            Connect GSC
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
