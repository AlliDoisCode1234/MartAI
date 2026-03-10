'use client';

/**
 * MegaMenuItem
 *
 * Component Hierarchy:
 * App -> MegaMenuHeader -> MegaMenuDropdown -> MegaMenuItem
 *
 * Individual item within a mega-menu dropdown panel.
 * Displays an icon, label, and description with hover effects.
 */

import { type FC, type ComponentType } from 'react';
import { Flex, Icon, Text, Box } from '@chakra-ui/react';
import Link from 'next/link';

interface Props {
  icon: ComponentType;
  label: string;
  description: string;
  href: string;
  onClick?: () => void;
}

export const MegaMenuItem: FC<Props> = ({ icon, label, description, href, onClick }) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }} onClick={onClick}>
      <Flex
        align="flex-start"
        gap={3}
        px={4}
        py={3}
        borderRadius="12px"
        cursor="pointer"
        _hover={{ bg: 'orange.50' }}
        transition="all 0.15s ease"
      >
        <Flex
          align="center"
          justify="center"
          w="40px"
          h="40px"
          borderRadius="10px"
          bg="orange.50"
          flexShrink={0}
          mt={0.5}
        >
          <Icon as={icon} boxSize={5} color="brand.orange" />
        </Flex>
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="gray.800" lineHeight="1.3">
            {label}
          </Text>
          <Text fontSize="xs" color="gray.500" lineHeight="1.4" mt={0.5}>
            {description}
          </Text>
        </Box>
      </Flex>
    </Link>
  );
};
