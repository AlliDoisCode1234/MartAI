'use client';

/**
 * GA4Modal Component
 *
 * Component Hierarchy:
 * App → Integrations → GA4Modal (this file)
 *
 * Modal for entering GA4 Property ID.
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
  propertyId: string;
  onPropertyIdChange: (value: string) => void;
  onSave: () => void;
  loading: boolean;
};

export function GA4Modal({
  isOpen,
  onClose,
  propertyId,
  onPropertyIdChange,
  onSave,
  loading,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete GA4 Connection</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              Google authorization successful! Now enter your GA4 Property ID.
            </Alert>

            <FormControl isRequired>
              <FormLabel>GA4 Property ID</FormLabel>
              <Input
                placeholder="123456789"
                value={propertyId}
                onChange={(e) => onPropertyIdChange(e.target.value)}
              />
            </FormControl>

            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                How to find your Property ID:
              </Text>
              <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
                <Text>
                  1. Go to <strong>Google Analytics</strong>
                </Text>
                <Text>
                  2. Click the <strong>Admin</strong> (gear icon) in the bottom left
                </Text>
                <Text>
                  3. Under <strong>Property</strong>, click <strong>Property Settings</strong>
                </Text>
                <Text>
                  4. Copy the <strong>Property ID</strong> (numbers only)
                </Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onSave} isLoading={loading} isDisabled={!propertyId}>
            Connect GA4
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
