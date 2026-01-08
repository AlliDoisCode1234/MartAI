'use client';

/**
 * CMSModal Component
 *
 * Component Hierarchy:
 * App → Integrations → CMSModal (this file)
 *
 * Modal for CMS credentials (WordPress, Shopify, Webflow).
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
  FormControl,
  FormLabel,
  Input,
  Text,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';

type CMSPlatform = 'wordpress' | 'shopify' | 'webflow';

type TestResult = { valid: boolean; error?: string; canPublish?: boolean } | null;

interface CMSCredentials {
  siteUrl?: string;
  username?: string;
  password?: string;
  shopDomain?: string;
  accessToken?: string;
  siteId?: string;
  collectionId?: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  platform: CMSPlatform | null;
  credentials: CMSCredentials;
  onCredentialsChange: (credentials: CMSCredentials) => void;
  onTest: () => void;
  testResult: TestResult;
  loading: boolean;
};

export function CMSModal({
  isOpen,
  onClose,
  platform,
  credentials,
  onCredentialsChange,
  onTest,
  testResult,
  loading,
}: Props) {
  const platformName =
    platform === 'wordpress' ? 'WordPress' : platform === 'shopify' ? 'Shopify' : 'Webflow';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect {platformName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {platform === 'wordpress' && (
              <>
                <FormControl>
                  <FormLabel>Site URL</FormLabel>
                  <Input
                    placeholder="https://yoursite.com"
                    value={credentials.siteUrl || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, siteUrl: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="WordPress username"
                    value={credentials.username || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, username: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Application Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="WordPress application password"
                    value={credentials.password || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, password: e.target.value })
                    }
                  />
                </FormControl>
              </>
            )}
            {platform === 'shopify' && (
              <>
                <FormControl>
                  <FormLabel>Shop Domain</FormLabel>
                  <Input
                    placeholder="your-shop"
                    value={credentials.shopDomain || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, shopDomain: e.target.value })
                    }
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Enter your shop name without .myshopify.com
                  </Text>
                </FormControl>
                <FormControl>
                  <FormLabel>Access Token</FormLabel>
                  <Input
                    type="password"
                    placeholder="Shopify admin API access token"
                    value={credentials.accessToken || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, accessToken: e.target.value })
                    }
                  />
                </FormControl>
              </>
            )}
            {platform === 'webflow' && (
              <>
                <FormControl>
                  <FormLabel>Site ID</FormLabel>
                  <Input
                    placeholder="Webflow site ID"
                    value={credentials.siteId || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, siteId: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Access Token</FormLabel>
                  <Input
                    type="password"
                    placeholder="Webflow API access token"
                    value={credentials.accessToken || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, accessToken: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Collection ID (Optional)</FormLabel>
                  <Input
                    placeholder="CMS collection ID for pages"
                    value={credentials.collectionId || ''}
                    onChange={(e) =>
                      onCredentialsChange({ ...credentials, collectionId: e.target.value })
                    }
                  />
                </FormControl>
              </>
            )}

            {testResult && (
              <Alert status={testResult.valid && testResult.canPublish ? 'success' : 'error'}>
                <AlertIcon />
                {testResult.valid && testResult.canPublish
                  ? 'Connection successful! You have publishing rights.'
                  : testResult.error || 'Connection failed or insufficient permissions'}
              </Alert>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button bg="brand.orange" color="white" onClick={onTest} isLoading={loading}>
            Test Connection
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
