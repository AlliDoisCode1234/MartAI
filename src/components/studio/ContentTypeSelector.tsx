'use client';

/**
 * ContentTypeSelector Component
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentStudio → ContentTypeSelector (this file)
 *
 * Displays 17 content types grouped by category.
 * User selects type before content generation.
 */

import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Badge,
  Icon,
  Tooltip,
  Skeleton,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  FiHome,
  FiUser,
  FiGrid,
  FiFileText,
  FiArrowRight,
  FiGift,
  FiDollarSign,
  FiLayers,
  FiMapPin,
  FiBriefcase,
  FiUsers,
  FiHeart,
  FiCalendar,
  FiLink,
  FiBook,
  FiRefreshCw,
  FiVideo,
} from 'react-icons/fi';
import { IconType } from 'react-icons';

interface Props {
  selectedType: string | null;
  onSelect: (typeId: string) => void;
}

// Icon mapping for content types
const TYPE_ICONS: Record<string, IconType> = {
  homepage: FiHome,
  about: FiUser,
  service: FiGrid,
  landing: FiLayers,
  blog: FiFileText,
  blogVersus: FiArrowRight,
  blogVideo: FiVideo,
  contentRefresh: FiRefreshCw,
  leadMagnet: FiGift,
  paidProduct: FiDollarSign,
  areasWeServe: FiMapPin,
  employment: FiBriefcase,
  mentorship: FiUsers,
  donate: FiHeart,
  events: FiCalendar,
  partner: FiLink,
  program: FiBook,
};

// Category definitions
const CATEGORIES = [
  { id: 'core', label: 'Core Pages', types: ['homepage', 'about', 'service', 'landing'] },
  {
    id: 'blog',
    label: 'Blog Content',
    types: ['blog', 'blogVersus', 'blogVideo', 'contentRefresh'],
  },
  { id: 'conversion', label: 'Conversion', types: ['leadMagnet', 'paidProduct'] },
  { id: 'local', label: 'Local/Geo', types: ['areasWeServe'] },
  {
    id: 'specialty',
    label: 'Specialty',
    types: ['employment', 'mentorship', 'donate', 'events', 'partner', 'program'],
  },
];

export function ContentTypeSelector({ selectedType, onSelect }: Props) {
  const contentTypes = useQuery(api.phoo.contentTypes.getAllContentTypes);

  if (!contentTypes) {
    return (
      <VStack spacing={4} align="stretch">
        {CATEGORIES.map((cat) => (
          <Box key={cat.id}>
            <Skeleton height="20px" width="120px" mb={2} />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={3}>
              {cat.types.map((t) => (
                <Skeleton key={t} height="80px" borderRadius="md" />
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </VStack>
    );
  }

  // Create lookup for quick access
  const typeLookup = Object.fromEntries(
    contentTypes.map((t: { id: string; name: string; description: string; wordCount: number }) => [
      t.id,
      t,
    ])
  );

  return (
    <VStack spacing={6} align="stretch">
      {CATEGORIES.map((category) => (
        <Box key={category.id}>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="gray.400"
            textTransform="uppercase"
            letterSpacing="wide"
            mb={3}
          >
            {category.label}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={3}>
            {category.types.map((typeId) => {
              const type = typeLookup[typeId];
              if (!type) return null;

              const isSelected = selectedType === typeId;
              const IconComponent = TYPE_ICONS[typeId] || FiFileText;

              return (
                <Tooltip
                  key={typeId}
                  label={
                    <VStack align="start" spacing={1} p={1}>
                      <Text fontWeight="bold">{type.name}</Text>
                      <Text fontSize="xs" color="gray.300">
                        {type.description}
                      </Text>
                      <Badge colorScheme="purple" size="sm">
                        ~{type.wordCount} words
                      </Badge>
                    </VStack>
                  }
                  placement="top"
                  hasArrow
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  px={3}
                  py={2}
                >
                  <Box
                    p={4}
                    bg={isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)'}
                    border="1px solid"
                    borderColor={isSelected ? 'purple.500' : 'rgba(255, 255, 255, 0.1)'}
                    borderRadius="md"
                    cursor="pointer"
                    transition="all 0.15s ease"
                    _hover={{
                      bg: isSelected ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                      borderColor: isSelected ? 'purple.400' : 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                    }}
                    onClick={() => onSelect(typeId)}
                  >
                    <HStack spacing={3}>
                      <Icon
                        as={IconComponent}
                        boxSize={5}
                        color={isSelected ? 'purple.400' : 'gray.400'}
                      />
                      <VStack align="start" spacing={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color={isSelected ? 'white' : 'gray.200'}
                          noOfLines={1}
                        >
                          {type.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {type.wordCount}w
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
}
