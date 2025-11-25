'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Button, HStack, Card, CardBody, Badge, Alert, AlertIcon, Spinner, Input, FormControl, FormLabel, Select, Table, Thead, Tbody, Tr, Th, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, useToast } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';

function PublishPageContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams?.get('draftId');
  const { user } = useAuth();
  const toast = useToast();
  
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [scheduleForm, setScheduleForm] = useState({
    publishDate: '',
    publishTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: 'wordpress',
    tags: '',
    categories: '',
    slug: '',
  });

  useEffect(() => {
    if (user) {
      loadScheduledPosts();
    }
  }, [user]);

  const loadScheduledPosts = async () => {
    // Get projectId from localStorage or user
    const projectId = localStorage.getItem('projectId') || (user as any)?.projectId;
    if (!projectId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/publish?projectId=${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setScheduledPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error loading scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePublish = async () => {
    if (!draftId) {
      toast({
        title: 'No draft selected',
        status: 'error',
      });
      return;
    }

    const { publishDate, publishTime, timezone, platform, tags, categories, slug } = scheduleForm;
    
    if (!publishDate || !publishTime) {
      toast({
        title: 'Please select date and time',
        status: 'error',
      });
      return;
    }

    // Combine date and time
    const publishDateTime = new Date(`${publishDate}T${publishTime}`);
    const publishTimestamp = publishDateTime.getTime();

    if (publishTimestamp < Date.now()) {
      toast({
        title: 'Publish date must be in the future',
        status: 'error',
      });
      return;
    }

    setScheduling(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/publish/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          draftId,
          publishDate: publishTimestamp,
          timezone,
          platform,
          tags: tags ? tags.split(',').map(t => t.trim()) : [],
          categories: categories ? categories.split(',').map(c => c.trim()) : [],
          slug: slug || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Post scheduled successfully',
          status: 'success',
        });
        onClose();
        await loadScheduledPosts();
      } else {
        toast({
          title: data.error || 'Failed to schedule',
          status: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to schedule publish',
        status: 'error',
      });
    } finally {
      setScheduling(false);
    }
  };

  const handlePublishNow = async (postId?: string) => {
    const targetDraftId = postId ? scheduledPosts.find(p => p._id === postId)?.draftId : draftId;
    
    if (!targetDraftId) {
      toast({
        title: 'No draft selected',
        status: 'error',
      });
      return;
    }

    setPublishing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/publish/now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          draftId: targetDraftId,
          platform: scheduleForm.platform,
          slug: scheduleForm.slug || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Published successfully',
          description: data.url ? `View at ${data.url}` : '',
          status: 'success',
        });
        await loadScheduledPosts();
      } else {
        toast({
          title: data.error || 'Failed to publish',
          status: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to publish',
        status: 'error',
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleCancelSchedule = async (postId: string) => {
    if (!confirm('Cancel this scheduled post?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/publish?postId=${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: 'Schedule cancelled',
          status: 'success',
        });
        await loadScheduledPosts();
      }
    } catch (error) {
      toast({
        title: 'Failed to cancel',
        status: 'error',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'publishing': return 'yellow';
      case 'published': return 'green';
      case 'failed': return 'red';
      case 'cancelled': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={2}>
              <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                Publishing & Scheduling
              </Heading>
              <Text color="gray.600">
                Schedule or publish approved content to your CMS
              </Text>
            </VStack>
            <HStack>
              {draftId && (
                <Button
                  onClick={onOpen}
                  bg="brand.orange"
                  color="white"
                  _hover={{ bg: '#E8851A' }}
                >
                  Schedule Publish
                </Button>
              )}
              {draftId && (
                <Button
                  onClick={() => handlePublishNow()}
                  isLoading={publishing}
                  variant="outline"
                >
                  Publish Now
                </Button>
              )}
            </HStack>
          </HStack>

          {/* Scheduled Posts Table */}
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Scheduled Posts</Heading>
                {loading ? (
                  <Spinner />
                ) : scheduledPosts.length === 0 ? (
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
                      {scheduledPosts.map((post) => (
                        <Tr key={post._id}>
                          <Td>{post.slug || 'Untitled'}</Td>
                          <Td>
                            <Badge>{post.platform}</Badge>
                          </Td>
                          <Td>
                            {new Date(post.publishDate).toLocaleString()}
                          </Td>
                          <Td>{post.timezone}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              {post.status === 'scheduled' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handlePublishNow(post._id)}
                                  >
                                    Publish Now
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCancelSchedule(post._id)}
                                  >
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
        </VStack>
      </Container>

      {/* Schedule Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Publish</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Publish Date</FormLabel>
                <Input
                  type="date"
                  value={scheduleForm.publishDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, publishDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Publish Time</FormLabel>
                <Input
                  type="time"
                  value={scheduleForm.publishTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, publishTime: e.target.value })}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Timezone</FormLabel>
                <Select
                  value={scheduleForm.timezone}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, timezone: e.target.value })}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="UTC">UTC</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Platform</FormLabel>
                <Select
                  value={scheduleForm.platform}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, platform: e.target.value })}
                >
                  <option value="wordpress">WordPress</option>
                  <option value="shopify">Shopify</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Slug (optional)</FormLabel>
                <Input
                  value={scheduleForm.slug}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, slug: e.target.value })}
                  placeholder="post-url-slug"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Tags (comma-separated)</FormLabel>
                <Input
                  value={scheduleForm.tags}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Categories (comma-separated)</FormLabel>
                <Input
                  value={scheduleForm.categories}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, categories: e.target.value })}
                  placeholder="category1, category2"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="brand.orange"
              color="white"
              onClick={handleSchedulePublish}
              isLoading={scheduling}
            >
              Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default function PublishPage() {
  return (
    <Suspense fallback={
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    }>
      <PublishPageContent />
    </Suspense>
  );
}

