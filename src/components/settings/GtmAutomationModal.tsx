'use client';

/**
 * Component Hierarchy:
 * App > Settings > GoogleConnect > GtmAutomationModal
 */

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  useToast,
  List,
  ListItem,
  ListIcon,
  Box,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';
import { FiCheckCircle, FiAlertCircle, FiZap } from 'react-icons/fi';
import { useAction, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<'projects'>;
}

export function GtmAutomationModal({ isOpen, onClose, projectId }: Props) {
  const toast = useToast();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [measurementId, setMeasurementId] = useState('');
  const isMeasurementIdValid = /^G-[A-Z0-9]+$/.test(measurementId);

  // We need to fetch the project to get the domain
  const project = useQuery(api.projects.projects.getProjectById, { projectId });

  // We need to fetch the GA4 connection to verify it exists
  const ga4Connection = useQuery(api.integrations.ga4Connections.getGA4Connection, {
    projectId,
  });

  const provisionContainer = useAction(
    api.integrations.gtmAutomation.provisionTenantContainerPublic
  );

  const handleAutomate = async () => {
    if (!ga4Connection) {
      toast({
        title: 'Authentication Required',
        description: 'Please reconnect your Google account to grant Tag Manager permissions.',
        status: 'error',
      });
      return;
    }

    if (!isMeasurementIdValid) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a valid GA4 Measurement ID (e.g., G-XXXXXXX).',
        status: 'error',
      });
      return;
    }

    if (!project?.websiteUrl) {
      toast({
        title: 'Project Error',
        description: 'Unable to retrieve project URL.',
        status: 'error',
      });
      return;
    }

    setIsProvisioning(true);
    try {
      const result = await provisionContainer({
        projectId,
        ga4MeasurementId: measurementId,
      });

      if (result.success) {
        toast({
          title: 'Tracking Automated!',
          description: `Google Tag Manager Container (${result.containerPublicId}) has been deployed.`,
          status: 'success',
          duration: 10000,
        });
        onClose();
      } else {
        throw new Error(result.error || 'Failed to provision container');
      }
    } catch (e: unknown) {
      toast({
        title: 'Automation Failed',
        description: 'Something went wrong. Please try again or contact support.',
        status: 'error',
        duration: 8000,
      });
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="white" borderRadius="xl">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.100">
          <HStack>
            <Icon as={FiZap} color="orange.500" />
            <Text>Automate Tracking Setup</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <Text color="gray.600" fontSize="md">
              Phoo can automatically configure and deploy a dedicated Google Tag Manager container
              for your website to instantly enable deep analytics without manual code handling.
            </Text>

            <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
              <Text fontWeight="semibold" mb={3} fontSize="sm" color="gray.700">
                Explicit Side-Effect Confirmation:
              </Text>
              <List spacing={2} fontSize="sm" color="gray.600">
                <ListItem>
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  We will create a new Container within your Google Tag Manager account.
                </ListItem>
                <ListItem>
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  We will configure an "All Pages" trigger.
                </ListItem>
                <ListItem>
                  <ListIcon as={FiCheckCircle} color="green.500" />
                  We will inject your GA4 Configuration Tag.
                </ListItem>
                <ListItem>
                  <ListIcon as={FiAlertCircle} color="orange.500" />
                  We will immediately <strong>Publish</strong> this container live.
                </ListItem>
              </List>
            </Box>

            <Box>
              <FormControl isInvalid={measurementId.length > 0 && !isMeasurementIdValid}>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  GA4 Measurement ID
                </FormLabel>
                <Input
                  placeholder="G-XXXXXXX"
                  value={measurementId}
                  onChange={(e) => setMeasurementId(e.target.value.trim().toUpperCase())}
                />
                {!isMeasurementIdValid && measurementId.length > 0 ? (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    Must start with G- followed by alphanumeric characters.
                  </Text>
                ) : (
                  <FormHelperText fontSize="xs">
                    This ID will be used to configure your new GTM container.
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3} borderTopWidth="1px" borderColor="gray.100">
          <Button variant="ghost" onClick={onClose} isDisabled={isProvisioning}>
            Cancel
          </Button>
          <Button
            colorScheme="orange"
            onClick={handleAutomate}
            isLoading={isProvisioning}
            loadingText="Provisioning Container..."
          >
            I Agree, Automate My GTM
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
