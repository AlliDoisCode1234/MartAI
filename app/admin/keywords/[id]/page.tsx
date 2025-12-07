'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  Card,
  CardBody,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Stack,
  Button,
  Divider,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

export default function AdminKeywordDetailPage() {
  const params = useParams();
  const keywordId = params.id as Id<'keywordLibrary'>;

  const keyword = useQuery(api.seo.library.getKeyword, { id: keywordId });
  const searchLibrary = useAction(api.seo.library.searchLibrary);
  const [relatedKeywords, setRelatedKeywords] = useState<any[]>([]);

  useEffect(() => {
    if (keyword?.keyword) {
      searchLibrary({ query: keyword.keyword, limit: 6 }).then((results) => {
        // Filter out the current keyword itself
        setRelatedKeywords(results.filter((r: any) => r._id !== keywordId));
      });
    }
  }, [keyword?.keyword, keywordId, searchLibrary]);

  if (!keyword) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading keyword...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Link
        as={NextLink}
        href="/admin/keywords"
        mb={4}
        display="inline-flex"
        alignItems="center"
        color="gray.600"
      >
        <ArrowBackIcon mr={2} /> Back to Library
      </Link>

      <Box mb={8}>
        <Heading size="2xl" mb={2}>
          {keyword.keyword}
        </Heading>
        <Stack direction="row" spacing={4}>
          <Badge
            fontSize="md"
            colorScheme={
              keyword.difficulty > 60 ? 'red' : keyword.difficulty > 30 ? 'orange' : 'green'
            }
          >
            KD: {keyword.difficulty}
          </Badge>
          <Badge fontSize="md" colorScheme="purple" variant="outline">
            {keyword.intent}
          </Badge>
        </Stack>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Search Volume</StatLabel>
              <StatNumber>{keyword.searchVolume?.toLocaleString()}</StatNumber>
              <StatHelpText>Monthly estimations</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>CPC</StatLabel>
              <StatNumber>${keyword.cpc?.toFixed(2) || '0.00'}</StatNumber>
              <StatHelpText>Cost Per Click</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Embedding Status</StatLabel>
              <StatNumber fontSize="lg">Active</StatNumber>
              <StatHelpText>Vectorized & Searchable</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      <Divider my={8} />

      <Heading size="lg" mb={6}>
        Semantically Related Keywords
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {relatedKeywords.map((related) => (
          <Card
            key={related._id}
            variant="outline"
            _hover={{ borderColor: 'blue.500', shadow: 'md' }}
            transition="all 0.2s"
          >
            <CardBody>
              <Link as={NextLink} href={`/admin/keywords/${related._id}`}>
                <Heading size="md" mb={2}>
                  {related.keyword}
                </Heading>
              </Link>
              <Stack direction="row" justify="space-between" fontSize="sm" color="gray.600">
                <Text>Vol: {related.searchVolume?.toLocaleString()}</Text>
                <Text>KD: {related.difficulty}</Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
        {relatedKeywords.length === 0 && <Text color="gray.500">Finding related concepts...</Text>}
      </Grid>
    </Container>
  );
}
