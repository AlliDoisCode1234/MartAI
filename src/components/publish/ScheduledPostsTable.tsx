'use client';

/**
 * ScheduledPostsTable Component
 *
 * Component Hierarchy:
 * App → Publish → ScheduledPostsTable (this file)
 *
 * Table displaying scheduled posts with actions.
 */

import {
  Card,
  CardBody,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  Alert,
  AlertIcon,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { formatDate } from '@/lib/dateUtils';

type Post = {
  _id: string;
  slug?: string;
  platform: string;
  publishDate: number;
  timezone: string;
  status: string;
  publishedUrl?: string;
  draftId?: string;
};

type Props = {
  posts: Post[];
  loading: boolean;
  onPublishNow: (postId: string) => void;
  onCancel: (postId: string) => void;
};

function getStatusColor(status: string) {
  switch (status) {
    case 'scheduled':
      return 'blue';
    case 'publishing':
      return 'yellow';
    case 'published':
      return 'green';
    case 'failed':
      return 'red';
    case 'cancelled':
      return 'gray';
    default:
      return 'gray';
  }
}

export function ScheduledPostsTable({ posts, loading, onPublishNow, onCancel }: Props) {
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Scheduled Posts</Heading>
          {loading ? (
            <Spinner />
          ) : posts.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text>No scheduled posts. Schedule a publish to get started.</Text>
            </Alert>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Platform</Th>
                  <Th>Publish Date</Th>
                  <Th>Timezone</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {posts.map((post) => (
                  <Tr key={post._id}>
                    <Td>{post.slug || 'Untitled'}</Td>
                    <Td>
                      <Badge>{post.platform}</Badge>
                    </Td>
                    <Td>{formatDate(post.publishDate, 'PP p')}</Td>
                    <Td>{post.timezone}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(post.status)}>{post.status}</Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        {post.status === 'scheduled' && (
                          <>
                            <Button size="sm" onClick={() => onPublishNow(post._id)}>
                              Publish Now
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onCancel(post._id)}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {post.publishedUrl && (
                          <Button
                            size="sm"
                            as="a"
                            href={post.publishedUrl}
                            target="_blank"
                            variant="link"
                          >
                            View
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
