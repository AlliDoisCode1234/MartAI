/**
 * ServiceAccountUpload Component
 *
 * Component Hierarchy:
 * App → Settings → Integrations → GoogleConnect → ServiceAccountUpload
 *
 * Allows enterprise users to connect GA4/GSC using a service account JSON key
 * instead of OAuth. Extracts email server-side to prevent spoofing.
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  useToast,
  Collapse,
  IconButton,
  Spinner,
  List,
  ListItem,
  ListIcon,
  Link,
} from '@chakra-ui/react';
import { FiUpload, FiCheck, FiX, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface Props {
  projectId: Id<'projects'>;
  onSuccess: () => void;
}

interface ServiceAccountJson {
  type: string;
  client_email: string;
  private_key: string;
  project_id: string;
}

type UploadState = 'idle' | 'parsing' | 'ready' | 'verifying' | 'success' | 'error';

export function ServiceAccountUpload({ projectId, onSuccess }: Props) {
  const toast = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [serviceAccountEmail, setServiceAccountEmail] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyServiceAccount = useAction(api.integrations.google.verifyServiceAccount);

  const validateServiceAccountJson = (json: unknown): json is ServiceAccountJson => {
    if (typeof json !== 'object' || json === null) return false;
    const obj = json as Record<string, unknown>;
    return (
      obj.type === 'service_account' &&
      typeof obj.client_email === 'string' &&
      typeof obj.private_key === 'string' &&
      typeof obj.project_id === 'string'
    );
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setErrorMessage('Please upload a JSON file');
      setUploadState('error');
      return;
    }

    setUploadState('parsing');
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!validateServiceAccountJson(parsed)) {
          setErrorMessage(
            'Invalid service account JSON. Make sure you downloaded the correct key file from Google Cloud Console.'
          );
          setUploadState('error');
          return;
        }

        setServiceAccountEmail(parsed.client_email);
        setJsonContent(content);
        setUploadState('ready');
      } catch {
        setErrorMessage('Failed to parse JSON file. Please check the file is valid.');
        setUploadState('error');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file');
      setUploadState('error');
    };
    reader.readAsText(file);
  }, []);

  const handleVerify = async () => {
    if (!jsonContent) return;

    setUploadState('verifying');
    setErrorMessage(null);

    try {
      const result = await verifyServiceAccount({
        projectId,
        serviceAccountJson: jsonContent,
      });

      if (result.success) {
        setUploadState('success');
        toast({
          title: 'Connection successful',
          description: `Connected to ${result.propertyName}`,
          status: 'success',
          duration: 5000,
        });
        onSuccess();
      } else {
        setErrorMessage(result.error || 'Verification failed');
        setUploadState('error');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
      setUploadState('error');
    }
  };

  const handleReset = () => {
    setUploadState('idle');
    setServiceAccountEmail(null);
    setJsonContent(null);
    setErrorMessage(null);
  };

  return (
    <Box mt={4}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        rightIcon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        color="gray.600"
      >
        Advanced: Use Service Account
      </Button>

      <Collapse in={isExpanded}>
        <Box mt={3} p={4} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              For enterprise users who cannot use OAuth. Requires a Google Cloud service account.
            </Text>

            {/* Step 1: Upload JSON */}
            {uploadState === 'idle' && (
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Step 1: Upload Service Account Key
                </Text>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  p={1}
                  sx={{
                    '::file-selector-button': {
                      bg: 'gray.100',
                      border: 'none',
                      borderRadius: 'md',
                      px: 3,
                      py: 1,
                      mr: 3,
                      cursor: 'pointer',
                    },
                  }}
                />
                <Link
                  href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                  isExternal
                  fontSize="xs"
                  color="blue.500"
                  mt={2}
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                >
                  Create a service account in Google Cloud Console
                  <FiExternalLink size={12} />
                </Link>
              </Box>
            )}

            {/* Parsing state */}
            {uploadState === 'parsing' && (
              <HStack>
                <Spinner size="sm" />
                <Text fontSize="sm">Parsing JSON...</Text>
              </HStack>
            )}

            {/* Step 2: Add email to GA4 */}
            {(uploadState === 'ready' || uploadState === 'verifying') && serviceAccountEmail && (
              <Box>
                <Alert status="info" borderRadius="md" mb={3}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">
                      Step 2: Add this email to your GA4 property
                    </AlertTitle>
                    <AlertDescription fontSize="sm">
                      <Code colorScheme="blue" fontSize="xs" mt={1} display="block">
                        {serviceAccountEmail}
                      </Code>
                    </AlertDescription>
                  </Box>
                </Alert>

                <Text fontWeight="medium" mb={2}>
                  Instructions:
                </Text>
                <List spacing={1} fontSize="sm" color="gray.600">
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Go to Google Analytics → Admin → Property Access Management
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Click + Add users and enter the email above
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Grant Viewer role (minimum required)
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiCheck} color="green.500" />
                    Click Verify Connection below
                  </ListItem>
                </List>

                <HStack mt={4}>
                  <Button
                    colorScheme="blue"
                    onClick={handleVerify}
                    isLoading={uploadState === 'verifying'}
                    loadingText="Verifying..."
                    leftIcon={<FiCheck />}
                  >
                    Verify Connection
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    Cancel
                  </Button>
                </HStack>
              </Box>
            )}

            {/* Success state */}
            {uploadState === 'success' && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Connected successfully!</AlertTitle>
              </Alert>
            )}

            {/* Error state */}
            {uploadState === 'error' && errorMessage && (
              <Box>
                <Alert status="error" borderRadius="md" mb={3}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">Connection Failed</AlertTitle>
                    <AlertDescription fontSize="sm">{errorMessage}</AlertDescription>
                  </Box>
                </Alert>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  Try Again
                </Button>
              </Box>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
}

export default ServiceAccountUpload;
