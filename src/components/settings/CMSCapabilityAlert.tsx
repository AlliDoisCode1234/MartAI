/**
 * CMSCapabilityAlert Component
 *
 * Component Hierarchy:
 * App → Settings → Integrations → [Platform]Connect → CMSCapabilityAlert
 *
 * Shows CMS publishing limitations with workaround options.
 */

import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Text, Link } from '@chakra-ui/react';
import { FiInfo, FiAlertTriangle } from 'react-icons/fi';
import {
  CMSPlatform,
  CMS_CAPABILITIES,
  POST_CONTENT_TYPES,
  PAGE_CONTENT_TYPES,
} from '../../../lib/constants/integrations';

interface Props {
  platform: CMSPlatform;
  variant?: 'compact' | 'full';
}

export function CMSCapabilityAlert({ platform, variant = 'full' }: Props) {
  const capability = CMS_CAPABILITIES[platform];

  // WordPress supports everything - no warning needed
  if (capability.supports === 'all') {
    return null;
  }

  const unsupportedCount = capability.unsupportedTypes.length;
  const supportedCount = capability.publishableTypes.length;

  // Determine what types are supported
  const supportsPages = capability.supports === 'pages';
  const supportsBlog = capability.supports === 'blog';

  if (variant === 'compact') {
    return (
      <Box
        bg="yellow.50"
        borderWidth="1px"
        borderColor="yellow.200"
        borderRadius="md"
        p={3}
        fontSize="sm"
      >
        <Text fontWeight="medium" color="yellow.800">
          <FiAlertTriangle
            style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }}
          />
          {supportsPages
            ? `Publishes ${supportedCount} page types. Blog posts require export.`
            : `Publishes ${supportedCount} blog types. Pages require export.`}
        </Text>
      </Box>
    );
  }

  return (
    <Alert
      status="warning"
      variant="subtle"
      flexDirection="column"
      alignItems="flex-start"
      borderRadius="md"
      mb={4}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <AlertIcon as={FiInfo} />
        <AlertTitle fontSize="sm" fontWeight="bold">
          {capability.name} Publishing Limitations
        </AlertTitle>
      </Box>
      <AlertDescription fontSize="sm">
        <Text mb={2}>{capability.limitation}</Text>
        <Text mb={2}>
          <strong>Auto-publish:</strong>{' '}
          {supportsPages ? (
            <>{supportedCount} page types (homepage, service, about, etc.)</>
          ) : (
            <>{supportedCount} blog types (blog, versus, video, refresh)</>
          )}
        </Text>
        <Text mb={2}>
          <strong>Export only:</strong>{' '}
          {supportsPages ? (
            <>
              {unsupportedCount} blog types (use WordPress XML export →{' '}
              {platform === 'shopify' ? 'Blog Importer app' : 'Wix blog import'})
            </>
          ) : (
            <>
              {unsupportedCount} page types (copy content to {capability.name} editor)
            </>
          )}
        </Text>
        {capability.workaround && (
          <Text fontSize="xs" color="gray.600" fontStyle="italic">
            Tip: {capability.workaround}
          </Text>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Content Type Badge showing publish capability
 */
interface CapabilityBadgeProps {
  platform: CMSPlatform | undefined;
  contentType: string;
}

export function ContentPublishBadge({ platform, contentType }: CapabilityBadgeProps) {
  // No platform connected - show neutral
  if (!platform) {
    return null;
  }

  const capability = CMS_CAPABILITIES[platform];
  const canPublish = capability.publishableTypes.includes(contentType);

  if (canPublish) {
    return (
      <Box
        as="span"
        bg="green.100"
        color="green.800"
        fontSize="xs"
        px={2}
        py={0.5}
        borderRadius="full"
        fontWeight="medium"
      >
        Auto-publish
      </Box>
    );
  }

  return (
    <Box
      as="span"
      bg="yellow.100"
      color="yellow.800"
      fontSize="xs"
      px={2}
      py={0.5}
      borderRadius="full"
      fontWeight="medium"
    >
      Export only
    </Box>
  );
}

export default CMSCapabilityAlert;
