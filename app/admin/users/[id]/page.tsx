'use client';

/**
 * Admin User Detail Page
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] (this file)
 *
 * Clean page using extracted components (~100 lines).
 */

import { use, useState } from 'react';
import {
  Container,
  VStack,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';

// Admin components
import {
  SubscriptionCard,
  HealthScoreCard,
  UserHeaderCard,
  OnboardingJourneyCard,
  ProjectsTableCard,
  EngagementMilestonesCard,
} from '@/components/admin';

// Shared components
import { StatCard, ConfirmModal, DangerZone, DangerAction } from '@/components/shared';
import {
  UserHeaderSkeleton,
  StatsSkeleton,
  CardSkeleton,
  TableSkeleton,
} from '@/components/skeletons';

// Utils and types
import { calculateOnboardingProgress } from '@/lib/utils/onboarding';
import type { OnboardingSteps, EngagementMilestones, HealthData } from '@/types/admin';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = id as Id<'users'>;

  // Data
  const user = useQuery(api.admin.users.getUserDetails, { userId });
  const projects = useQuery(api.projects.projects.getProjectsByUser, { userId });
  const health = useQuery(api.subscriptions.userHealth.computeUserHealth, { userId });

  // Mutations
  const resetOnboarding = useMutation(api.users.resetOnboarding);
  const sendResetEmail = useMutation(api.admin.users.sendPasswordResetEmail);
  const sendEmail = useAction(api.email.emailActions.sendPasswordResetEmail);
  const updateStatus = useMutation(api.admin.users.updateAccountStatus);

  // Modals
  const resetModal = useDisclosure();
  const passwordModal = useDisclosure();
  const statusModal = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('active');
  const toast = useToast();

  // Handlers
  const handleReset = async () => {
    setIsLoading(true);
    try {
      await resetOnboarding({ userId });
      toast({ title: 'Onboarding Reset', status: 'success' });
      resetModal.onClose();
    } catch {
      toast({ title: 'Failed', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassword = async () => {
    setIsLoading(true);
    try {
      // Generate token and get user details
      const result = await sendResetEmail({ userId });
      if (result.success && result.email && result.token) {
        // Send the email
        await sendEmail({
          email: result.email,
          name: result.name,
          token: result.token,
        });
        toast({
          title: 'Reset Email Sent',
          description: `Password reset email sent to ${result.email}`,
          status: 'success',
        });
      }
      passwordModal.onClose();
    } catch (err) {
      toast({ title: 'Failed to send email', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatus = async () => {
    setIsLoading(true);
    try {
      await updateStatus({ userId, accountStatus: newStatus as any });
      toast({ title: 'Status Changed', status: 'success' });
      statusModal.onClose();
    } catch {
      toast({ title: 'Failed', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading skeleton
  if (!user) {
    return (
      <Container maxW="container.xl" py={4}>
        <VStack spacing={6} align="stretch">
          <UserHeaderSkeleton />
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <CardSkeleton />
            <CardSkeleton />
          </SimpleGrid>
          <StatsSkeleton count={4} />
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <CardSkeleton lines={6} />
            <TableSkeleton columns={4} rows={3} />
          </SimpleGrid>
        </VStack>
      </Container>
    );
  }

  const progress = calculateOnboardingProgress(user.onboardingSteps as OnboardingSteps);
  const milestones = user.engagementMilestones as EngagementMilestones | undefined;

  return (
    <Container maxW="container.xl" py={4}>
      {/* Breadcrumb */}
      <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/admin">
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/admin/users">
            Users
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{user.name || 'User'}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={6} align="stretch">
        <UserHeaderCard user={user} />

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <SubscriptionCard subscription={user.subscription} />
          <HealthScoreCard health={health as HealthData | null} />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <StatCard
            label="Onboarding"
            value={`${progress}%`}
            helpText={user.onboardingStatus === 'completed' ? 'Complete' : 'In Progress'}
          />
          <StatCard label="Projects" value={user.projectCount || 0} />
          <StatCard
            label="Health"
            value={health?.overall || '—'}
            helpText={health?.tier || 'N/A'}
          />
          <StatCard
            label="ID"
            value={`${userId.slice(0, 12)}...`}
            valueSize="xs"
            fontFamily="mono"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <OnboardingJourneyCard steps={user.onboardingSteps as OnboardingSteps} />
          <ProjectsTableCard projects={projects} />
        </SimpleGrid>

        {milestones && <EngagementMilestonesCard milestones={milestones} />}

        <DangerZone>
          <DangerAction
            title="Reset Onboarding"
            description="Clear all onboarding progress."
            buttonLabel="Reset"
            onClick={resetModal.onOpen}
          />
          <DangerAction
            title="Send Reset Email"
            description="Send password reset link via email."
            buttonLabel="Send"
            onClick={passwordModal.onOpen}
          />
          <DangerAction
            title="Change Status"
            description="Suspend, reactivate, or mark churned."
            buttonLabel="Change"
            onClick={() => {
              setNewStatus(user.accountStatus || 'active');
              statusModal.onOpen();
            }}
          />
        </DangerZone>
      </VStack>

      {/* Modals */}
      <ConfirmModal
        isOpen={resetModal.isOpen}
        onClose={resetModal.onClose}
        onConfirm={handleReset}
        title="Reset Onboarding?"
        message={`Reset for <strong>${user.name || user.email}</strong>?`}
        confirmLabel="Reset"
        isLoading={isLoading}
      />
      <ConfirmModal
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.onClose}
        onConfirm={handlePassword}
        title="Send Password Reset Email?"
        message={`Send a password reset email to <strong>${user.email || user.name}</strong>? They will receive a link to set a new password.`}
        confirmLabel="Send Email"
        isLoading={isLoading}
      />
      <ConfirmModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.onClose}
        onConfirm={handleStatus}
        title="Change Status"
        message={`<div style="margin-bottom:16px">Status for <strong>${user.name}</strong></div>`}
        confirmLabel="Change"
        isLoading={isLoading}
      >
        <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} mt={2}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="churned">Churned</option>
          <option value="suspended">Suspended</option>
        </Select>
      </ConfirmModal>
    </Container>
  );
}
