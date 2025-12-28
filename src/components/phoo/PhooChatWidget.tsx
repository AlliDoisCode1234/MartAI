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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createThread = useAction(api.phoo.agent.chat.createThread);
  const sendMessage = useAction(api.phoo.agent.chat.sendMessage);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = isAuthenticated
        ? "Hi! I'm Phoo, your AI SEO assistant. Ask me about your keywords, content strategy, or how to improve your Phoo Rating!"
        : "Hi! I'm Phoo. I can answer questions about our SEO platform. What would you like to know?";

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
    <Card bg="whiteAlpha.50" borderRadius="xl" boxShadow="lg" h="full" minH="500px">
      <CardBody display="flex" flexDirection="column" p={0}>
        {/* Header */}
        <Flex p={4} borderBottom="1px solid" borderColor="whiteAlpha.100" align="center" gap={3}>
          <Avatar size="sm" bg="brand.primary" icon={<FiMessageCircle />} name="Phoo" />
          <VStack align="start" spacing={0}>
            <Heading size="sm" color="white">
              Phoo
            </Heading>
            <Text fontSize="xs" color="whiteAlpha.600">
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
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
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
                <Avatar size="xs" bg="brand.primary" icon={<FiMessageCircle />} name="Phoo" />
              )}
              <Box
                maxW="80%"
                bg={message.role === 'user' ? 'brand.primary' : 'whiteAlpha.100'}
                color="white"
                px={4}
                py={2}
                borderRadius="lg"
                borderBottomRightRadius={message.role === 'user' ? 'sm' : 'lg'}
                borderBottomLeftRadius={message.role === 'assistant' ? 'sm' : 'lg'}
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {message.content}
                </Text>
              </Box>
            </HStack>
          ))}
          {isLoading && (
            <HStack align="start">
              <Avatar size="xs" bg="brand.primary" icon={<FiMessageCircle />} name="Phoo" />
              <Box bg="whiteAlpha.100" px={4} py={2} borderRadius="lg">
                <Spinner size="sm" color="white" />
              </Box>
            </HStack>
          )}
          <div ref={messagesEndRef} />
        </VStack>

        {/* Input */}
        <HStack p={4} borderTop="1px solid" borderColor="whiteAlpha.100">
          <Input
            placeholder={isAuthenticated ? 'Ask Phoo anything...' : 'Ask about our platform...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            bg="whiteAlpha.100"
            border="none"
            color="white"
            _placeholder={{ color: 'whiteAlpha.500' }}
            _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
          />
          <IconButton
            aria-label="Send message"
            icon={<FiSend />}
            onClick={handleSend}
            isLoading={isLoading}
            colorScheme="brand"
            isDisabled={!input.trim()}
          />
        </HStack>
      </CardBody>
    </Card>
  );
}
