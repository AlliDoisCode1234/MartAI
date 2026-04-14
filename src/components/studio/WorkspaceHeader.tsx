'use client';

/**
 * WorkspaceHeader
 *
 * Component Hierarchy:
 * App -> StudioLayout -> StudioSidebar -> WorkspaceHeader
 * App -> Layout -> Navigation -> MobileNav -> WorkspaceHeader
 *
 * Vercel/Notion-inspired unified workspace header combining:
 * - Organization selector (top line): current org with dropdown
 * - Project selector (bottom line): current project with dropdown
 *
 * Supports both dark (sidebar) and light (mobile drawer) variants.
 * Only shows org dropdown when user belongs to 2+ organizations.
 * Projects are scoped to the current organization.
 */

import { type FC, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
  VStack,
  Tooltip,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FiBriefcase,
  FiFolder,
  FiCheck,
  FiChevronDown,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import { useProjectContext } from '@/src/providers/ProjectProvider';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DeleteProjectModal } from '../settings/DeleteProjectModal';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);

interface OrgItem {
  _id: Id<'organizations'>;
  name: string;
  role: string;
}

// Theme tokens for dark (sidebar) and light (mobile drawer) variants
const THEME = {
  dark: {
    containerBg: 'whiteAlpha.50',
    containerBorder: 'whiteAlpha.100',
    labelColor: 'whiteAlpha.800',
    sublabelColor: 'whiteAlpha.700',
    mutedColor: 'whiteAlpha.500',
    iconMuted: 'whiteAlpha.600',
    hoverBg: 'whiteAlpha.100',
    dividerBg: 'whiteAlpha.100',
  },
  light: {
    containerBg: 'gray.50',
    containerBorder: 'gray.200',
    labelColor: 'gray.800',
    sublabelColor: 'gray.600',
    mutedColor: 'gray.400',
    iconMuted: 'gray.500',
    hoverBg: 'orange.50',
    dividerBg: 'gray.200',
  },
} as const;

interface Props {
  collapsed?: boolean;
  /** Visual variant: 'dark' for sidebar, 'light' for mobile drawer */
  variant?: 'dark' | 'light';
}

export const WorkspaceHeader: FC<Props> = ({ collapsed = false, variant = 'dark' }) => {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const deleteModal = useDisclosure();
  const [isSwitching, setIsSwitching] = useState(false);

  const t = THEME[variant];

  // Data
  const organizations = useQuery(api.teams.teams.getMyOrganizations) as OrgItem[] | undefined;
  const projects = useQuery(api.projects.projects.list, user?._id ? undefined : 'skip');
  const projectLimits = useQuery(
    api.projects.projects.getProjectCreationLimits,
    user?.organizationId ? { organizationId: user.organizationId as Id<'organizations'> } : {}
  );
  const switchOrg = useMutation(api.users.switchOrganization);

  // Context
  let projectId: string | null = null;
  try {
    const ctx = useProjectContext();
    projectId = ctx.projectId;
  } catch {
    // ProjectProvider may not be mounted yet
  }

  if (!user) return null;

  const currentOrg = organizations?.find((org) => org._id === user.organizationId);
  const currentProject = projects?.find((p: any) => p._id === projectId);
  const hasMultipleOrgs = (organizations?.length ?? 0) > 1;

  const handleOrgSwitch = async (organizationId: Id<'organizations'>, orgName: string) => {
    if (organizationId === user.organizationId) return;
    setIsSwitching(true);

    try {
      // Context Memory: save current project for outgoing org
      const currentOrgId = user.organizationId;
      const currentProjId = (() => {
        try { return localStorage.getItem('currentProjectId'); } catch { return null; }
      })();
      if (currentOrgId && currentProjId) {
        try {
          const map = JSON.parse(localStorage.getItem('orgProjectMap') || '{}');
          map[currentOrgId] = currentProjId;
          localStorage.setItem('orgProjectMap', JSON.stringify(map));
        } catch { /* noop */ }
      }

      await switchOrg({ organizationId });

      // Context Memory: restore last project for incoming org
      try {
        const map = JSON.parse(localStorage.getItem('orgProjectMap') || '{}');
        const last = map[organizationId];
        if (last) {
          localStorage.setItem('currentProjectId', last);
        } else {
          localStorage.removeItem('currentProjectId');
        }
      } catch {
        try { localStorage.removeItem('currentProjectId'); } catch { /* noop */ }
      }

      router.push('/studio');
      toast({
        title: 'Workspace Switched',
        description: `Now working in ${orgName}`,
        status: 'success',
        duration: 2000,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Failed to switch workspace',
        description: message,
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const handleProjectSwitch = (newProjectId: string) => {
    if (newProjectId === projectId) return;
    try {
      localStorage.setItem('currentProjectId', newProjectId);
    } catch { /* noop */ }
    // Force page reload to reset all project-scoped queries
    window.location.href = '/studio';
  };

  // Collapsed: show compact icon-only version
  if (collapsed) {
    return (
      <Tooltip
        label={`${currentOrg?.name || 'Workspace'} / ${currentProject?.name || 'No project'}`}
        placement="right"
        hasArrow
        bg="gray.900"
        color="white"
        fontSize="xs"
      >
        <Flex
          align="center"
          justify="center"
          mx={2}
          mb={4}
          p={2}
          borderRadius="10px"
          bg={t.containerBg}
          border="1px solid"
          borderColor={t.containerBorder}
          cursor="default"
        >
          <Icon as={FiBriefcase} boxSize={4} color="brand.orange" />
        </Flex>
      </Tooltip>
    );
  }

  return (
    <>
    <AnimatePresence mode="wait">
      <MotionBox
        key={`${user.organizationId}-${projectId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        mx={3}
        mb={4}
        p={3}
        borderRadius="12px"
        bg={t.containerBg}
        border="1px solid"
        borderColor={t.containerBorder}
        opacity={isSwitching ? 0.6 : 1}
        pointerEvents={isSwitching ? 'none' : 'auto'}
      >
        <VStack spacing={2} align="stretch">
          {/* Organization Row */}
          {hasMultipleOrgs ? (
            <Menu>
              <MenuButton
                as={Flex}
                align="center"
                gap={2}
                cursor="pointer"
                px={2}
                py={1.5}
                borderRadius="8px"
                _hover={{ bg: t.hoverBg }}
                transition="all 0.15s"
                role="button"
                tabIndex={0}
              >
                <HStack spacing={2} flex={1} minW={0}>
                  <Icon as={FiBriefcase} boxSize={3.5} color="brand.orange" flexShrink={0} />
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color={t.labelColor}
                    noOfLines={1}
                    flex={1}
                  >
                    {currentOrg?.name || 'Select Workspace'}
                  </Text>
                  <Icon as={FiChevronDown} boxSize={3} color={t.mutedColor} flexShrink={0} />
                </HStack>
              </MenuButton>
              <MenuList
                bg="gray.900"
                borderColor="whiteAlpha.200"
                minW="220px"
                py={1}
                shadow="xl"
              >
                {organizations?.map((org) => (
                  <MenuItem
                    key={org._id}
                    onClick={() => handleOrgSwitch(org._id, org.name)}
                    bg="transparent"
                    _hover={{ bg: 'whiteAlpha.100' }}
                    px={3}
                    py={2}
                  >
                    <HStack spacing={3} w="100%" justify="space-between">
                      <HStack spacing={2} minW={0} flex={1}>
                        <Icon
                          as={FiBriefcase}
                          boxSize={3.5}
                          color={org._id === user.organizationId ? 'brand.orange' : 'whiteAlpha.500'}
                        />
                        <Box minW={0}>
                          <Text
                            fontSize="sm"
                            fontWeight={org._id === user.organizationId ? '600' : '400'}
                            color="white"
                            noOfLines={1}
                          >
                            {org.name}
                          </Text>
                          <Text fontSize="2xs" color="whiteAlpha.500" textTransform="capitalize">
                            {org.role}
                          </Text>
                        </Box>
                      </HStack>
                      {org._id === user.organizationId && (
                        <Icon as={FiCheck} boxSize={3.5} color="brand.orange" />
                      )}
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={2} px={2} py={1}>
              <Icon as={FiBriefcase} boxSize={3.5} color="brand.orange" />
              <Text fontSize="xs" fontWeight="600" color={t.labelColor} noOfLines={1}>
                {currentOrg?.name || 'Workspace'}
              </Text>
            </HStack>
          )}

          {/* Divider */}
          <Box h="1px" bg={t.dividerBg} mx={1} />

          {/* Project Row */}
          <Menu>
            <MenuButton
              as={Flex}
              align="center"
              gap={2}
              cursor="pointer"
              px={2}
              py={1.5}
              borderRadius="8px"
              _hover={{ bg: t.hoverBg }}
              transition="all 0.15s"
              role="button"
              tabIndex={0}
            >
              <HStack spacing={2} flex={1} minW={0}>
                <Icon as={FiFolder} boxSize={3.5} color={t.iconMuted} flexShrink={0} />
                <Text
                  fontSize="xs"
                  fontWeight="500"
                  color={t.sublabelColor}
                  noOfLines={1}
                  flex={1}
                >
                  {currentProject?.name || 'Select Project'}
                </Text>
                <Icon as={FiChevronDown} boxSize={3} color={t.mutedColor} flexShrink={0} />
              </HStack>
            </MenuButton>
            <MenuList
              bg="gray.900"
              borderColor="whiteAlpha.200"
              minW="220px"
              py={1}
              shadow="xl"
            >
              {projects && projects.length > 0 ? (
                projects.map((project: any) => (
                  <MenuItem
                    key={project._id}
                    onClick={() => handleProjectSwitch(project._id)}
                    bg="transparent"
                    _hover={{ bg: 'whiteAlpha.100' }}
                    px={3}
                    py={2}
                  >
                    <HStack spacing={3} w="100%" justify="space-between">
                      <HStack spacing={2} minW={0} flex={1}>
                        <Icon
                          as={FiFolder}
                          boxSize={3.5}
                          color={project._id === projectId ? 'brand.orange' : 'whiteAlpha.500'}
                        />
                        <Box minW={0}>
                          <Text
                            fontSize="sm"
                            fontWeight={project._id === projectId ? '600' : '400'}
                            color="white"
                            noOfLines={1}
                          >
                            {project.name}
                          </Text>
                          {project.websiteUrl && (
                            <Text fontSize="2xs" color="whiteAlpha.500" noOfLines={1}>
                              {project.websiteUrl.replace(/^https?:\/\//, '')}
                            </Text>
                          )}
                        </Box>
                      </HStack>
                      {project._id === projectId && (
                        <Icon as={FiCheck} boxSize={3.5} color="brand.orange" />
                      )}
                    </HStack>
                  </MenuItem>
                ))
              ) : (
                <MenuItem
                  bg="transparent"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  px={3}
                  py={2}
                  isDisabled
                >
                  <Text fontSize="sm" color="whiteAlpha.400">No projects yet</Text>
                </MenuItem>
              )}

              <MenuDivider borderColor="whiteAlpha.100" />

              {projectLimits?.canCreate !== false ? (
                <Link href="/projects/new" passHref>
                  <MenuItem
                    icon={<Icon as={FiPlus} />}
                    bg="transparent"
                    _hover={{ bg: 'whiteAlpha.100' }}
                    color="whiteAlpha.600"
                    fontSize="sm"
                    px={3}
                  >
                    New Project
                  </MenuItem>
                </Link>
              ) : (
                <Tooltip label={projectLimits?.errorReason || 'Project limit reached'} placement="right" hasArrow>
                  <Box>
                    <MenuItem
                      icon={<Icon as={FiPlus} />}
                      bg="transparent"
                      _hover={{ bg: 'whiteAlpha.50' }}
                      color="whiteAlpha.400"
                      fontSize="sm"
                      px={3}
                      cursor="not-allowed"
                      onClick={() => router.push('/settings?tab=billing')}
                    >
                      Limit Reached (Upgrade)
                    </MenuItem>
                  </Box>
                </Tooltip>
              )}

              {/* Danger Zone: Delete Project (Strictly Super Admin Only) */}
              {user?.role === 'super_admin' && currentProject && (
                <MenuItem
                  icon={<Icon as={FiTrash2} />}
                  bg="transparent"
                  _hover={{ bg: variant === 'dark' ? 'red.900' : 'red.50', color: 'red.400' }}
                  color="red.500"
                  fontSize="sm"
                  px={3}
                  mt={1}
                  onClick={deleteModal.onOpen}
                >
                  Delete Active Project
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </VStack>
      </MotionBox>
    </AnimatePresence>
    {currentProject && (
      <DeleteProjectModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        projectId={currentProject._id}
        projectName={currentProject.name}
      />
    )}
    </>
  );
};
