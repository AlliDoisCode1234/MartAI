'use client';

/**
 * BadgeModal Component
 *
 * Component Hierarchy:
 * App → Dashboard/Settings → BadgeModal (this file)
 *
 * Modal showing embeddable MR Score badge with copy-paste embed codes.
 */

import { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Code,
  useToast,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiCopy, FiCheck } from 'react-icons/fi';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentScore: number;
};

export function BadgeModal({ isOpen, onClose, projectId, currentScore }: Props) {
  const toast = useToast();
  const [style, setStyle] = useState<'compact' | 'full'>('compact');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const badgeUrl = `${baseUrl}/api/badge/${projectId}?style=${style}&theme=${theme}`;
  const profileUrl = `${baseUrl}/profile/${projectId}`;

  const htmlCode = `<a href="${profileUrl}" target="_blank"><img src="${badgeUrl}" alt="PR Score Badge" /></a>`;
  const markdownCode = `[![PR Score](${badgeUrl})](${profileUrl})`;

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Get Your PR Score Badge</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={5} align="stretch">
            {/* Preview */}
            <Box textAlign="center" p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Preview
              </Text>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badgeUrl}
                alt="PR Score Badge Preview"
                style={{ display: 'inline-block' }}
              />
            </Box>

            {/* Options */}
            <HStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Style</FormLabel>
                <Select
                  size="sm"
                  value={style}
                  onChange={(e) => setStyle(e.target.value as 'compact' | 'full')}
                >
                  <option value="compact">Compact</option>
                  <option value="full">Full</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Theme</FormLabel>
                <Select
                  size="sm"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </FormControl>
            </HStack>

            {/* Embed Codes */}
            <Tabs variant="enclosed" size="sm">
              <TabList>
                <Tab>HTML</Tab>
                <Tab>Markdown</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={3}>
                  <Box position="relative">
                    <Code
                      display="block"
                      p={3}
                      borderRadius="md"
                      fontSize="xs"
                      whiteSpace="pre-wrap"
                      wordBreak="break-all"
                    >
                      {htmlCode}
                    </Code>
                    <Button
                      size="xs"
                      position="absolute"
                      top={2}
                      right={2}
                      leftIcon={copied ? <FiCheck /> : <FiCopy />}
                      onClick={() => handleCopy(htmlCode)}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </Box>
                </TabPanel>
                <TabPanel p={0} pt={3}>
                  <Box position="relative">
                    <Code
                      display="block"
                      p={3}
                      borderRadius="md"
                      fontSize="xs"
                      whiteSpace="pre-wrap"
                      wordBreak="break-all"
                    >
                      {markdownCode}
                    </Code>
                    <Button
                      size="xs"
                      position="absolute"
                      top={2}
                      right={2}
                      leftIcon={copied ? <FiCheck /> : <FiCopy />}
                      onClick={() => handleCopy(markdownCode)}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Text fontSize="xs" color="gray.500" textAlign="center">
              Embed this badge on your website to show your SEO health score. Links back to your
              MartAI profile.
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
