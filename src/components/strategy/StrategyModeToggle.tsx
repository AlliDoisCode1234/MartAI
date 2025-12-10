/**
 * StrategyModeToggle Component
 *
 * Component Hierarchy:
 * App → StrategyPage → StrategyModeToggle
 *
 * Allows users to switch between Guided wizard and DIY (manual) mode.
 * Persists preference to localStorage.
 */

'use client';

import {
  Box,
  HStack,
  Text,
  Button,
  ButtonGroup,
  Icon,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { FiCompass, FiTool, FiHelpCircle } from 'react-icons/fi';

export type StrategyMode = 'guided' | 'diy';

interface Props {
  mode: StrategyMode;
  onModeChange: (mode: StrategyMode) => void;
}

const STORAGE_KEY = 'martai_strategy_mode';

/**
 * Get saved mode from localStorage
 */
export function getSavedStrategyMode(): StrategyMode {
  if (typeof window === 'undefined') return 'guided';
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'diy' ? 'diy' : 'guided';
}

/**
 * Save mode to localStorage
 */
export function saveStrategyMode(mode: StrategyMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, mode);
}

export function StrategyModeToggle({ mode, onModeChange }: Props) {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('white', 'gray.600');

  const handleModeChange = (newMode: StrategyMode) => {
    saveStrategyMode(newMode);
    onModeChange(newMode);
  };

  return (
    <HStack bg={bgColor} borderRadius="lg" p={1} spacing={0}>
      <Tooltip label="Step-by-step guidance through the content strategy process" hasArrow>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Icon as={FiCompass} />}
          bg={mode === 'guided' ? activeBg : 'transparent'}
          boxShadow={mode === 'guided' ? 'sm' : 'none'}
          fontWeight={mode === 'guided' ? 'semibold' : 'normal'}
          onClick={() => handleModeChange('guided')}
          borderRadius="md"
        >
          Guided
        </Button>
      </Tooltip>
      <Tooltip label="Full control - access all features directly without guided steps" hasArrow>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Icon as={FiTool} />}
          bg={mode === 'diy' ? activeBg : 'transparent'}
          boxShadow={mode === 'diy' ? 'sm' : 'none'}
          fontWeight={mode === 'diy' ? 'semibold' : 'normal'}
          onClick={() => handleModeChange('diy')}
          borderRadius="md"
        >
          DIY
        </Button>
      </Tooltip>
    </HStack>
  );
}

/**
 * Escape hatch link for frustrated users in guided mode
 */
export function SkipWizardLink({ onClick }: { onClick: () => void }) {
  const linkColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <HStack spacing={1} justify="center" pt={2}>
      <Icon as={FiHelpCircle} color={linkColor} boxSize={3} />
      <Text
        fontSize="xs"
        color={linkColor}
        cursor="pointer"
        _hover={{ textDecoration: 'underline' }}
        onClick={onClick}
      >
        Prefer to do this yourself? Switch to DIY mode
      </Text>
    </HStack>
  );
}
