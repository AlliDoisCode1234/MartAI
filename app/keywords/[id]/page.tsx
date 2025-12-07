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
  Spinner,
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
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="brand.orange" />
      </Box>
    );
  }

  if (keyword === null) {
    return (
      <Container maxW="container.md" py={12}>
        <Heading>Keyword Not Found</Heading>
        <Link as={NextLink} href="/keywords" color="brand.orange">
          Back to Keywords
        </Link>
      </Container>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={4}>
            <Button
              as={NextLink}
              href="/keywords"
              variant="ghost"
              leftIcon={<ArrowBackIcon />}
              size="sm"
            >
              Back to List
            </Button>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={1}>
                <Heading size="2xl" fontFamily="heading">
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
                <Button colorScheme="brand" bg="brand.orange" color="white">
                  Create Content
                </Button>
              </HStack>
            </HStack>
          </VStack>

          {/* Stats Grid */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Stat>
                  <StatLabel>Search Volume</StatLabel>
                  <StatNumber>{keyword.searchVolume?.toLocaleString() || 'N/A'}</StatNumber>
                  <StatHelpText>Monthly Searches</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Stat>
                  <StatLabel>Difficulty</StatLabel>
                  <StatNumber>{keyword.difficulty || 'N/A'}/100</StatNumber>
                  <StatHelpText>SEO Difficulty</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Stat>
                  <StatLabel>CPC</StatLabel>
                  <StatNumber>${keyword.cpc || '0.00'}</StatNumber>
                  <StatHelpText>Cost Per Click</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Stat>
                  <StatLabel>Intent</StatLabel>
                  <StatNumber textTransform="capitalize">{keyword.intent || 'Unknown'}</StatNumber>
                  <StatHelpText>User Intent</StatHelpText>
                </Stat>
              </Box>
            </GridItem>
          </Grid>

          {/* Analysis / Content Plan Placeholder */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>
              Analysis & Strategy
            </Heading>
            <Text color="gray.600">
              {/* Placeholder for reasoning field if it existed in previous schema versions or new analysis */}
              Currently no detailed AI analysis stored for this keyword. Running a "Deep Dive" would
              populate this section with SERP competitors, content gaps, and structural
              recommendations.
            </Text>
          </Box>

          {/* Accordion for Technical Details */}
          <Accordion allowToggle>
            <AccordionItem border="none">
              <AccordionButton px={0}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  Raw Data
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box as="pre" bg="gray.50" p={4} borderRadius="md" overflowX="auto" fontSize="sm">
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
