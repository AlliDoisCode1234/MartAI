import React, { useState } from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Box,
  Grid,
} from '@chakra-ui/react';
import InsightCard from './InsightCard';

interface Insight {
  _id: string;
  type: string;
  title: string;
  description: string;
  action?: string;
}

interface InsightsListProps {
  insights: Insight[];
  onApplyInsight: (id: string) => void;
  onSync: () => void;
}

const InsightsList: React.FC<InsightsListProps> = ({ insights, onApplyInsight, onSync }) => {
  const [filterType, setFilterType] = useState<string>('all');

  return (
    <Card shadow="xl" bg="white" border="1px" borderColor="gray.200">
      <CardBody>
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="lg" fontFamily="heading" color="gray.800">
                💡 Actionable Insights
              </Heading>
              <Text fontSize="sm" color="gray.600">
                AI-powered recommendations to improve your SEO
              </Text>
            </VStack>
            <Badge
              colorScheme="orange"
              fontSize="md"
              px={4}
              py={2}
              borderRadius="full"
              fontWeight="bold"
            >
              {insights.length} {insights.length === 1 ? 'insight' : 'insights'}
            </Badge>
          </HStack>

          {/* Insight Filters */}
          {insights.length > 0 && (
            <HStack spacing={2} pb={2}>
              <Button
                size="xs"
                variant={filterType === 'all' ? 'solid' : 'outline'}
                colorScheme="gray"
                onClick={() => setFilterType('all')}
              >
                All Matches
              </Button>
              <Button
                size="xs"
                variant={filterType === 'top_gainer' ? 'solid' : 'outline'}
                colorScheme="green"
                onClick={() => setFilterType('top_gainer')}
              >
                Gains
              </Button>
              <Button
                size="xs"
                variant={filterType === 'underperformer' ? 'solid' : 'outline'}
                colorScheme="red"
                onClick={() => setFilterType('underperformer')}
              >
                Issues
              </Button>
              <Button
                size="xs"
                variant={filterType === 'quick_win' ? 'solid' : 'outline'}
                colorScheme="orange"
                onClick={() => setFilterType('quick_win')}
              >
                Quick Wins
              </Button>
            </HStack>
          )}

          {insights.length === 0 ? (
            <Box
              bgGradient="linear(to-br, brand.lavender, brand.teal)"
              p={8}
              borderRadius="xl"
              border="2px dashed"
              borderColor="brand.orange"
              textAlign="center"
            >
              <VStack spacing={4}>
                <Text fontSize="5xl">✨</Text>
                <VStack spacing={2}>
                  <Heading size="md" fontFamily="heading" color="gray.800">
                    No insights yet
                  </Heading>
                  <Text fontSize="sm" color="gray.600" maxW="md">
                    Sync your GA4 and GSC data to generate AI-powered actionable insights
                  </Text>
                </VStack>
                <Button
                  onClick={onSync}
                  bg="brand.orange"
                  color="white"
                  _hover={{ bg: '#E8851A', transform: 'scale(1.05)' }}
                  size="md"
                  fontWeight="bold"
                  shadow="lg"
                >
                  🚀 Sync Data Now
                </Button>
              </VStack>
            </Box>
          ) : (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={5}
            >
              {insights
                .filter((i) => filterType === 'all' || i.type === filterType)
                .map((insight, i) => (
                  <InsightCard key={i} insight={insight} onApply={onApplyInsight} />
                ))}
            </Grid>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default InsightsList;
