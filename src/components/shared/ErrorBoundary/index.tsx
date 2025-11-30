'use client';

import { Component, type ReactNode } from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          minH="100vh" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          bgGradient="linear(to-br, gray.50, gray.100)"
          p={8}
        >
          <VStack 
            spacing={6} 
            textAlign="center"
            bg="white"
            p={12}
            borderRadius="2xl"
            boxShadow="xl"
            maxW="md"
          >
            <Text 
              fontSize="6xl" 
              fontWeight="bold" 
              bgGradient="linear(to-r, brand.orange, brand.red)"
              bgClip="text"
            >
              Oops!
            </Text>
            <Text fontSize="xl" fontWeight="semibold" color="gray.700">
              Something went wrong
            </Text>
            <Text color="gray.500" fontSize="sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              colorScheme="brand"
              size="lg"
              mt={4}
            >
              Reload Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

