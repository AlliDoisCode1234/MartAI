'use client';

/**
 * MegaMenuHeader
 *
 * Component Hierarchy:
 * App -> MegaMenuHeader
 *   ├── Desktop: Logo + Nav (Features▾, Solutions▾, Resources▾) + CTAs
 *   │   └── MegaMenuDropdown -> MegaMenuItem[]
 *   └── Mobile: Logo + Hamburger -> Drawer with Accordions
 *
 * Premium mega-menu navigation header for marketing pages.
 * Replaces LandingHeader with a richer, conversion-optimized navigation.
 */

import { useState, useCallback, useRef, useEffect, type FC } from 'react';
import {
  Box,
  Container,
  HStack,
  Text,
  Button,
  Icon,
  IconButton,
  Flex,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from '@chakra-ui/react';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF } from '@/lib/constants/featureFlags';
import { useRouter } from 'next/navigation';
import { FiMenu, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { MegaMenuDropdown } from './MegaMenuDropdown';
import { MegaMenuItem } from './MegaMenuItem';
import { FEATURES_MENU, SOLUTIONS_MENU, RESOURCES_MENU, type SolutionItem } from './megaMenuData';

type ActiveDropdown = 'features' | 'solutions' | 'resources' | null;

export const MegaMenuHeader: FC = () => {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const { isOpen: mobileOpen, onOpen, onClose } = useDisclosure();
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const logoHref = isAuthenticated ? '/studio' : '/';

  // ── Hover-based dropdown logic ──────────────────────────────

  const handleMouseEnter = useCallback((dropdown: ActiveDropdown) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(dropdown);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // ── Nav Trigger ─────────────────────────────────────────────

  const NavTrigger = ({ label, dropdown }: { label: string; dropdown: ActiveDropdown }) => (
    <Box
      position="relative"
      onMouseEnter={() => handleMouseEnter(dropdown)}
      onMouseLeave={handleMouseLeave}
    >
      <HStack
        spacing={1}
        cursor="pointer"
        px={3}
        py={2}
        borderRadius="8px"
        _hover={{ bg: 'gray.50' }}
        transition="all 0.15s ease"
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={activeDropdown === dropdown ? 'brand.orange' : 'gray.700'}
          transition="color 0.15s ease"
        >
          {label}
        </Text>
        <Icon
          as={FiChevronDown}
          boxSize={3.5}
          color={activeDropdown === dropdown ? 'brand.orange' : 'gray.500'}
          transform={activeDropdown === dropdown ? 'rotate(180deg)' : 'none'}
          transition="all 0.2s ease"
        />
      </HStack>

      {/* Dropdown Panel */}
      {dropdown === 'features' && (
        <MegaMenuDropdown
          isOpen={activeDropdown === 'features'}
          onClose={closeDropdown}
          width="520px"
        >
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
            {FEATURES_MENU.map((item) => (
              <MegaMenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                description={item.description}
                href={item.href}
                onClick={closeDropdown}
              />
            ))}
          </Box>
        </MegaMenuDropdown>
      )}

      {dropdown === 'solutions' && (
        <MegaMenuDropdown
          isOpen={activeDropdown === 'solutions'}
          onClose={closeDropdown}
          width="380px"
        >
          <VStack spacing={1} align="stretch">
            {SOLUTIONS_MENU.map((item: SolutionItem) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ textDecoration: 'none' }}
                onClick={closeDropdown}
              >
                <Box
                  px={4}
                  py={3}
                  borderRadius="12px"
                  _hover={{ bg: 'orange.50' }}
                  transition="all 0.15s ease"
                  cursor="pointer"
                >
                  <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                    {item.label}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={0.5}>
                    {item.description}
                  </Text>
                </Box>
              </Link>
            ))}
          </VStack>
        </MegaMenuDropdown>
      )}

      {dropdown === 'resources' && (
        <MegaMenuDropdown
          isOpen={activeDropdown === 'resources'}
          onClose={closeDropdown}
          width="240px"
        >
          <VStack spacing={0} align="stretch">
            {RESOURCES_MENU.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ textDecoration: 'none' }}
                onClick={closeDropdown}
              >
                <Text
                  px={4}
                  py={2.5}
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                  borderRadius="8px"
                  _hover={{ bg: 'orange.50', color: 'brand.orange' }}
                  transition="all 0.15s ease"
                  cursor="pointer"
                >
                  {item.label}
                </Text>
              </Link>
            ))}
          </VStack>
        </MegaMenuDropdown>
      )}
    </Box>
  );

  return (
    <>
      <Box
        ref={headerRef}
        as="header"
        bg="white"
        shadow="sm"
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" h="64px">
            {/* ── Logo ──────────────────────────────────────── */}
            <Link href={logoHref} style={{ textDecoration: 'none' }}>
              <Text fontSize="xl" fontWeight="bold" color="brand.orange" letterSpacing="-0.01em">
                Phoo
              </Text>
            </Link>

            {/* ── Desktop Nav ───────────────────────────────── */}
            <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
              <NavTrigger label="Features" dropdown="features" />
              <NavTrigger label="Solutions" dropdown="solutions" />
              <NavTrigger label="Resources" dropdown="resources" />
            </HStack>

            {/* ── Desktop CTAs ──────────────────────────────── */}
            <HStack spacing={3} display={{ base: 'none', lg: 'flex' }}>
              {isAuthenticated ? (
                <Button
                  size="sm"
                  bgGradient="linear(to-r, brand.orange, brand.red)"
                  color="white"
                  borderRadius="full"
                  px={6}
                  _hover={{
                    bgGradient: 'linear(to-r, orange.500, red.500)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(237, 137, 54, 0.3)',
                  }}
                  transition="all 0.2s ease"
                  onClick={() => router.push('/studio')}
                >
                  Go to Studio
                </Button>
              ) : (
                <>
                  {/* TODO: Show Login button when IS_LAUNCHED is true */}
                  {IS_LAUNCHED && (
                    <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="gray.600"
                        fontWeight="medium"
                        _hover={{ color: 'gray.800', bg: 'gray.50' }}
                      >
                        Log In
                      </Button>
                    </Link>
                  )}
                  <Button
                    as="a"
                    href={IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF}
                    size="sm"
                    bgGradient="linear(to-r, brand.orange, brand.red)"
                    color="white"
                    borderRadius="full"
                    px={6}
                    _hover={{
                      bgGradient: 'linear(to-r, orange.500, red.500)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 15px rgba(237, 137, 54, 0.3)',
                    }}
                    transition="all 0.2s ease"
                    rightIcon={<Icon as={FiArrowRight} boxSize={4} />}
                  >
                    {IS_LAUNCHED ? 'Start Getting Leads' : 'Join Beta'}
                  </Button>
                </>
              )}
            </HStack>

            {/* ── Mobile Hamburger ───────────────────────────── */}
            <IconButton
              aria-label="Open navigation menu"
              icon={<Icon as={FiMenu} />}
              variant="ghost"
              color="gray.600"
              _hover={{ color: 'brand.orange', bg: 'orange.50' }}
              size="md"
              display={{ base: 'flex', lg: 'none' }}
              onClick={onOpen}
              minW="44px"
              minH="44px"
            />
          </Flex>
        </Container>
      </Box>

      {/* ── Mobile Drawer ───────────────────────────────────── */}
      <Drawer isOpen={mobileOpen} onClose={onClose} placement="right" size="full">
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton size="lg" color="gray.600" mt={2} mr={2} />
          <DrawerBody pt={16} px={6}>
            <VStack spacing={6} align="stretch">
              {/* Logo */}
              <Link href={logoHref} style={{ textDecoration: 'none' }} onClick={onClose}>
                <Text fontSize="2xl" fontWeight="bold" color="brand.orange">
                  Phoo
                </Text>
              </Link>

              <Divider borderColor="gray.200" />

              {/* Accordion Nav */}
              <Accordion allowToggle>
                {/* Features */}
                <AccordionItem border="none">
                  <AccordionButton px={0} py={3} _hover={{ bg: 'transparent' }}>
                    <Text flex={1} textAlign="left" fontWeight="semibold" color="gray.800">
                      Features
                    </Text>
                    <AccordionIcon color="gray.500" />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={4}>
                    <VStack spacing={1} align="stretch">
                      {FEATURES_MENU.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          style={{ textDecoration: 'none' }}
                          onClick={onClose}
                        >
                          <HStack
                            spacing={3}
                            px={2}
                            py={2.5}
                            borderRadius="8px"
                            _hover={{ bg: 'orange.50' }}
                          >
                            <Icon as={item.icon} boxSize={4} color="brand.orange" />
                            <Text fontSize="sm" color="gray.700">
                              {item.label}
                            </Text>
                          </HStack>
                        </Link>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Solutions */}
                <AccordionItem border="none">
                  <AccordionButton px={0} py={3} _hover={{ bg: 'transparent' }}>
                    <Text flex={1} textAlign="left" fontWeight="semibold" color="gray.800">
                      Solutions
                    </Text>
                    <AccordionIcon color="gray.500" />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={4}>
                    <VStack spacing={1} align="stretch">
                      {SOLUTIONS_MENU.map((item: SolutionItem) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          style={{ textDecoration: 'none' }}
                          onClick={onClose}
                        >
                          <Text
                            px={2}
                            py={2.5}
                            fontSize="sm"
                            color="gray.700"
                            borderRadius="8px"
                            _hover={{ bg: 'orange.50' }}
                          >
                            {item.label}
                          </Text>
                        </Link>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Resources */}
                <AccordionItem border="none">
                  <AccordionButton px={0} py={3} _hover={{ bg: 'transparent' }}>
                    <Text flex={1} textAlign="left" fontWeight="semibold" color="gray.800">
                      Resources
                    </Text>
                    <AccordionIcon color="gray.500" />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={4}>
                    <VStack spacing={1} align="stretch">
                      {RESOURCES_MENU.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          style={{ textDecoration: 'none' }}
                          onClick={onClose}
                        >
                          <Text
                            px={2}
                            py={2.5}
                            fontSize="sm"
                            color="gray.700"
                            borderRadius="8px"
                            _hover={{ bg: 'orange.50' }}
                          >
                            {item.label}
                          </Text>
                        </Link>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Divider borderColor="gray.200" />

              {/* Mobile CTAs */}
              <VStack spacing={3} pt={2}>
                {isAuthenticated ? (
                  <Button
                    w="full"
                    size="lg"
                    bgGradient="linear(to-r, brand.orange, brand.red)"
                    color="white"
                    borderRadius="full"
                    _hover={{
                      bgGradient: 'linear(to-r, orange.500, red.500)',
                    }}
                    onClick={() => {
                      onClose();
                      router.push('/studio');
                    }}
                  >
                    Go to Studio
                  </Button>
                ) : (
                  <>
                    <Button
                      as="a"
                      href={IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF}
                      w="full"
                      size="lg"
                      bgGradient="linear(to-r, brand.orange, brand.red)"
                      color="white"
                      borderRadius="full"
                      rightIcon={<Icon as={FiArrowRight} boxSize={5} />}
                      _hover={{
                        bgGradient: 'linear(to-r, orange.500, red.500)',
                      }}
                      onClick={onClose}
                    >
                      {IS_LAUNCHED ? 'Start Getting Leads' : 'Join Beta'}
                    </Button>
                    {/* TODO: Show Login button when IS_LAUNCHED is true */}
                    {IS_LAUNCHED && (
                      <Link href="/auth/login" style={{ textDecoration: 'none', width: '100%' }}>
                        <Button
                          w="full"
                          size="lg"
                          variant="outline"
                          borderColor="gray.300"
                          color="gray.700"
                          borderRadius="full"
                          onClick={onClose}
                        >
                          Log In
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
