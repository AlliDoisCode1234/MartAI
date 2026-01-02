'use client';

/**
 * PropertyPickerModal
 *
 * Component Hierarchy:
 * App → IntegrationsPage → PropertyPickerModal
 *
 * Modal to select GA4 property and GSC site after OAuth.
 * Includes account switching for wrong-account scenarios.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  RadioGroup,
  Radio,
  Spinner,
  Alert,
  AlertIcon,
  Box,
  Badge,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FiCheck, FiRefreshCw, FiExternalLink, FiAlertCircle } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  refreshToken: string;
  projectWebsiteUrl: string;
  onSave: (ga4PropertyId: string, gscSiteUrl: string) => Promise<void>;
  onSwitchAccount?: () => void;
}

interface GA4Property {
  propertyId: string;
  displayName: string;
  accountName: string;
}

interface GSCSite {
  siteUrl: string;
  permissionLevel: string;
}

export function PropertyPickerModal({
  isOpen,
  onClose,
  accessToken,
  refreshToken,
  projectWebsiteUrl,
  onSave,
  onSwitchAccount,
}: Props) {
  const [ga4Properties, setGA4Properties] = useState<GA4Property[]>([]);
  const [gscSites, setGSCSites] = useState<GSCSite[]>([]);
  const [selectedGA4, setSelectedGA4] = useState<string>('');
  const [selectedGSC, setSelectedGSC] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listGA4Properties = useAction(api.integrations.google.listGA4Properties);
  const listGSCSites = useAction(api.integrations.google.listGSCSites);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [ga4, gsc] = await Promise.all([
        listGA4Properties({ accessToken }),
        listGSCSites({ accessToken }),
      ]);

      setGA4Properties(ga4);
      setGSCSites(gsc);

      // Auto-match GSC site to project URL
      const matchedGSC = gsc.find(
        (site: GSCSite) =>
          site.siteUrl.includes(projectWebsiteUrl.replace(/^https?:\/\//, '')) ||
          projectWebsiteUrl.includes(site.siteUrl.replace(/^(sc-domain:|https?:\/\/)/, ''))
      );

      // AUTO-CONNECT: If exactly one GA4 and one (or matching) GSC, connect automatically
      const autoGA4 = ga4.length === 1 ? ga4[0].propertyId : null;
      const autoGSC = matchedGSC ? matchedGSC.siteUrl : gsc.length === 1 ? gsc[0].siteUrl : null;

      if (autoGA4 && autoGSC) {
        // Auto-connect without showing picker!
        console.log('[PropertyPicker] Auto-connecting:', { autoGA4, autoGSC });
        await onSave(autoGA4, autoGSC);
        onClose();
        return;
      }

      // Pre-select for manual selection
      if (ga4.length === 1) {
        setSelectedGA4(ga4[0].propertyId);
      }
      if (matchedGSC) {
        setSelectedGSC(matchedGSC.siteUrl);
      } else if (gsc.length === 1) {
        setSelectedGSC(gsc[0].siteUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [accessToken, listGA4Properties, listGSCSites, projectWebsiteUrl, onSave, onClose]);

  // Fetch properties on mount
  useEffect(() => {
    if (isOpen && accessToken) {
      fetchProperties();
    }
  }, [isOpen, accessToken, fetchProperties]);

  const handleSave = async () => {
    if (!selectedGA4 || !selectedGSC) return;
    setSaving(true);
    try {
      await onSave(selectedGA4, selectedGSC);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save connections');
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchAccount = () => {
    onClose();
    if (onSwitchAccount) {
      onSwitchAccount();
    }
  };

  const hasNoProperties = ga4Properties.length === 0 && gscSites.length === 0;
  const canProceed = selectedGA4 && selectedGSC;

  // Empty State Component
  const EmptyStateCard = ({
    title,
    description,
    actionLabel,
    actionUrl,
  }: {
    title: string;
    description: string;
    actionLabel: string;
    actionUrl: string;
  }) => (
    <Box
      p={5}
      bg="rgba(255,255,255,0.02)"
      border="1px solid rgba(255,255,255,0.08)"
      borderRadius="lg"
    >
      <VStack spacing={3} align="center" textAlign="center">
        <Icon as={FiAlertCircle} boxSize={8} color="orange.400" />
        <Text color="white" fontWeight="medium">
          {title}
        </Text>
        <Text color="gray.400" fontSize="sm">
          {description}
        </Text>
        <Button
          as="a"
          href={actionUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          variant="outline"
          colorScheme="orange"
          rightIcon={<FiExternalLink />}
        >
          {actionLabel}
        </Button>
      </VStack>
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
      <ModalContent bg="#0f0f1a" border="1px solid rgba(255,255,255,0.1)" borderRadius="xl">
        <ModalHeader borderBottom="1px solid rgba(255,255,255,0.06)" pb={4}>
          <VStack align="start" spacing={1}>
            <Text color="white" fontSize="xl" fontWeight="bold">
              Connect Your Analytics
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="normal">
              Select the properties to power your SEO insights
            </Text>
          </VStack>
        </ModalHeader>

        <ModalBody py={6}>
          {loading ? (
            <VStack py={12} spacing={4}>
              <Spinner color="#FF9D00" size="xl" thickness="3px" />
              <VStack spacing={1}>
                <Text color="white" fontWeight="medium">
                  Finding your properties...
                </Text>
                <Text color="gray.500" fontSize="sm">
                  This may take a moment
                </Text>
              </VStack>
            </VStack>
          ) : error ? (
            <VStack spacing={4}>
              <Alert status="error" borderRadius="md" bg="red.900" color="white">
                <AlertIcon />
                {error}
              </Alert>
              <Button
                variant="outline"
                colorScheme="orange"
                size="sm"
                leftIcon={<FiRefreshCw />}
                onClick={fetchProperties}
              >
                Try Again
              </Button>
            </VStack>
          ) : hasNoProperties ? (
            // Wrong Account or No Properties State
            <VStack spacing={6}>
              <Box
                p={6}
                bg="linear-gradient(135deg, rgba(255,157,0,0.1), rgba(255,107,0,0.05))"
                border="1px solid rgba(255,157,0,0.2)"
                borderRadius="xl"
                w="full"
              >
                <VStack spacing={4} textAlign="center">
                  <Icon as={FiAlertCircle} boxSize={12} color="orange.400" />
                  <Text color="white" fontSize="lg" fontWeight="semibold">
                    No Analytics Properties Found
                  </Text>
                  <Text color="gray.300" fontSize="sm" maxW="400px">
                    The Google account you connected doesn't have access to any GA4 or Search
                    Console properties.
                  </Text>
                  <Button
                    bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                    color="white"
                    size="lg"
                    leftIcon={<FiRefreshCw />}
                    onClick={handleSwitchAccount}
                    _hover={{ opacity: 0.9 }}
                  >
                    Switch Google Account
                  </Button>
                  <Text color="gray.500" fontSize="xs">
                    Connect with the account that manages your analytics
                  </Text>
                </VStack>
              </Box>

              <Divider borderColor="rgba(255,255,255,0.1)" />

              <Text color="gray.400" fontSize="sm" textAlign="center">
                Or set up analytics for the first time:
              </Text>

              <HStack spacing={4} w="full">
                <EmptyStateCard
                  title="Google Analytics 4"
                  description="Track website traffic and user behavior"
                  actionLabel="Set Up GA4"
                  actionUrl="https://analytics.google.com/analytics/web/#/provision"
                />
                <EmptyStateCard
                  title="Search Console"
                  description="Monitor search performance and keywords"
                  actionLabel="Add Site"
                  actionUrl="https://search.google.com/search-console/welcome"
                />
              </HStack>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={6}>
              {/* GA4 Properties */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text color="white" fontWeight="semibold">
                    Google Analytics 4
                  </Text>
                  {ga4Properties.length > 0 && (
                    <Badge bg="rgba(255,157,0,0.2)" color="orange.300" fontSize="xs">
                      {ga4Properties.length} found
                    </Badge>
                  )}
                </HStack>
                {ga4Properties.length === 0 ? (
                  <EmptyStateCard
                    title="No GA4 Properties"
                    description="Create a GA4 property for your website"
                    actionLabel="Create Property"
                    actionUrl="https://analytics.google.com/analytics/web/#/provision"
                  />
                ) : (
                  <RadioGroup value={selectedGA4} onChange={setSelectedGA4}>
                    <VStack align="stretch" spacing={2}>
                      {ga4Properties.map((prop) => (
                        <Box
                          key={prop.propertyId}
                          p={4}
                          bg={
                            selectedGA4 === prop.propertyId
                              ? 'rgba(255,157,0,0.15)'
                              : 'rgba(255,255,255,0.02)'
                          }
                          border={
                            selectedGA4 === prop.propertyId
                              ? '2px solid #FF9D00'
                              : '1px solid rgba(255,255,255,0.08)'
                          }
                          borderRadius="lg"
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                          onClick={() => setSelectedGA4(prop.propertyId)}
                        >
                          <Radio value={prop.propertyId} colorScheme="orange">
                            <HStack spacing={3}>
                              <Text color="white" fontWeight="medium">
                                {prop.displayName}
                              </Text>
                              <Badge bg="rgba(255,255,255,0.1)" color="gray.400" fontSize="xs">
                                {prop.accountName}
                              </Badge>
                            </HStack>
                          </Radio>
                        </Box>
                      ))}
                    </VStack>
                  </RadioGroup>
                )}
              </Box>

              {/* GSC Sites */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text color="white" fontWeight="semibold">
                    Search Console Site
                  </Text>
                  {gscSites.length > 0 && (
                    <Badge bg="rgba(34,197,94,0.2)" color="green.300" fontSize="xs">
                      {gscSites.length} found
                    </Badge>
                  )}
                </HStack>
                {gscSites.length === 0 ? (
                  <EmptyStateCard
                    title="No Verified Sites"
                    description="Add and verify your site in Search Console"
                    actionLabel="Add Site"
                    actionUrl="https://search.google.com/search-console/welcome"
                  />
                ) : (
                  <RadioGroup value={selectedGSC} onChange={setSelectedGSC}>
                    <VStack align="stretch" spacing={2}>
                      {gscSites.map((site) => {
                        const isMatch =
                          site.siteUrl.includes(projectWebsiteUrl.replace(/^https?:\/\//, '')) ||
                          projectWebsiteUrl.includes(
                            site.siteUrl.replace(/^(sc-domain:|https?:\/\/)/, '')
                          );
                        return (
                          <Box
                            key={site.siteUrl}
                            p={4}
                            bg={
                              selectedGSC === site.siteUrl
                                ? 'rgba(255,157,0,0.15)'
                                : 'rgba(255,255,255,0.02)'
                            }
                            border={
                              selectedGSC === site.siteUrl
                                ? '2px solid #FF9D00'
                                : '1px solid rgba(255,255,255,0.08)'
                            }
                            borderRadius="lg"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                            onClick={() => setSelectedGSC(site.siteUrl)}
                          >
                            <Radio value={site.siteUrl} colorScheme="orange">
                              <HStack spacing={3}>
                                <Text color="white" fontWeight="medium">
                                  {site.siteUrl}
                                </Text>
                                {isMatch && (
                                  <Badge bg="#22C55E" color="white" fontSize="xs" px={2}>
                                    <HStack spacing={1}>
                                      <Icon as={FiCheck} boxSize={3} />
                                      <Text>Matches project</Text>
                                    </HStack>
                                  </Badge>
                                )}
                              </HStack>
                            </Radio>
                          </Box>
                        );
                      })}
                    </VStack>
                  </RadioGroup>
                )}
              </Box>

              {/* Switch Account Link */}
              <HStack justify="center" pt={2}>
                <Button
                  variant="ghost"
                  size="sm"
                  color="gray.400"
                  leftIcon={<FiRefreshCw />}
                  onClick={handleSwitchAccount}
                  _hover={{ color: 'orange.400', bg: 'transparent' }}
                >
                  Switch Google Account
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter borderTop="1px solid rgba(255,255,255,0.06)" pt={4} gap={3}>
          <Button
            variant="ghost"
            color="gray.400"
            onClick={onClose}
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            Cancel
          </Button>
          {!hasNoProperties && (
            <Button
              bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
              color="white"
              px={8}
              _hover={{ opacity: 0.9, transform: 'translateY(-1px)' }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s"
              isLoading={saving}
              isDisabled={!canProceed || loading}
              onClick={handleSave}
            >
              Connect Analytics
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
