'use client';

/**
 * Component Hierarchy:
 * app/strategy/page.tsx
 *   └── StrategyDashboard (this file)
 *       ├── Quick Stats Header
 *       ├── KeywordsSection (collapsible)
 *       ├── ClustersSection (collapsible)
 *       ├── PlanSection (collapsible)
 *       └── BriefsSection (collapsible)
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
  FiFileText,
  FiPlay,
  FiPlus,
  FiZap,
} from 'react-icons/fi';

interface Props {
  projectId: string;
  keywordCount: number;
  clusterCount: number;
  planExists: boolean;
  briefCount: number;
  draftCount: number;
  onImportKeywords: () => void;
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
  clusters,
  briefs,
  isGenerating,
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    keywords: true,
    clusters: true,
    plan: true,
    briefs: true,
  });

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
                <StatHelpText>imported</StatHelpText>
              </Stat>
              <Stat size="sm">
                <StatLabel>Clusters</StatLabel>
                <StatNumber>{clusterCount}</StatNumber>
                <StatHelpText>topics</StatHelpText>
              </Stat>
              <Stat size="sm">
                <StatLabel>Briefs</StatLabel>
                <StatNumber>{briefCount}</StatNumber>
                <StatHelpText>planned</StatHelpText>
              </Stat>
              <Stat size="sm">
                <StatLabel>Drafts</StatLabel>
                <StatNumber>{draftCount}</StatNumber>
                <StatHelpText>in progress</StatHelpText>
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
          <Text color="gray.600">{keywordCount} keywords imported and ready for clustering.</Text>
        )}
      </SectionCard>

      {/* Clusters Section */}
      <SectionCard
        id="clusters"
        title="Topic Clusters"
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
              Generate
            </Button>
          )
        }
      >
        {clusterCount === 0 ? (
          <VStack py={6} spacing={3}>
            <Text color="gray.500">
              {keywordCount > 0
                ? 'Keywords ready - generate topic clusters'
                : 'Import keywords first, then generate clusters'}
            </Text>
            {keywordCount > 0 && (
              <Button
                leftIcon={<FiZap />}
                colorScheme="purple"
                onClick={onGenerateClusters}
                isLoading={isGenerating}
              >
                Generate Topic Clusters
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
                +{clusters.length - 5} more clusters
              </Text>
            )}
          </VStack>
        )}
      </SectionCard>

      {/* Plan Section */}
      <SectionCard
        id="plan"
        title="Content Plan"
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
              {planExists ? 'Regenerate' : 'Generate'}
            </Button>
          )
        }
      >
        {!planExists ? (
          <VStack py={6} spacing={3}>
            <Text color="gray.500">
              {clusterCount > 0
                ? 'Clusters ready - generate a quarterly content plan'
                : 'Generate topic clusters first'}
            </Text>
            {clusterCount > 0 && (
              <Button
                leftIcon={<FiZap />}
                colorScheme="purple"
                onClick={onGeneratePlan}
                isLoading={isGenerating}
              >
                Generate Content Plan
              </Button>
            )}
          </VStack>
        ) : (
          <Text color="gray.600">{briefCount} briefs planned in your content calendar.</Text>
        )}
      </SectionCard>

      {/* Briefs Section */}
      <SectionCard
        id="briefs"
        title="Content Briefs"
        icon={FiFileText}
        badge={briefCount > 0 ? `${briefCount}` : undefined}
      >
        {briefCount === 0 ? (
          <VStack py={6} spacing={3}>
            <Text color="gray.500">Generate a content plan to create briefs</Text>
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
                  {brief.status}
                </Badge>
              </HStack>
            ))}
            {briefs.length > 5 && (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                +{briefs.length - 5} more briefs
              </Text>
            )}
          </VStack>
        )}
      </SectionCard>
    </VStack>
  );
}
