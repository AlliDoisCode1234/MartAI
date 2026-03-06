'use client';

/**
 * ProductScreenshot
 *
 * Component Hierarchy:
 * App -> HeroSection -> ProductScreenshot
 *
 * Framed screenshot presentation component with rounded corners,
 * soft drop shadow, and optional floating StatBadge children.
 * Uses next/image for optimization.
 */

import { type FC, type ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Floating StatBadge components positioned around the frame */
  children?: ReactNode;
}

export const ProductScreenshot: FC<Props> = ({ src, alt, width = 800, height = 500, children }) => {
  return (
    <Box position="relative" display="inline-block">
      {/* Screenshot Frame */}
      <Box
        borderRadius="16px"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
        bg="white"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.12)"
        position="relative"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={90}
          priority
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </Box>

      {/* Floating elements (StatBadges) positioned by the consumer */}
      {children}
    </Box>
  );
};
