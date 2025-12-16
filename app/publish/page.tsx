'use client';

/**
 * Publish Page
 *
 * Component Hierarchy:
 * App → Publish (this file)
 *
 * Schedule or publish approved content to CMS.
 * Uses extracted table and modal components.
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Button,
  HStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';

// Extracted components
import { ScheduledPostsTable, ScheduleModal, PublishSkeleton } from '@/src/components/publish';

function PublishPageContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams?.get('draftId');
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
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
    if (user) loadScheduledPosts();
  }, [user]);

  const loadScheduledPosts = async () => {
    const projectId = localStorage.getItem('projectId') || (user as any)?.projectId;
    if (!projectId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/publish?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
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
      toast({ title: 'No draft selected', status: 'error' });
      return;
    }
    const { publishDate, publishTime, timezone, platform, tags, categories, slug } = scheduleForm;
    if (!publishDate || !publishTime) {
      toast({ title: 'Please select date and time', status: 'error' });
      return;
    }
    const publishTimestamp = new Date(`${publishDate}T${publishTime}`).getTime();
    if (publishTimestamp < Date.now()) {
      toast({ title: 'Publish date must be in the future', status: 'error' });
      return;
    }

    setScheduling(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/publish/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          draftId,
          publishDate: publishTimestamp,
          timezone,
          platform,
          tags: tags ? tags.split(',').map((t) => t.trim()) : [],
          categories: categories ? categories.split(',').map((c) => c.trim()) : [],
          slug: slug || undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Post scheduled successfully', status: 'success' });
        onClose();
        await loadScheduledPosts();
      } else toast({ title: data.error || 'Failed to schedule', status: 'error' });
    } catch {
      toast({ title: 'Failed to schedule publish', status: 'error' });
    } finally {
      setScheduling(false);
    }
  };

  const handlePublishNow = async (postId?: string) => {
    const targetDraftId = postId ? scheduledPosts.find((p) => p._id === postId)?.draftId : draftId;
    if (!targetDraftId) {
      toast({ title: 'No draft selected', status: 'error' });
      return;
    }
    setPublishing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/publish/now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
      } else toast({ title: data.error || 'Failed to publish', status: 'error' });
    } catch {
      toast({ title: 'Failed to publish', status: 'error' });
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast({ title: 'Schedule cancelled', status: 'success' });
        await loadScheduledPosts();
      }
    } catch {
      toast({ title: 'Failed to cancel', status: 'error' });
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
              <Text color="gray.600">Schedule or publish approved content to your CMS</Text>
            </VStack>
            <HStack>
              {draftId && (
                <Button onClick={onOpen} bg="brand.orange" color="white" _hover={{ bg: '#E8851A' }}>
                  Schedule Publish
                </Button>
              )}
              {draftId && (
                <Button onClick={() => handlePublishNow()} isLoading={publishing} variant="outline">
                  Publish Now
                </Button>
              )}
            </HStack>
          </HStack>

          <ScheduledPostsTable
            posts={scheduledPosts}
            loading={loading}
            onPublishNow={handlePublishNow}
            onCancel={handleCancelSchedule}
          />
          <ScheduleModal
            isOpen={isOpen}
            onClose={onClose}
            form={scheduleForm}
            onFormChange={setScheduleForm}
            onSchedule={handleSchedulePublish}
            scheduling={scheduling}
          />
        </VStack>
      </Container>
    </Box>
  );
}

export default function PublishPage() {
  return (
    <Suspense fallback={<PublishSkeleton />}>
      <PublishPageContent />
    </Suspense>
  );
}
