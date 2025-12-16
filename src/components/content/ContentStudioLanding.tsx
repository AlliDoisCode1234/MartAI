'use client';

/**
 * ContentStudioLanding Component
 *
 * Component Hierarchy:
 * App → Content → ContentStudioLanding (this file)
 *   ├── TemplateCard (grid)
 *   └── QuickWinsCard
 *
 * Landing page for Content Studio when no brief is selected.
 * Shows templates, quick wins, and recent drafts.
 */

import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  SimpleGrid,
  HStack,
  Button,
  Icon,
  Card,
  CardBody,
  Badge,
} from '@chakra-ui/react';
import { FiPlusCircle, FiZap, FiFileText, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useProject } from '@/lib/hooks';
import { CONTENT_TEMPLATES } from '@/lib/constants/contentTemplates';
import type { ContentTemplate } from '@/lib/constants/contentTemplates';
import { TemplateCard } from './TemplateCard';
import { Id } from '@/convex/_generated/dataModel';

const MotionBox = motion(Box);

type Props = {
  onTemplateSelect?: (template: ContentTemplate, keyword?: string) => void;
};

export function ContentStudioLanding({ onTemplateSelect }: Props) {
  const router = useRouter();
  const { projectId } = useProject(null, { autoSelect: true });

  // Get quick wins for the project
  const quickWins = useQuery(
    api.content.quickWins.getQuickWins,
    projectId ? { projectId: projectId as Id<'projects'>, limit: 3 } : 'skip'
  );

  const handleTemplateSelect = (template: ContentTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    } else {
      // Default behavior: navigate to strategy to create brief
      router.push(`/strategy?template=${template.id}`);
    }
  };

  const handleQuickWinClick = (keyword: string) => {
    router.push(`/content?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={10} align="stretch">
          {/* Hero */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={4} textAlign="center" py={8}>
              <Badge colorScheme="orange" fontSize="sm" px={3} py={1} borderRadius="full">
                Content Studio
              </Badge>
              <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                What will you create today?
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="600px">
                Pick a template, grab a quick win keyword, or start from scratch. Mart will help you
                every step of the way.
              </Text>
            </VStack>
          </MotionBox>

          {/* Quick Wins Section */}
          {quickWins && quickWins.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                bg="gradient-to-r from-yellow.50 to-orange.50"
                borderWidth="1px"
                borderColor="yellow.200"
              >
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack>
                      <Icon as={FiZap} color="yellow.500" boxSize={5} />
                      <Heading size="md">Quick Wins</Heading>
                      <Badge colorScheme="yellow">Easy rankings</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Low-competition keywords you can rank for quickly:
                    </Text>
                    <HStack spacing={3} flexWrap="wrap">
                      {(quickWins as any[]).map((win) => (
                        <Button
                          key={win._id}
                          size="sm"
                          variant="outline"
                          colorScheme="orange"
                          rightIcon={<FiArrowRight />}
                          onClick={() => handleQuickWinClick(win.keyword)}
                        >
                          {win.keyword}
                          <Badge ml={2} colorScheme="green" fontSize="2xs">
                            KD {win.difficulty ?? 0}
                          </Badge>
                        </Button>
                      ))}
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </MotionBox>
          )}

          {/* Templates Section */}
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="lg">Start from Template</Heading>
              <Button
                variant="ghost"
                colorScheme="orange"
                rightIcon={<FiPlusCircle />}
                onClick={() => router.push('/strategy')}
              >
                Create Custom
              </Button>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {CONTENT_TEMPLATES.map((template, index) => (
                <MotionBox
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <TemplateCard template={template} onSelect={handleTemplateSelect} />
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>

          {/* CTA Section */}
          <Card bg="gray.800" color="white">
            <CardBody py={8}>
              <HStack justify="space-between" flexWrap="wrap" gap={4}>
                <VStack align="start" spacing={2}>
                  <Heading size="md">Need help getting started?</Heading>
                  <Text color="gray.300">
                    Generate keywords first, then Mart will suggest the best content to create.
                  </Text>
                </VStack>
                <Button
                  size="lg"
                  bg="brand.orange"
                  color="white"
                  _hover={{ bg: '#E8851A' }}
                  rightIcon={<FiFileText />}
                  onClick={() => router.push('/strategy')}
                >
                  Go to Strategy
                </Button>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
