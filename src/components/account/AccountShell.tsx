'use client';

/**
 * AccountShell
 *
 * Component Hierarchy:
 * App → AccountShell
 *   ├── Desktop Sidebar (vertical nav)
 *   ├── Mobile Top Nav (horizontal pills)
 *   └── Main Content (children)
 *
 * Shared layout wrapper for account-related pages:
 * /profile, /settings, /settings/team, /subscription.
 * Provides a unified sidebar on desktop and horizontal nav on mobile,
 * with a prominent "Back to Studio" CTA.
 */

import { Box, Flex, VStack, HStack, Text, Icon, Avatar, Divider, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  FiArrowLeft,
  FiUser,
  FiSettings,
  FiGrid,
  FiUsers,
  FiHelpCircle,
  FiCreditCard,
} from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { getUserDisplayName } from '@/lib/funNames';
import { Suspense } from 'react';

/**
 * Navigation items for the account sidebar.
 * `matchTab` is used for /settings?tab=X matching.
 */
interface AccountNavItem {
  href: string;
  label: string;
  icon: React.ComponentType;
  /** If set, this item is active when pathname is /settings AND tab param matches */
  matchTab?: string;
}

const NAV_ITEMS: AccountNavItem[] = [
  { href: '/profile', label: 'Profile', icon: FiUser },
  { href: '/settings?tab=account', label: 'Account', icon: FiSettings, matchTab: 'account' },
  {
    href: '/settings?tab=integrations',
    label: 'Integrations',
    icon: FiGrid,
    matchTab: 'integrations',
  },
  { href: '/settings/team', label: 'Team', icon: FiUsers },
  { href: '/settings?tab=support', label: 'Support', icon: FiHelpCircle, matchTab: 'support' },
  { href: '/subscription', label: 'Billing', icon: FiCreditCard },
];

interface Props {
  children: React.ReactNode;
}

/**
 * Inner component that reads useSearchParams (must be wrapped in Suspense).
 */
function AccountShellInner({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const displayName = user ? getUserDisplayName(user) : '';

  // Valid tab values extracted from NAV_ITEMS for normalization
  const validTabs = NAV_ITEMS.filter((n) => n.matchTab).map((n) => n.matchTab!);

  const isActive = (item: AccountNavItem): boolean => {
    // Direct pathname match (e.g. /profile, /subscription, /settings/team)
    if (item.matchTab) {
      // Tab-based matching: pathname must be /settings and tab param must match
      const rawTab = searchParams?.get('tab') || 'account';
      // Normalize unknown tabs to 'account' to match SettingsPage's fallback
      const currentTab = validTabs.includes(rawTab) ? rawTab : 'account';
      return pathname === '/settings' && currentTab === item.matchTab;
    }
    // Exact pathname match
    return pathname === item.href.split('?')[0];
  };

  return (
    <Flex minH="calc(100vh - 64px)" bg="brand.light">
      {/* ─── Desktop Sidebar ─────────────────────────────────── */}
      <Box
        as="nav"
        w="240px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        py={6}
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        position="sticky"
        top="64px"
        h="calc(100vh - 64px)"
        flexShrink={0}
      >
        {/* Back to Studio */}
        <Box px={4} mb={6}>
          <Link href="/studio" style={{ textDecoration: 'none' }}>
            <Flex
              align="center"
              gap={2}
              px={3}
              py={2.5}
              borderRadius="10px"
              bg="orange.50"
              color="brand.orange"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{
                bg: 'orange.100',
                transform: 'translateX(-2px)',
              }}
              transition="all 0.2s ease"
              cursor="pointer"
            >
              <Icon as={FiArrowLeft} boxSize={4} />
              <Text>Back to Studio</Text>
            </Flex>
          </Link>
        </Box>

        <Divider borderColor="gray.100" mb={4} />

        {/* Navigation Links */}
        <VStack spacing={1} align="stretch" px={3} flex={1}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Tooltip
                key={item.label}
                label={item.label}
                placement="right"
                hasArrow
                openDelay={500}
              >
                <Link href={item.href} style={{ textDecoration: 'none' }}>
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={2.5}
                    borderRadius="10px"
                    cursor="pointer"
                    bg={active ? 'orange.50' : 'transparent'}
                    color={active ? 'brand.orange' : 'gray.600'}
                    fontWeight={active ? 'semibold' : 'medium'}
                    borderLeft={active ? '3px solid' : '3px solid transparent'}
                    borderLeftColor={active ? 'brand.orange' : 'transparent'}
                    _hover={{
                      bg: active ? 'orange.50' : 'gray.50',
                      color: active ? 'brand.orange' : 'gray.800',
                    }}
                    transition="all 0.15s ease"
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon as={item.icon} boxSize={4.5} />
                    <Text fontSize="sm">{item.label}</Text>
                  </Flex>
                </Link>
              </Tooltip>
            );
          })}
        </VStack>

        {/* User Info at Bottom */}
        {user && (
          <Box px={4} pt={4}>
            <Divider borderColor="gray.100" mb={4} />
            <Flex align="center" gap={3} px={2}>
              <Avatar
                size="sm"
                name={displayName}
                src={user.image ?? undefined}
                bg="brand.orange"
                color="white"
                fontWeight="bold"
              />
              <Box overflow="hidden">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" noOfLines={1}>
                  {displayName}
                </Text>
                <Text fontSize="xs" color="gray.400" noOfLines={1}>
                  {user.email}
                </Text>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>

      {/* ─── Mobile Top Nav ──────────────────────────────────── */}
      <Box display={{ base: 'block', md: 'none' }} w="full">
        <Box
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          px={4}
          py={3}
          position="sticky"
          top="64px"
          zIndex={10}
        >
          {/* Back to Studio (mobile) */}
          <HStack mb={3}>
            <Link href="/studio" style={{ textDecoration: 'none' }}>
              <Flex
                align="center"
                gap={1.5}
                color="brand.orange"
                fontWeight="semibold"
                fontSize="sm"
                _hover={{ opacity: 0.8 }}
              >
                <Icon as={FiArrowLeft} boxSize={4} />
                <Text>Studio</Text>
              </Flex>
            </Link>
          </HStack>

          {/* Horizontal scrollable nav */}
          <HStack
            spacing={1}
            overflowX="auto"
            pb={1}
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                  <Flex
                    align="center"
                    gap={1.5}
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    bg={active ? 'orange.50' : 'transparent'}
                    color={active ? 'brand.orange' : 'gray.500'}
                    fontWeight={active ? 'semibold' : 'medium'}
                    fontSize="sm"
                    whiteSpace="nowrap"
                    flexShrink={0}
                    _hover={{ bg: active ? 'orange.50' : 'gray.50' }}
                    transition="all 0.15s"
                  >
                    <Icon as={item.icon} boxSize={3.5} />
                    <Text>{item.label}</Text>
                  </Flex>
                </Link>
              );
            })}
          </HStack>
        </Box>

        {/* Main Content (mobile) */}
        <Box p={{ base: 4, sm: 6 }}>{children}</Box>
      </Box>

      {/* ─── Main Content (desktop) ──────────────────────────── */}
      <Box flex={1} display={{ base: 'none', md: 'block' }} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
}

/**
 * AccountShell — wrapped in Suspense because useSearchParams
 * requires a Suspense boundary to avoid de-opting the page.
 */
export function AccountShell({ children }: Props) {
  return (
    <Suspense fallback={<Box minH="100vh" bg="brand.light" />}>
      <AccountShellInner>{children}</AccountShellInner>
    </Suspense>
  );
}
