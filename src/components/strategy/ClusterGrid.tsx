'use client';

/**
 * ClusterGrid Component
 *
 * Component Hierarchy:
 * App → Strategy → ClusterGrid (this file)
 *
 * Displays topic clusters in a grid layout.
 */

import {
  Grid,
  GridItem,
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
} from '@chakra-ui/react';
import { getIntentColor } from '@/lib/constants/strategy';

type Cluster = {
  _id: string;
  clusterName: string;
  intent: string;
  impactScore: number;
  keywords: string[];
};

type Props = {
  clusters: Cluster[];
  maxDisplay?: number;
};

export function ClusterGrid({ clusters, maxDisplay = 6 }: Props) {
  if (clusters.length === 0) return null;

  return (
    <>
      <Heading size="lg" color="white">
        Target Topics (Keyword Clusters)
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {clusters.slice(0, maxDisplay).map((cluster, index) => (
          <GridItem key={cluster._id || index} display="flex">
            <Card
              h="100%"
              w="100%"
              minH="100px"
              bg="rgba(30, 30, 30, 0.6)"
              borderWidth="1px"
              borderColor="rgba(255, 255, 255, 0.1)"
            >
              <CardBody>
                <VStack align="stretch" spacing={2} h="100%" justify="space-between">
                  <HStack justify="space-between" align="flex-start">
                    <Heading size="sm" noOfLines={2} flex="1" mr={2} color="white">
                      {cluster.clusterName}
                    </Heading>
                    <Badge colorScheme={getIntentColor(cluster.intent)} flexShrink={0}>
                      {cluster.intent}
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="gray.400">
                    Impact: {cluster.impactScore.toFixed(2)} | {cluster.keywords.length} keywords
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </>
  );
}
