/**
 * TopicsPreview Component
 *
 * Component Hierarchy:
 * App → HomePage | StrategyPage → TopicsPreview
 *
 * Shows user's topic clusters (topics) in an expandable card.
 */

'use client';

import { useState } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  Icon,
  Collapse,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Skeleton,
  Tooltip,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp, FiLayers } from 'react-icons/fi';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

interface Props {
  projectId: Id<'projects'>;
  maxPreview?: number;
}

export function TopicsPreview({ projectId, maxPreview = 10 }: Props) {
  const [isOpen, setIsOpen] = useState(true); // Expanded by default
  const clusters = useQuery(api.seo.keywordClusters.getClustersByProject, { projectId });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  const isLoading = clusters === undefined;
  const clusterCount = clusters?.length || 0;
  type ClusterDoc = NonNullable<typeof clusters>[number];
  const displayClusters: ClusterDoc[] = clusters?.slice(0, maxPreview) || [];
  const hasMore = clusterCount > maxPreview;

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
      >
        <HStack p={4} justify="space-between">
          <Skeleton h={5} w="150px" />
          <Skeleton h={5} w="80px" />
        </HStack>
      </Box>
    );
  }

  if (clusterCount === 0) {
    return null; // Don't show if no topics
  }

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
    >
      {/* Header - Always visible, prominent */}
      <HStack
        p={5}
        justify="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: headerBg }}
        transition="background 0.2s"
        bg={isOpen ? undefined : headerBg}
      >
        <HStack spacing={3}>
          <Box p={2} borderRadius="md" bg="purple.500" color="white">
            <Icon as={FiLayers} boxSize={4} />
          </Box>
          <Text fontWeight="bold" fontSize="lg">
            Your Topics
          </Text>
          <Badge
            colorScheme="purple"
            variant="solid"
            fontSize="md"
            px={3}
            py={1}
            borderRadius="full"
          >
            {clusterCount}
          </Badge>
        </HStack>
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            {isOpen ? 'Hide details' : 'Show details'}
          </Text>
          <Icon as={isOpen ? FiChevronUp : FiChevronDown} color="gray.500" boxSize={5} />
        </HStack>
      </HStack>

      {/* Expandable content */}
      <Collapse in={isOpen} animateOpacity>
        <Box borderTopWidth="1px" borderColor={borderColor}>
          <Table size="sm">
            <Thead bg={headerBg}>
              <Tr>
                <Th>
                  <Tooltip
                    label="Topic clusters = related keywords grouped together. This builds 'topical authority' with Google."
                    hasArrow
                    placement="top"
                  >
                    <Text as="span" cursor="help" borderBottom="1px dotted">
                      Topic Name
                    </Text>
                  </Tooltip>
                </Th>
                <Th isNumeric>
                  <Tooltip
                    label="Keywords in this cluster. More keywords = more content opportunities."
                    hasArrow
                    placement="top"
                  >
                    <Text as="span" cursor="help" borderBottom="1px dotted">
                      Keywords
                    </Text>
                  </Tooltip>
                </Th>
                <Th isNumeric>
                  <Tooltip
                    label="Combined monthly searches. Higher volume = bigger traffic opportunity for this topic."
                    hasArrow
                    placement="top"
                  >
                    <Text as="span" cursor="help" borderBottom="1px dotted">
                      Total Volume
                    </Text>
                  </Tooltip>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayClusters.map((cluster) => (
                <Tr key={cluster._id}>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium">
                      {cluster.clusterName || 'Untitled Topic'}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    <Badge colorScheme="blue" variant="subtle">
                      {cluster.keywords?.length || 0}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    <Text fontSize="sm" color="gray.600">
                      {cluster.totalVolume?.toLocaleString() || '—'}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {hasMore && (
            <HStack p={3} justify="center" bg={headerBg}>
              <Text fontSize="sm" color="gray.500">
                Showing {maxPreview} of {clusterCount} topics
              </Text>
            </HStack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
