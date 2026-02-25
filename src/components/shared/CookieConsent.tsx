'use client';

/**
 * CookieConsent
 *
 * Component Hierarchy:
 * App → Layout → CookieConsent (this file)
 *
 * Non-intrusive bottom banner for GDPR/CCPA cookie consent.
 * Stores consent in localStorage. Emits a custom event so
 * ConditionalGA4 can react without a full page reload.
 */

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Button, Collapse, Text, HStack, VStack, Link } from '@chakra-ui/react';

export const CONSENT_KEY = 'phoo_cookie_consent';

/** Routes where the consent banner should never appear. */
const SUPPRESSED_ROUTES = ['/auth/', '/onboarding'];

/** Safe localStorage getter — returns null if unavailable (Safari private browsing). */
function getConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

/** Safe localStorage setter. */
function setConsent(value: string): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Safari private browsing — consent cannot be persisted
  }
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Never show during auth or onboarding flows
    const isSuppressed = SUPPRESSED_ROUTES.some((route) => pathname?.startsWith(route));
    if (isSuppressed) {
      setIsVisible(false);
      return;
    }

    const hasConsented = getConsent();
    if (!hasConsented) {
      // Small delay so it slides in after initial page load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleAcceptAll = () => {
    setConsent('all');
    setIsVisible(false);
    // Notify other components (ConditionalGA4) that consent was granted
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: 'all' }));
  };

  const handleAcceptNecessary = () => {
    setConsent('necessary');
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: 'necessary' }));
  };

  if (!isVisible) return null;

  return (
    <Collapse in={isVisible} animateOpacity>
      <Box
        position="fixed"
        bottom={{ base: 4, md: 8 }}
        left={{ base: 4, md: 8 }}
        right={{ base: 4, md: 'auto' }}
        maxWidth={{ base: '100%', md: '450px' }}
        bg="rgba(10, 10, 10, 0.95)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius="xl"
        p={6}
        boxShadow="0 20px 40px rgba(0, 0, 0, 0.4)"
        zIndex={9999}
      >
        <VStack align="flex-start" spacing={4}>
          <Text color="white" fontWeight="600" fontSize="lg">
            We value your privacy
          </Text>
          <Text color="gray.400" fontSize="sm" lineHeight="tall">
            We use cookies to enhance your browsing experience, serve personalized content, and
            analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of
            cookies.{' '}
            <Link
              color="brand.orange"
              href="/privacy"
              _hover={{ textDecoration: 'none', color: '#E8851A' }}
            >
              Read more
            </Link>
          </Text>
          <HStack width="full" spacing={3} pt={2}>
            <Button
              flex={1}
              variant="outline"
              color="white"
              borderColor="rgba(255, 255, 255, 0.2)"
              _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
              size="sm"
              onClick={handleAcceptNecessary}
            >
              Necessary Only
            </Button>
            <Button
              flex={1}
              bg="brand.orange"
              color="white"
              _hover={{ bg: '#E8851A' }}
              size="sm"
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Collapse>
  );
}
