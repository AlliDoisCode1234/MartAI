'use client';

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
} from '@chakra-ui/react';
import { FiCheckCircle, FiAlertCircle, FiZap } from 'react-icons/fi';
import { useAction, useQuery } from 'convex/react';
import { api, internal } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<'projects'>;
}

export function GtmAutomationModal({ isOpen, onClose, projectId }: Props) {
  const toast = useToast();
  const [isProvisioning, setIsProvisioning] = useState(false);

  // We need to fetch the project to get the domain
  const project = useQuery(api.projects.getProject, { projectId });

  // We need to fetch the GA4 connection to get the measurement ID and tokens
  const ga4Connection = useQuery(api.integrations.ga4Connections.getGA4Connection, {
    projectId,
  });

  const provisionContainer = useAction(
    internal.integrations.gtmAutomation.provisionTenantContainer as any
  );

  const handleAutomate = async () => {
    if (!ga4Connection?.accessToken) {
      toast({
        title: 'Authentication Required',
        description: 'Please reconnect your Google account to grant Tag Manager permissions.',
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
        domain: new URL(project.websiteUrl).hostname,
        ga4MeasurementId: 'G-XXXXXXX', // TODO: Fetch from GA4 API or user input if unavailable
        accessToken: ga4Connection.accessToken,
        refreshToken: ga4Connection.refreshToken,
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
      const err = e as Error;
      toast({
        title: 'Automation Failed',
        description: err.message || String(err),
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
