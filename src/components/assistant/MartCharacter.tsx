'use client';

import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface MartCharacterProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showBubble?: boolean;
}

export function MartCharacter({ message, size = 'md', showBubble = true }: MartCharacterProps) {
  const sizeMap = {
    sm: { avatar: '60px', font: 'sm' },
    md: { avatar: '100px', font: 'md' },
    lg: { avatar: '140px', font: 'lg' },
  };

  const config = sizeMap[size];

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
    >
      {/* Speech Bubble */}
      {showBubble && message && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          bg="white"
          borderRadius="2xl"
          px={6}
          py={4}
          boxShadow="lg"
          position="relative"
          maxW="400px"
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '12px',
            borderStyle: 'solid',
            borderColor: 'white transparent transparent transparent',
          }}
        >
          <Text fontSize={config.font} color="gray.700" textAlign="center">
            {message}
          </Text>
        </MotionBox>
      )}

      {/* Mart Avatar */}
      <MotionBox
        w={config.avatar}
        h={config.avatar}
        borderRadius="full"
        bgGradient="linear(to-br, brand.orange, #FF8C42)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          inset: '-4px',
          borderRadius: 'full',
          bgGradient: 'linear(to-br, brand.orange, transparent)',
          opacity: 0.3,
          filter: 'blur(8px)',
        }}
      >
        {/* Face */}
        <Box position="relative" w="60%" h="60%">
          {/* Eyes */}
          <Box
            position="absolute"
            top="25%"
            left="20%"
            w="15%"
            h="15%"
            bg="white"
            borderRadius="full"
          />
          <Box
            position="absolute"
            top="25%"
            right="20%"
            w="15%"
            h="15%"
            bg="white"
            borderRadius="full"
          />
          {/* Smile */}
          <Box
            position="absolute"
            bottom="20%"
            left="50%"
            transform="translateX(-50%)"
            w="40%"
            h="20%"
            borderBottomRadius="full"
            borderBottom="3px solid white"
            borderLeft="3px solid white"
            borderRight="3px solid white"
          />
        </Box>
      </MotionBox>

      {/* Name tag */}
      <Text fontSize="sm" fontWeight="bold" color="gray.600" letterSpacing="wide">
        MART
      </Text>
    </MotionBox>
  );
}
