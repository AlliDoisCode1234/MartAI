'use client';

/**
 * Component Hierarchy:
 * app/strategy/page.tsx
 *   └── StrategyDashboard (this file)
 *       ├── Quick Stats Header
 *       ├── Keywords Section (collapsible)
 *       ├── Topic Curator Section (collapsible)
 *       ├── Content Calendar Section (collapsible)
 *       └── Article Studio Section (collapsible)
 */

import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  useColorModeValue,
  Divider,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiLayers,
  FiCalendar,
  FiEdit3,
  FiPlay,
  FiPlus,
  FiZap,
  FiCompass,
} from 'react-icons/fi';
import { RelatedKeywords } from './RelatedKeywords';
import { SECTION_LABELS } from '@/src/lib/copyStrings';

interface Props {
  projectId: string;
  keywordCount: number;
  clusterCount: number;
  planExists: boolean;
  briefCount: number;
  draftCount: number;
  onImportKeywords: () => void;
  onAddKeyword: (keyword: string) => void;
  existingKeywords: string[];
  onGenerateClusters: () => void;
  onGeneratePlan: () => void;
  onStartWizard: () => void;
  clusters: Array<{
    _id: string;
    clusterName: string;
    keywords: string[];
    intent: string;
    status: string;
  }>;
  briefs: Array<{
    _id: string;
    title: string;
    status: string;
    scheduledDate?: number;
  }>;
  isGenerating: boolean;
}

export function StrategyDashboard({
  projectId,
  keywordCount,
  clusterCount,
  planExists,
  briefCount,
  draftCount,
  onImportKeywords,
  onGenerateClusters,
  onGeneratePlan,
  onStartWizard,
  onAddKeyword,
  existingKeywords,
  clusters,
  briefs,
  isGenerating,
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    keywords: true,
    topicCurator: true,
    contentCalendar: true,
    articleStudio: true,
  });
  const [showRelated, setShowRelated] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const statBg = useColorModeValue('gray.50', 'gray.900');

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionCard = ({
    id,
    title,
    icon,
    children,
    badge,
    action,
  }: {
    id: string;
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    badge?: string;
    action?: React.ReactNode;
  }) => (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="sm">
      <CardHeader
        py={3}
        px={4}
        cursor="pointer"
        onClick={() => toggleSection(id)}
        _hover={{ bg: useColorModeValue('gray.50', 'gray.750') }}
      >
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={icon} boxSize={5} color="purple.500" />
            <Heading size="sm">{title}</Heading>
            {badge && (
              <Badge colorScheme="purple" variant="subtle">
                {badge}
              </Badge>
            )}
          </HStack>
          <HStack spacing={2}>
            {action && <Box onClick={(e) => e.stopPropagation()}>{action}</Box>}
            <Icon as={expandedSections[id] ? FiChevronUp : FiChevronDown} />
          </HStack>
        </HStack>
      </CardHeader>
      <Collapse in={expandedSections[id]} animateOpacity>
        <CardBody pt={0} px={4} pb={4}>
          {children}
        </CardBody>
      </Collapse>
    </Card>
  );

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Quick Stats Header */}
      <Card bg={statBg} borderColor={borderColor} borderWidth="1px">
        <CardBody py={4}>
          <HStack justify="space-between" align="center" wrap="wrap" gap={4}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} flex="1">
              <Stat size="sm">
                <StatLabel>Keywords</StatLabel>
                <StatNumber>{keywordCount}</StatNumber>
                <StatHelpText>discovered</StatHelpText>
              </Stat>
              <Stat size="sm">
                <StatLabel>Topics</StatLabel>
                <StatNumber>{clusterCount}</StatNumber>
                <StatHelpText>curated</StatHelpText>
              </Stat>
              <Stat size="sm">
                <StatLabel>Articles</StatLabel>
                <StatNumber>{briefCount}</StatNumber>
                <StatHelpText>scheduled</StatHelpText>
              </Stat>
              <Stat size="sm">
                <StatLabel>Drafts</StatLabel>
                <StatNumber>{draftCount}</StatNumber>
                <StatHelpText>ready to review</StatHelpText>
              </Stat>
            </SimpleGrid>
            <Tooltip label="Start guided setup wizard">
              <Button
                leftIcon={<FiPlay />}
                colorScheme="purple"
                variant="outline"
                size="sm"
                onClick={onStartWizard}
              >
                Guided Setup
              </Button>
            </Tooltip>
          </HStack>
        </CardBody>
      </Card>

      {/* Keywords Section */}
      <SectionCard
        id="keywords"
        title="Keywords"
        icon={FiSearch}
        badge={keywordCount > 0 ? `${keywordCount}` : undefined}
        action={
          <Button
            size="xs"
            leftIcon={<FiPlus />}
            colorScheme="purple"
            variant="ghost"
            onClick={onImportKeywords}
          >
            Import
          </Button>
        }
      >
        {keywordCount === 0 ? (
          <VStack py={6} spacing={3}>
            <Text color="gray.500">No keywords yet</Text>
            <Button leftIcon={<FiPlus />} colorScheme="purple" onClick={onImportKeywords}>
              Import Keywords
            </Button>
          </VStack>
        ) : (
          <VStack align="stretch" spacing={4}>
            <Text color="gray.600">
              {SECTION_LABELS.keywords.subtitle} — {keywordCount} keywords discovered.
            </Text>

            {/* Related Keywords Toggle */}
            <Divider />
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={FiCompass} color="purple.500" />
                <Text fontWeight="medium" fontSize="sm">
                  Discover Related Keywords
                </Text>
              </HStack>
              <Button
                size="xs"
                variant={showRelated ? 'solid' : 'outline'}
                colorScheme="purple"
                onClick={() => setShowRelated(!showRelated)}
              >
                {showRelated ? 'Hide' : 'Show'}
              </Button>
            </HStack>

            <Collapse in={showRelated} animateOpacity>
              <Box pt={2}>
                <RelatedKeywords onAddKeyword={onAddKeyword} existingKeywords={existingKeywords} />
              </Box>
            </Collapse>
          </VStack>
        )}
      </SectionCard>

      {/* Topic Curator Section */}
      <SectionCard
        id="topicCurator"
        title={SECTION_LABELS.topicCurator.title}
        icon={FiLayers}
        badge={clusterCount > 0 ? `${clusterCount}` : undefined}
        action={
          keywordCount > 0 && (
            <Button
              size="xs"
              leftIcon={<FiZap />}
              colorScheme="purple"
              variant="ghost"
              onClick={onGenerateClusters}
              isLoading={isGenerating}
            >
              Curate Topics
            </Button>
          )
        }
      >
        {clusterCount === 0 ? (
          <VStack py={6} spacing={3}>
            <Text color="gray.500">
              {keywordCount > 0
                ? SECTION_LABELS.topicCurator.emptyAction
                : "Discover keywords first, then we'll organize them into topics"}
            </Text>
            {keywordCount > 0 && (
              <Button
                leftIcon={<FiZap />}
                colorScheme="purple"
                onClick={onGenerateClusters}
                isLoading={isGenerating}
              >
                Curate Topics
              </Button>
            )}
          </VStack>
        ) : (
          <VStack align="stretch" spacing={2}>
            {clusters.slice(0, 5).map((cluster) => (
              <HStack key={cluster._id} justify="space-between" p={2} bg={statBg} borderRadius="md">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium" fontSize="sm">
                    {cluster.clusterName}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {cluster.keywords.length} keywords
                  </Text>
                </VStack>
                <Badge colorScheme="blue" size="sm">
                  {cluster.intent}
                </Badge>
              </HStack>
            ))}
            {clusters.length > 5 && (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                +{clusters.length - 5} more topics
              </Text>
            )}
          </VStack>
        )}
      </SectionCard>

      {/* Content Calendar Section */}
      <SectionCard
        id="contentCalendar"
        title={SECTION_LABELS.contentCalendar.title}
        icon={FiCalendar}
        badge={planExists ? 'Active' : undefined}
        action={
          clusterCount > 0 && (
            <Button
              size="xs"
              leftIcon={<FiZap />}
              colorScheme="purple"
              variant="ghost"
              onClick={onGeneratePlan}
              isLoading={isGenerating}
            >
              {planExists ? 'Regenerate' : 'Plan Schedule'}
            </Button>
          )
        }
      >
        {!planExists ? (
          <VStack py={6} spacing={3}>
            <Text color="gray.500">
              {clusterCount > 0
                ? SECTION_LABELS.contentCalendar.emptyAction
                : 'Curate topics first, then plan your publishing schedule'}
            </Text>
            {clusterCount > 0 && (
              <Button
                leftIcon={<FiZap />}
                colorScheme="purple"
                onClick={onGeneratePlan}
                isLoading={isGenerating}
              >
                Plan Schedule
              </Button>
            )}
          </VStack>
        ) : (
          <Text color="gray.600">
            {SECTION_LABELS.contentCalendar.subtitle} — {briefCount} articles scheduled.
          </Text>
        )}
      </SectionCard>

      {/* Article Studio Section */}
      <SectionCard
        id="articleStudio"
        title={SECTION_LABELS.articleStudio.title}
        icon={FiEdit3}
        badge={briefCount > 0 ? `${briefCount}` : undefined}
      >
        {briefCount === 0 ? (
          <VStack py={6} spacing={3}>
            <Text color="gray.500">{SECTION_LABELS.articleStudio.emptyAction}</Text>
          </VStack>
        ) : (
          <VStack align="stretch" spacing={2}>
            {briefs.slice(0, 5).map((brief) => (
              <HStack key={brief._id} justify="space-between" p={2} bg={statBg} borderRadius="md">
                <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                  {brief.title}
                </Text>
                <Badge
                  colorScheme={
                    brief.status === 'published'
                      ? 'green'
                      : brief.status === 'in_progress'
                        ? 'blue'
                        : 'gray'
                  }
                  size="sm"
                >
                  {brief.status === 'published'
                    ? 'Published'
                    : brief.status === 'in_progress'
                      ? 'Drafting'
                      : 'Scheduled'}
                </Badge>
              </HStack>
            ))}
            {briefs.length > 5 && (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                +{briefs.length - 5} more articles
              </Text>
            )}
          </VStack>
        )}
      </SectionCard>
    </VStack>
  );
}
