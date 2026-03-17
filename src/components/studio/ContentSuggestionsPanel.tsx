'use client';

/**
 * ContentSuggestionsPanel
 *
 * Component Hierarchy:
 * App -> StudioLayout -> ContentEditorPage -> ContentSuggestionsPanel
 *
 * Real-time coaching panel that analyzes SEO score breakdowns and generates
 * actionable, persona-driven writing suggestions. Updates as the user types.
 *
 * Tier 1: Deterministic rules (no AI calls) — via lib/suggestionEngine.ts
 * Tier 2: "Fix it with Phoo" buttons trigger scoped AI improvements
 */

import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Collapse,
  Button,
  Badge,
  Tooltip,
  useDisclosure,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import {
  FiChevronDown,
  FiChevronUp,
  FiZap,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiEdit3,
  FiType,
  FiHash,
  FiFileText,
  FiRefreshCw,
  FiThumbsUp,
  FiThumbsDown,
  FiSend,
} from 'react-icons/fi';
import type { SEOScoreResult } from '@/lib/seoScoring';
import {
  generateSuggestions,
  type Suggestion,
  type SuggestionSeverity,
  type SuggestionIconKey,
} from '@/lib/suggestionEngine';

// ============================================================================
// Icon + Severity Mapping (UI-only — maps engine keys to React icons)
// ============================================================================

const ICON_MAP: Record<SuggestionIconKey, typeof FiEdit3> = {
  edit: FiEdit3,
  type: FiType,
  hash: FiHash,
  file: FiFileText,
};

interface Props {
  readonly liveScore: SEOScoreResult | null;
  readonly content: string;
  readonly keywords: string[];
  readonly targetWordCount: number;
  readonly industry?: string;
  readonly onFeedback?: (
    suggestionId: string | null,
    feedbackType: 'suggestion_accepted' | 'suggestion_dismissed' | 'custom',
    customNote?: string
  ) => void;
  /** Secure AI revision callback — calls reviseWithPersona action
   *  isPreEnhanced: skip enhanceInstruction if the instruction is already a precise fixInstruction */
  readonly onCustomRevision?: (
    instruction: string,
    options?: { isPreEnhanced?: boolean }
  ) => Promise<{ revisedContent: string; previousContent: string } | null>;
  /** Undo handler — restores content to a previous snapshot */
  readonly onRestoreContent?: (previousContent: string) => void;
}

const SEVERITY_CONFIG: Record<
  SuggestionSeverity,
  { color: string; bg: string; border: string; icon: typeof FiAlertCircle; label: string }
> = {
  issue: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.2)',
    icon: FiAlertCircle,
    label: 'Fix This',
  },
  suggestion: {
    color: '#FF9D00',
    bg: 'rgba(255, 157, 0, 0.08)',
    border: 'rgba(255, 157, 0, 0.2)',
    icon: FiInfo,
    label: 'Improve',
  },
  tip: {
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.2)',
    icon: FiInfo,
    label: 'Tip',
  },
  success: {
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.2)',
    icon: FiCheckCircle,
    label: 'Great',
  },
};

// ============================================================================
// Component
// ============================================================================

export function ContentSuggestionsPanel({
  liveScore,
  content,
  keywords,
  targetWordCount,
  industry,
  onFeedback,
  onCustomRevision,
  onRestoreContent,
}: Props) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // UX-043: Synchronous ref guard — React state updates are async,
  // so rapid clicks can fire before isSubmitting takes effect in the UI.
  const isSubmittingRef = useRef(false);
  const toast = useToast();

  const handleCustomFeedbackSubmit = async () => {
    if (!customNote.trim()) return;
    // UX-043: Synchronous guard prevents concurrent submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      if (onCustomRevision) {
        const result = await onCustomRevision(customNote);

        if (result?.revisedContent) {
          // RevisionReviewBanner handles the review UX — no toast needed
          console.log('[PhooCoach] Revision pending review — banner shown');
        } else {
          // AI action returned no content — always inform the user
          console.warn('[PhooCoach] Revision action returned null result:', result);
          toast({
            title: 'No changes applied',
            description: 'Phoo could not revise the content with that instruction. Try being more specific.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } else if (onFeedback) {
        onFeedback(null, 'custom', customNote);
        toast({
          title: 'Persona updated',
          description: "Your feedback has been saved. Phoo will learn from this.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      setCustomNote('');
    } catch (err) {
      console.warn('[PhooCoach] Custom revision failed:', err);
      toast({
        title: 'Revision failed',
        description: 'Could not apply the instruction. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // ── Empty / No Score State ───────────────────────────────────────
  if (!content || !content.trim()) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="16px"
        p={5}
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
      >
        <HStack spacing={3}>
          <Icon as={FiZap} color="#FF9D00" boxSize={5} />
          <Box>
            <Text fontWeight="semibold" color="gray.700" fontSize="sm">
              Start writing to get coaching
            </Text>
            <Text color="gray.400" fontSize="xs">
              Phoo analyzes your content in real-time and suggests improvements
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  }

  if (!liveScore) return null;

  const suggestions = generateSuggestions(liveScore, content, keywords, targetWordCount, industry);
  // User requested to ONLY show actionable improvements, filter out 'success'
  const actionableSuggestions = suggestions.filter((s) => s.severity !== 'success');

  // Count by severity for the header badge
  const issueCount = actionableSuggestions.filter((s) => s.severity === 'issue').length;
  const suggestionCount = actionableSuggestions.filter((s) => s.severity === 'suggestion').length;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="16px"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
      overflow="hidden"
    >
      {/* Header — Always visible, click to toggle */}
      <HStack
        justify="space-between"
        p={4}
        cursor="pointer"
        onClick={onToggle}
        _hover={{ bg: 'gray.50' }}
        transition="background 0.15s"
        role="button"
        aria-expanded={isOpen}
        aria-label="Toggle content suggestions"
      >
        <HStack spacing={3}>
          <Icon as={FiZap} color="#FF9D00" boxSize={5} />
          <Text fontWeight="semibold" color="gray.700" fontSize="sm">
            Phoo Coach
          </Text>
          <HStack spacing={1.5}>
            {issueCount > 0 && (
              <Badge
                bg="rgba(239, 68, 68, 0.1)"
                color="#EF4444"
                fontSize="xs"
                borderRadius="full"
                px={2}
              >
                {issueCount} {issueCount === 1 ? 'issue' : 'issues'}
              </Badge>
            )}
            {suggestionCount > 0 && (
              <Badge
                bg="rgba(255, 157, 0, 0.1)"
                color="#FF9D00"
                fontSize="xs"
                borderRadius="full"
                px={2}
              >
                {suggestionCount}
              </Badge>
            )}
            {issueCount === 0 && suggestionCount === 0 && (
              <Badge
                bg="rgba(34, 197, 94, 0.1)"
                color="#22C55E"
                fontSize="xs"
                borderRadius="full"
                px={2}
              >
                All clear
              </Badge>
            )}
          </HStack>
        </HStack>
        <Icon
          as={isOpen ? FiChevronUp : FiChevronDown}
          color="gray.400"
          boxSize={4}
        />
      </HStack>

      {/* Suggestions List */}
      <Collapse in={isOpen} animateOpacity>
        <VStack
          align="stretch"
          spacing={0}
          borderTop="1px solid"
          borderTopColor="gray.100"
        >
          {actionableSuggestions.length === 0 && (
            <HStack spacing={3} p={4}>
              <Icon as={FiCheckCircle} color="#22C55E" boxSize={4} />
              <Text color="gray.500" fontSize="sm">
                Your content looks great! Keep writing.
              </Text>
            </HStack>
          )}

          {actionableSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onFeedback={onFeedback}
              onFixWithPhoo={onCustomRevision ? async (fixInstruction) => {
                const result = await onCustomRevision(fixInstruction, { isPreEnhanced: true });
                return result;
              } : undefined}
              onRestoreContent={onRestoreContent}
            />
          ))}

          {/* Custom Persona Interaction Field */}
          <Box p={4} borderTop="1px solid" borderTopColor="gray.100" bg="gray.50">
            <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={2}>
              Instruct Phoo Coach
            </Text>
            <Text fontSize="xs" color="gray.400" mb={2}>
              Tell Phoo how to improve this content (max 500 chars). The instruction applies only to the content on this page.
            </Text>
            <Box position="relative">
              <Textarea
                placeholder="e.g. 'Make the tone more authoritative' or 'Simplify the technical jargon'"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value.slice(0, 500))}
                size="sm"
                fontSize="xs"
                bg="white"
                borderRadius="md"
                resize="none"
                pr={10}
                rows={3}
                maxLength={500}
                _focus={{ borderColor: '#FF9D00', boxShadow: '0 0 0 1px #FF9D00' }}
              />
              <HStack justify="space-between" mt={1}>
                <Text fontSize="2xs" color={customNote.length > 450 ? 'orange.500' : 'gray.400'}>
                  {customNote.length}/500
                </Text>
                <Tooltip label="Apply instruction to current content" fontSize="xs" hasArrow>
                  <Button
                    size="xs"
                    colorScheme="orange"
                    variant="solid"
                    leftIcon={<Icon as={FiSend} boxSize={3} />}
                    onClick={handleCustomFeedbackSubmit}
                    isLoading={isSubmitting}
                    isDisabled={!customNote.trim()}
                  >
                    Apply
                  </Button>
                </Tooltip>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </Collapse>
    </Box>
  );
}

// ============================================================================
// Subcomponents
// ============================================================================

interface SuggestionCardProps {
  suggestion: Suggestion;
  onFeedback?: (suggestionId: string, feedbackType: 'suggestion_accepted' | 'suggestion_dismissed') => void;
  onFixWithPhoo?: (coaching: string) => Promise<{ revisedContent: string; previousContent: string } | null>;
  onRestoreContent?: (previousContent: string) => void;
}

function SuggestionCard({ suggestion, onFeedback, onFixWithPhoo, onRestoreContent }: SuggestionCardProps) {
  const config = SEVERITY_CONFIG[suggestion.severity];
  const [isFixing, setIsFixing] = useState(false);
  const toast = useToast();

  const handleFixWithPhoo = async () => {
    if (!onFixWithPhoo || isFixing) return;
    // Use the targeted AI instruction, falling back to coaching text
    const instruction = suggestion.fixInstruction || suggestion.coaching;
    setIsFixing(true);
    try {
      toast({
        title: `Phoo is fixing: ${suggestion.title}`,
        status: 'info',
        duration: 3000,
      });
      const result = await onFixWithPhoo(instruction);
      if (result) {
        // RevisionReviewBanner handles the review UX — no toast needed
        console.log(`[PhooCoach] Fix pending review: ${suggestion.title}`);
      }
    } catch (err) {
      toast({
        title: 'Fix failed',
        description: err instanceof Error ? err.message : 'AI revision failed',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Box
      borderBottom="1px solid"
      borderBottomColor="gray.50"
      _last={{ borderBottom: 'none' }}
    >
      <HStack
        align="start"
        spacing={3}
        p={4}
        bg={config.bg}
        borderLeft="3px solid"
        borderLeftColor={config.color}
      >
        <Icon
          as={ICON_MAP[suggestion.iconKey]}
          color={config.color}
          boxSize={4}
          mt={0.5}
          flexShrink={0}
        />
        <Box flex={1}>
          <HStack justify="space-between" mb={1}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.700">
              {suggestion.title}
            </Text>
            {suggestion.fixable && suggestion.severity !== 'success' && onFixWithPhoo && (
              <Button
                size="xs"
                variant="ghost"
                color={config.color}
                leftIcon={<Icon as={FiRefreshCw} boxSize={3} />}
                _hover={{ bg: config.border }}
                onClick={handleFixWithPhoo}
                isLoading={isFixing}
                loadingText="Fixing..."
              >
                Fix with Phoo
              </Button>
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500" lineHeight="1.6">
            {suggestion.coaching}
          </Text>
          {/* Feedback buttons — not shown for success cards */}
          {suggestion.severity !== 'success' && onFeedback && (
            <HStack spacing={1} mt={2}>
              <Tooltip label="This helped" fontSize="xs" hasArrow>
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: '#22C55E', bg: 'rgba(34, 197, 94, 0.08)' }}
                  onClick={() => onFeedback(suggestion.id, 'suggestion_accepted')}
                  aria-label="Mark suggestion as helpful"
                >
                  <Icon as={FiThumbsUp} boxSize={3} />
                </Button>
              </Tooltip>
              <Tooltip label="Not relevant" fontSize="xs" hasArrow>
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)' }}
                  onClick={() => onFeedback(suggestion.id, 'suggestion_dismissed')}
                  aria-label="Dismiss suggestion"
                >
                  <Icon as={FiThumbsDown} boxSize={3} />
                </Button>
              </Tooltip>
            </HStack>
          )}
        </Box>
      </HStack>
    </Box>
  );
}
