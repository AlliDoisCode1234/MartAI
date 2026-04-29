'use client';

/**
 * Component Hierarchy:
 * App > Settings > GoogleConnect > GtmAutomationModal
 */

import React, { useState, useEffect } from 'react';
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
  Radio,
  RadioGroup,
  Spinner,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
} from '@chakra-ui/react';
import { FiCheckCircle, FiAlertCircle, FiZap, FiBox, FiPlus, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { useAction, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<'projects'>;
}

interface GtmContainer {
  name: string;
  publicId: string;
  containerId: string;
  accountId: string;
}

export function GtmAutomationModal({ isOpen, onClose, projectId }: Props) {
  const toast = useToast();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [measurementId, setMeasurementId] = useState('');
  const [containerMode, setContainerMode] = useState<'create' | string>('create');
  const [containers, setContainers] = useState<GtmContainer[]>([]);
  const [isLoadingContainers, setIsLoadingContainers] = useState(false);
  const [containersLoaded, setContainersLoaded] = useState(false);
  const [noAccount, setNoAccount] = useState(false);
  const [isFetchingMeasurementId, setIsFetchingMeasurementId] = useState(false);
  const [measurementIdError, setMeasurementIdError] = useState<string | null>(null);

  const isMeasurementIdValid = /^G-[A-Z0-9]+$/.test(measurementId);

  const project = useQuery(api.projects.projects.getProjectById, { projectId });
  const ga4Connection = useQuery(api.integrations.ga4Connections.getGA4Connection, {
    projectId,
  });

  const provisionContainer = useAction(
    api.integrations.gtmAutomation.provisionTenantContainerPublic
  );
  const listContainers = useAction(api.integrations.gtmAutomation.listUserContainers);
  const fetchMeasurementIdAction = useAction(api.integrations.google.fetchMeasurementId);

  // Auto-detect existing containers when modal opens
  useEffect(() => {
    if (!isOpen || containersLoaded || !ga4Connection) return;

    const fetchContainers = async () => {
      setIsLoadingContainers(true);
      setNoAccount(false);
      try {
        const result = await listContainers({ projectId });
        if (result.noAccount) {
          setNoAccount(true);
          // Don't set containersLoaded so retry can re-trigger the effect
          setIsLoadingContainers(false);
          return;
        } else if (result.success && result.containers.length > 0) {
          setContainers(result.containers);
          // Auto-select the first container if one exists
          setContainerMode(result.containers[0].publicId);
        }
      } catch {
        // Silently fail — user can still create new
        console.warn('[GTM Modal] Failed to fetch containers');
      } finally {
        setIsLoadingContainers(false);
        setContainersLoaded(true);
      }
    };

    fetchContainers();
  }, [isOpen, containersLoaded, ga4Connection, listContainers, projectId]);

  // Auto-fetch GA4 Measurement ID when modal opens
  useEffect(() => {
    if (!isOpen || !ga4Connection || measurementId) return;

    const fetchId = async () => {
      setIsFetchingMeasurementId(true);
      setMeasurementIdError(null);
      try {
        const result = await fetchMeasurementIdAction({ projectId });
        if (result.measurementId) {
          setMeasurementId(result.measurementId);
        } else if (result.error) {
          setMeasurementIdError(result.error);
        }
      } catch {
        setMeasurementIdError('Could not auto-detect measurement ID.');
      } finally {
        setIsFetchingMeasurementId(false);
      }
    };

    fetchId();
  }, [isOpen, ga4Connection, projectId, fetchMeasurementIdAction, measurementId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setContainersLoaded(false);
      setContainers([]);
      setContainerMode('create');
      setMeasurementId('');
      setNoAccount(false);
      setMeasurementIdError(null);
    }
  }, [isOpen]);

  const handleRetryContainers = async () => {
    setContainersLoaded(false);
    setNoAccount(false);
    setIsLoadingContainers(true);
    try {
      const result = await listContainers({ projectId });
      if (result.noAccount) {
        setNoAccount(true);
      } else if (result.success && result.containers.length > 0) {
        setContainers(result.containers);
        setContainerMode(result.containers[0].publicId);
      }
      setContainersLoaded(true);
    } catch {
      console.warn('[GTM Modal] Retry failed');
    } finally {
      setIsLoadingContainers(false);
    }
  };

  const selectedContainer = containers.find((c) => c.publicId === containerMode);
  const isExistingMode = containerMode !== 'create';

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
        description:
          'Please provide a valid Measurement ID (e.g., G-XXXXXXX). This is your GA4 Measurement ID, not a GTM Container ID.',
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
        existingContainerPublicId: isExistingMode ? containerMode : undefined,
      });

      if (result.success) {
        toast({
          title: isExistingMode ? 'Container Connected!' : 'Tracking Automated!',
          description: `Google Tag Manager Container (${result.containerPublicId}) has been ${isExistingMode ? 'connected and upgraded' : 'deployed'}.`,
          status: 'success',
          duration: 10000,
        });
        onClose();
      } else {
        // Check for the specific no-account error
        if (result.error?.includes('No Google Tag Manager account found')) {
          setNoAccount(true);
          return;
        }
        throw new Error(result.error || 'Failed to provision container');
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong.';
      // Catch no-account errors from any path
      if (message.includes('No Google Tag Manager account found')) {
        setNoAccount(true);
        return;
      }
      toast({
        title: 'Automation Failed',
        description: message,
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
          <VStack spacing={5} align="stretch">
            <Text color="gray.600" fontSize="md">
              Phoo can configure a Google Tag Manager container for your website to enable deep
              analytics and lead tracking automatically.
            </Text>

            {/* No GTM Account — Guided Empty State */}
            {noAccount ? (
              <Box
                p={5}
                bg="orange.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="orange.200"
              >
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Icon as={FiAlertCircle} color="orange.500" boxSize={5} />
                    <Text fontWeight="semibold" color="orange.800" fontSize="md">
                      Google Tag Manager Account Required
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700">
                    To automate tracking, you need a free Google Tag Manager account. This is a
                    one-time setup that takes about 30 seconds.
                  </Text>
                  <VStack spacing={2} align="stretch">
                    <Link
                      href="https://tagmanager.google.com"
                      isExternal
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Button
                        colorScheme="orange"
                        variant="outline"
                        width="100%"
                        rightIcon={<Icon as={FiExternalLink} />}
                      >
                        Create Free GTM Account
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Icon as={FiRefreshCw} />}
                      onClick={handleRetryContainers}
                      isLoading={isLoadingContainers}
                      loadingText="Checking..."
                    >
                      I created my account — Retry
                    </Button>
                  </VStack>
                  <Alert status="info" borderRadius="md" bg="blue.50" fontSize="xs">
                    <AlertIcon boxSize={4} />
                    <AlertDescription>
                      After creating your GTM account, come back here and click Retry. Phoo will
                      handle everything else automatically.
                    </AlertDescription>
                  </Alert>
                </VStack>
              </Box>
            ) : (
              <>
                {/* Container Selection */}
                {isLoadingContainers ? (
                  <HStack justify="center" py={4}>
                    <Spinner size="sm" color="orange.500" />
                    <Text fontSize="sm" color="gray.500">
                      Checking for existing GTM containers...
                    </Text>
                  </HStack>
                ) : containers.length > 0 ? (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                      GTM Container
                    </Text>
                    <RadioGroup value={containerMode} onChange={setContainerMode}>
                      <VStack align="stretch" spacing={2}>
                        {containers.map((container) => (
                          <Box
                            key={container.publicId}
                            p={3}
                            borderWidth="1px"
                            borderColor={
                              containerMode === container.publicId ? 'orange.300' : 'gray.200'
                            }
                            borderRadius="md"
                            bg={containerMode === container.publicId ? 'orange.50' : 'white'}
                            cursor="pointer"
                            onClick={() => setContainerMode(container.publicId)}
                            transition="all 0.15s"
                            _hover={{ borderColor: 'orange.200' }}
                          >
                            <Radio value={container.publicId} colorScheme="orange">
                              <HStack spacing={3}>
                                <Icon as={FiBox} color="gray.500" />
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {container.name}
                                  </Text>
                                  <Badge fontSize="xs" colorScheme="gray" variant="subtle">
                                    {container.publicId}
                                  </Badge>
                                </VStack>
                              </HStack>
                            </Radio>
                          </Box>
                        ))}
                        <Box
                          p={3}
                          borderWidth="1px"
                          borderColor={containerMode === 'create' ? 'orange.300' : 'gray.200'}
                          borderRadius="md"
                          bg={containerMode === 'create' ? 'orange.50' : 'white'}
                          cursor="pointer"
                          onClick={() => setContainerMode('create')}
                          transition="all 0.15s"
                          _hover={{ borderColor: 'orange.200' }}
                        >
                          <Radio value="create" colorScheme="orange">
                            <HStack spacing={3}>
                              <Icon as={FiPlus} color="green.500" />
                              <Text fontSize="sm" fontWeight="medium">
                                Create New Container
                              </Text>
                            </HStack>
                          </Radio>
                        </Box>
                      </VStack>
                    </RadioGroup>
                  </Box>
                ) : null}

                <Divider />

                {/* Side Effect Confirmation */}
                <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
                  <Text fontWeight="semibold" mb={3} fontSize="sm" color="gray.700">
                    What Phoo will do:
                  </Text>
                  <List spacing={2} fontSize="sm" color="gray.600">
                    {isExistingMode ? (
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        We will add tracking tags to your existing container (
                        {selectedContainer?.publicId}).
                      </ListItem>
                    ) : (
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        We will create a new Container within your Google Tag Manager account.
                      </ListItem>
                    )}
                    <ListItem>
                      <ListIcon as={FiCheckCircle} color="green.500" />
                      We will configure an &quot;All Pages&quot; trigger.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheckCircle} color="green.500" />
                      We will inject your GA4 Configuration Tag.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheckCircle} color="green.500" />
                      We will add lead tracking (form submissions + custom events).
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiAlertCircle} color="orange.500" />
                      We will immediately <strong>Publish</strong> this container live.
                    </ListItem>
                  </List>
                </Box>

                {/* GA4 Measurement ID Input */}
                <Box>
                  <FormControl isInvalid={measurementId.length > 0 && !isMeasurementIdValid}>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                      GA4 Measurement ID
                      {isFetchingMeasurementId && (
                        <Spinner size="xs" ml={2} color="orange.500" />
                      )}
                    </FormLabel>
                    <Input
                      placeholder="G-XXXXXXX"
                      value={measurementId}
                      onChange={(e) => setMeasurementId(e.target.value.trim().toUpperCase())}
                    />
                    {!isMeasurementIdValid && measurementId.length > 0 ? (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        Must start with G- followed by alphanumeric characters (e.g., G-ABC123XYZ).
                      </Text>
                    ) : (
                      <FormHelperText fontSize="xs">
                        {isFetchingMeasurementId
                          ? 'Auto-detecting from your connected GA4 property...'
                          : measurementIdError && !measurementId
                            ? `Auto-detect failed: ${measurementIdError} Enter your Measurement ID manually.`
                            : 'Your GA4 property\u0027s Measurement ID. This gets injected into the GTM container as a configuration tag so analytics data flows to your GA4 property.'}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        {!noAccount && (
          <ModalFooter gap={3} borderTopWidth="1px" borderColor="gray.100">
            <Button variant="ghost" onClick={onClose} isDisabled={isProvisioning}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleAutomate}
              isLoading={isProvisioning}
              loadingText={isExistingMode ? 'Connecting Container...' : 'Provisioning Container...'}
              isDisabled={!isMeasurementIdValid || !ga4Connection}
            >
              {isExistingMode ? 'Connect & Configure' : 'Create & Deploy'}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
