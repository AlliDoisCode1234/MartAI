'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Badge,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  HStack,
  Skeleton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function KeywordDetailPage() {
  const params = useParams();
  const keywordId = params.id as Id<'keywords'>;

  const keyword = useQuery(api.seo.keywords.getKeyword, { keywordId });

  if (keyword === undefined) {
    return (
      <Box minH="calc(100vh - 64px)" bg="var(--phoo-bg-primary)">
        <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
          <VStack spacing={6} align="stretch">
            <Skeleton
              height="32px"
              width="100px"
              borderRadius="md"
              startColor="gray.700"
              endColor="gray.600"
            />
            <Skeleton
              height="48px"
              width="300px"
              borderRadius="md"
              startColor="gray.700"
              endColor="gray.600"
            />
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
              {[1, 2, 3, 4].map((i) => (
                <GridItem key={i}>
                  <Skeleton
                    height="120px"
                    borderRadius="lg"
                    startColor="gray.700"
                    endColor="gray.600"
                  />
                </GridItem>
              ))}
            </Grid>
            <Skeleton height="200px" borderRadius="lg" startColor="gray.700" endColor="gray.600" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (keyword === null) {
    return (
      <Container maxW="container.md" py={12}>
        <Heading color="var(--phoo-text-primary)">Keyword Not Found</Heading>
        <Link as={NextLink} href="/keywords" color="var(--phoo-accent)">
          Back to Keywords
        </Link>
      </Container>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="var(--phoo-bg-primary)">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={4}>
            <Button
              as={NextLink}
              href="/keywords"
              variant="ghost"
              color="var(--phoo-text-secondary)"
              _hover={{ color: 'var(--phoo-text-primary)', bg: 'var(--phoo-bg-hover)' }}
              leftIcon={<ArrowBackIcon />}
              size="sm"
            >
              Back to List
            </Button>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={1}>
                <Heading size="2xl" fontFamily="heading" color="var(--phoo-text-primary)">
                  {keyword.keyword}
                </Heading>
                <HStack>
                  <Badge colorScheme={keyword.status === 'approved' ? 'green' : 'gray'}>
                    {keyword.status}
                  </Badge>
                  <Badge colorScheme="purple">{keyword.priority} Priority</Badge>
                </HStack>
              </VStack>
              <HStack>
                <Button
                  bg="var(--phoo-accent)"
                  color="white"
                  _hover={{ bg: 'var(--phoo-accent-hover)' }}
                >
                  Create Content
                </Button>
              </HStack>
            </HStack>
          </VStack>

          {/* Stats Grid */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
            <GridItem>
              <Box
                bg="var(--phoo-bg-surface)"
                p={6}
                borderRadius="var(--phoo-radius-md)"
                border="1px solid"
                borderColor="var(--phoo-border)"
              >
                <Stat>
                  <StatLabel color="var(--phoo-text-muted)">Search Volume</StatLabel>
                  <StatNumber color="var(--phoo-text-primary)">
                    {keyword.searchVolume?.toLocaleString() || 'N/A'}
                  </StatNumber>
                  <StatHelpText color="var(--phoo-text-secondary)">Monthly Searches</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
            <GridItem>
              <Box
                bg="var(--phoo-bg-surface)"
                p={6}
                borderRadius="var(--phoo-radius-md)"
                border="1px solid"
                borderColor="var(--phoo-border)"
              >
                <Stat>
                  <StatLabel color="var(--phoo-text-muted)">Difficulty</StatLabel>
                  <StatNumber color="var(--phoo-text-primary)">
                    {keyword.difficulty || 'N/A'}/100
                  </StatNumber>
                  <StatHelpText color="var(--phoo-text-secondary)">SEO Difficulty</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
            <GridItem>
              <Box
                bg="var(--phoo-bg-surface)"
                p={6}
                borderRadius="var(--phoo-radius-md)"
                border="1px solid"
                borderColor="var(--phoo-border)"
              >
                <Stat>
                  <StatLabel color="var(--phoo-text-muted)">CPC</StatLabel>
                  <StatNumber color="var(--phoo-text-primary)">${keyword.cpc || '0.00'}</StatNumber>
                  <StatHelpText color="var(--phoo-text-secondary)">Cost Per Click</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
            <GridItem>
              <Box
                bg="var(--phoo-bg-surface)"
                p={6}
                borderRadius="var(--phoo-radius-md)"
                border="1px solid"
                borderColor="var(--phoo-border)"
              >
                <Stat>
                  <StatLabel color="var(--phoo-text-muted)">Intent</StatLabel>
                  <StatNumber textTransform="capitalize" color="var(--phoo-text-primary)">
                    {keyword.intent || 'Unknown'}
                  </StatNumber>
                  <StatHelpText color="var(--phoo-text-secondary)">User Intent</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
          </Grid>

          {/* Analysis / Content Plan Placeholder */}
          <Box
            bg="var(--phoo-bg-surface)"
            p={6}
            borderRadius="var(--phoo-radius-md)"
            border="1px solid"
            borderColor="var(--phoo-border)"
          >
            <Heading size="md" mb={4} color="var(--phoo-text-primary)">
              Analysis & Strategy
            </Heading>
            <Text color="var(--phoo-text-secondary)">
              Currently no detailed AI analysis stored for this keyword. Running a "Deep Dive" would
              populate this section with SERP competitors, content gaps, and structural
              recommendations.
            </Text>
          </Box>

          {/* Accordion for Technical Details */}
          <Accordion allowToggle>
            <AccordionItem border="none">
              <AccordionButton
                px={0}
                color="var(--phoo-text-primary)"
                _hover={{ bg: 'transparent' }}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  Raw Data
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box
                  as="pre"
                  bg="var(--phoo-bg-elevated)"
                  color="var(--phoo-text-secondary)"
                  p={4}
                  borderRadius="md"
                  overflowX="auto"
                  fontSize="sm"
                  border="1px solid"
                  borderColor="var(--phoo-border)"
                >
                  {JSON.stringify(keyword, null, 2)}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </Container>
    </Box>
  );
}
