/**
 * NeedHelpToggle Component
 *
 * Component Hierarchy:
 * App → Layout → Navigation → NeedHelpToggle (this file)
 *
 * Allows users who completed their first project (DIY mode)
 * to re-enable guided mode for the current project.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

'use client';

import { useState } from 'react';
import { Box, HStack, Text, Switch, Tooltip, Icon, useToast } from '@chakra-ui/react';
import { FiHelpCircle } from 'react-icons/fi';

interface Props {
  isGuidedMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export function NeedHelpToggle({ isGuidedMode, onToggle }: Props) {
  const [isEnabled, setIsEnabled] = useState(isGuidedMode);
  const toast = useToast();

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle(newValue);

    toast({
      title: newValue ? 'Guided mode enabled' : 'Guided mode disabled',
      description: newValue
        ? 'Phoo will guide you through each step.'
        : "You're in pro mode. All features unlocked.",
      status: newValue ? 'info' : 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Tooltip
      label={isEnabled ? 'Turn off to unlock all features' : 'Turn on for step-by-step guidance'}
      hasArrow
    >
      <HStack
        spacing={2}
        px={3}
        py={2}
        bg={isEnabled ? 'blue.50' : 'gray.50'}
        borderRadius="lg"
        cursor="pointer"
        onClick={handleToggle}
        transition="all 0.2s"
        _hover={{ bg: isEnabled ? 'blue.100' : 'gray.100' }}
      >
        <Icon as={FiHelpCircle} color={isEnabled ? 'blue.500' : 'gray.400'} boxSize={4} />
        <Text fontSize="xs" fontWeight="medium" color={isEnabled ? 'blue.700' : 'gray.600'}>
          Need Help?
        </Text>
        <Switch
          size="sm"
          isChecked={isEnabled}
          colorScheme="blue"
          onChange={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
        />
      </HStack>
    </Tooltip>
  );
}
