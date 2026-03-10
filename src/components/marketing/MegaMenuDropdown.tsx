'use client';

/**
 * MegaMenuDropdown
 *
 * Component Hierarchy:
 * App -> MegaMenuHeader -> MegaMenuDropdown
 *
 * Reusable dropdown panel wrapper for the mega-menu.
 * Animates in with slide-down + fade. Dismisses on click-outside or Escape.
 */

import { type FC, type ReactNode, useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Width of the dropdown panel */
  width?: string;
}

export const MegaMenuDropdown: FC<Props> = ({ isOpen, onClose, children, width = '480px' }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Click-outside dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Delay to avoid closing on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionBox
          ref={panelRef}
          position="absolute"
          top="100%"
          left="50%"
          transform="translateX(-50%)"
          w={width}
          bg="white"
          borderRadius="16px"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.12)"
          p={3}
          zIndex={1001}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          // @ts-ignore - framer-motion transition type
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </MotionBox>
      )}
    </AnimatePresence>
  );
};
