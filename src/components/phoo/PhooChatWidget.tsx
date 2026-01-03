/**
 * PhooChatWidget - Chat interface for Phoo
 *
 * Component Hierarchy:
 * src/components/phoo/PhooChatWidget.tsx (this file)
 * ├── Shows chat messages
 * ├── Handles input
 * └── Uses Convex actions for AI responses
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  Avatar,
  Spinner,
  Card,
  CardBody,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import MarkdownContent from '@/src/components/shared/MarkdownContent';

interface Props {
  projectId?: Id<'projects'>;
  isAuthenticated?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function PhooChatWidget({ projectId, isAuthenticated = false }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [showFaqs, setShowFaqs] = useState(!isAuthenticated); // Show FAQs for guest users
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createThread = useAction(api.phoo.agent.chat.createThread);
  const sendMessage = useAction(api.phoo.agent.chat.sendMessage);

  // FAQ suggestions for guest users
  const faqSuggestions = [
    'What is Phoo and how does it work?',
    'How does AI content generation work?',
    'What integrations do you support?',
    'How much does Phoo cost?',
    'What is SEO and why does it matter?',
    'How long until I see results?',
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = isAuthenticated
        ? "Hi! I'm Phoo, your AI SEO assistant. Ask me about your keywords, content strategy, or how to improve your Phoo Rating!"
        : "Hi! I'm Phoo. I can answer questions about our SEO platform and help you understand how automated content marketing works. Choose a question below or ask your own!";

      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isAuthenticated, messages.length]);

  // Handle FAQ click
  const handleFaqClick = (question: string) => {
    setShowFaqs(false);
    setInput(question);
    // Trigger send after a short delay to allow state update
    setTimeout(() => {
      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      document.querySelector<HTMLInputElement>('[data-phoo-input]')?.dispatchEvent(event);
    }, 100);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string;

      if (!threadId) {
        // Create new thread with initial message
        const result = await createThread({
          projectId,
          initialMessage: userMessage.content,
        });
        setThreadId(result.threadId);
        response = result.response || 'I encountered an issue. Please try again.';
      } else {
        // Continue existing thread
        const result = await sendMessage({
          threadId,
          message: userMessage.content,
          projectId,
        });
        response = result.response;
      }

      // Don't add blank responses
      if (!response || response.trim() === '') {
        response = "I'm still thinking... please try again in a moment.";
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card bg="white" borderRadius="xl" boxShadow="lg" h="full" minH="500px">
      <CardBody display="flex" flexDirection="column" p={0}>
        {/* Header */}
        <Flex
          p={4}
          borderBottom="1px solid"
          borderColor="gray.200"
          align="center"
          gap={3}
          bg="brand.teal"
          borderTopRadius="xl"
        >
          <Avatar size="sm" bg="white" color="brand.teal" icon={<FiMessageCircle />} name="Phoo" />
          <VStack align="start" spacing={0}>
            <Heading size="sm" color="white">
              Phoo
            </Heading>
            <Text fontSize="xs" color="whiteAlpha.800">
              {isAuthenticated ? 'Your SEO Assistant' : 'Ask me about Phoo'}
            </Text>
          </VStack>
        </Flex>

        {/* Messages */}
        <VStack
          flex={1}
          overflowY="auto"
          p={4}
          spacing={4}
          align="stretch"
          bg="gray.50"
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            },
          }}
        >
          {messages.map((message) => (
            <HStack
              key={message.id}
              align="start"
              justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
            >
              {message.role === 'assistant' && (
                <Avatar
                  size="xs"
                  bg="brand.teal"
                  color="white"
                  icon={<FiMessageCircle />}
                  name="Phoo"
                />
              )}
              <Box
                maxW="80%"
                bg={message.role === 'user' ? 'brand.teal' : 'white'}
                color={message.role === 'user' ? 'white' : 'gray.800'}
                px={4}
                py={2}
                borderRadius="lg"
                borderBottomRightRadius={message.role === 'user' ? 'sm' : 'lg'}
                borderBottomLeftRadius={message.role === 'assistant' ? 'sm' : 'lg'}
                boxShadow="sm"
              >
                {message.role === 'user' ? (
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {message.content}
                  </Text>
                ) : (
                  <MarkdownContent content={message.content} fontSize="sm" color="gray.800" />
                )}
              </Box>
            </HStack>
          ))}
          {isLoading && (
            <HStack align="start">
              <Avatar
                size="xs"
                bg="brand.teal"
                color="white"
                icon={<FiMessageCircle />}
                name="Phoo"
              />
              <Box bg="white" px={4} py={2} borderRadius="lg" boxShadow="sm">
                <HStack spacing={2}>
                  <Spinner size="xs" color="brand.teal" />
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    Phoo is typing...
                  </Text>
                </HStack>
              </Box>
            </HStack>
          )}

          {/* FAQ Suggestions for guests */}
          {showFaqs && !isAuthenticated && messages.length <= 1 && (
            <Box mt={2}>
              <Text fontSize="xs" color="gray.500" mb={2} fontWeight="medium">
                Popular questions:
              </Text>
              <Flex flexWrap="wrap" gap={2}>
                {faqSuggestions.map((faq, index) => (
                  <Box
                    key={index}
                    as="button"
                    type="button"
                    px={3}
                    py={2}
                    bg="white"
                    border="1px solid"
                    borderColor="orange.200"
                    borderRadius="full"
                    fontSize="xs"
                    color="gray.700"
                    cursor="pointer"
                    _hover={{ bg: 'orange.50', borderColor: 'brand.orange' }}
                    _focus={{ boxShadow: 'outline', outline: 'none' }}
                    onClick={() => {
                      setShowFaqs(false);
                      setInput(faq);
                    }}
                  >
                    {faq}
                  </Box>
                ))}
              </Flex>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </VStack>

        {/* Input */}
        <HStack
          p={4}
          borderTop="1px solid"
          borderColor="gray.200"
          bg="white"
          borderBottomRadius="xl"
        >
          <Input
            placeholder={isAuthenticated ? 'Ask Phoo anything...' : 'Ask about our platform...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            bg="gray.100"
            border="none"
            color="gray.800"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ bg: 'gray.200', boxShadow: 'none' }}
          />
          <IconButton
            aria-label="Send message"
            icon={<FiSend />}
            onClick={handleSend}
            isLoading={isLoading}
            bg="brand.teal"
            color="white"
            _hover={{ bg: 'brand.teal', opacity: 0.9 }}
            isDisabled={!input.trim()}
          />
        </HStack>
      </CardBody>
    </Card>
  );
}
