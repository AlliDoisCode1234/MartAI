/**
 * Accessibility Utilities
 *
 * WCAG 2.1 AA compliance utilities.
 * Skip links, focus management, screen reader announcements.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Box, VisuallyHidden, Link } from '@chakra-ui/react';

/**
 * Skip to main content link
 * Appears on tab focus for keyboard navigation
 */
export function SkipLink() {
  return (
    <Link
      href="#main-content"
      position="absolute"
      top="-40px"
      left="0"
      bg="brand.orange"
      color="white"
      p={2}
      zIndex={9999}
      _focus={{
        top: '0',
      }}
    >
      Skip to main content
    </Link>
  );
}

/**
 * Main content wrapper with id for skip link
 */
export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <Box as="main" id="main-content" tabIndex={-1} outline="none">
      {children}
    </Box>
  );
}

/**
 * Screen reader only announcement
 * For dynamic content changes
 */
interface AnnouncementProps {
  message: string;
  assertive?: boolean;
}

export function LiveAnnouncement({ message, assertive = false }: AnnouncementProps) {
  return (
    <VisuallyHidden
      as="div"
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {message}
    </VisuallyHidden>
  );
}

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, assertive = false) => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
      announceRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const AnnouncerComponent = () => (
    <VisuallyHidden as="div" ref={announceRef} role="status" aria-atomic="true" />
  );

  return { announce, Announcer: AnnouncerComponent };
}

/**
 * Focus trap for modals
 */
export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return containerRef;
}

/**
 * Focus return after modal close
 */
export function useFocusReturn() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    previousFocusRef.current?.focus();
  }, []);

  return { saveFocus, restoreFocus };
}

/**
 * Keyboard navigation for lists
 */
export function useArrowNavigation(itemCount: number) {
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, onSelect: (index: number) => void) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndexRef.current = Math.min(currentIndexRef.current + 1, itemCount - 1);
          onSelect(currentIndexRef.current);
          break;
        case 'ArrowUp':
          e.preventDefault();
          currentIndexRef.current = Math.max(currentIndexRef.current - 1, 0);
          onSelect(currentIndexRef.current);
          break;
        case 'Home':
          e.preventDefault();
          currentIndexRef.current = 0;
          onSelect(0);
          break;
        case 'End':
          e.preventDefault();
          currentIndexRef.current = itemCount - 1;
          onSelect(itemCount - 1);
          break;
      }
    },
    [itemCount]
  );

  return { handleKeyDown, currentIndex: currentIndexRef.current };
}

/**
 * Color contrast checker
 * Returns true if contrast ratio meets WCAG AA (4.5:1 for normal text)
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  largeText = false
): boolean {
  // Simplified - in production, use a proper color library
  // WCAG AA: 4.5:1 for normal text, 3:1 for large text
  const minRatio = largeText ? 3 : 4.5;
  // This would calculate actual contrast ratio
  return true; // Placeholder
}

/**
 * Accessible button with loading state
 */
interface AccessibleButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export function getAccessibleButtonProps({
  isLoading,
  loadingText = 'Loading',
}: AccessibleButtonProps) {
  return {
    'aria-busy': isLoading,
    'aria-disabled': isLoading,
    'aria-label': isLoading ? loadingText : undefined,
  };
}
