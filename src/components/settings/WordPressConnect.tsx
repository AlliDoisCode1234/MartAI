/**
 * WordPressConnect Component
 *
 * Component Hierarchy:
 * App → Settings → Integrations → WordPressConnect
 *
 * UI for connecting WordPress site using Application Password.
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  IconButton,
  useToast,
  Collapse,
  Link,
} from '@chakra-ui/react';
import {
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiExternalLink,
  FiRefreshCw,
  FiTrash2,
} from 'react-icons/fi';
import { SiWordpress } from 'react-icons/si';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface Props {
  projectId: Id<'projects'>;
}

export function WordPressConnect({ projectId }: Props) {
  const toast = useToast();

  // Form state
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [applicationPassword, setApplicationPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Convex hooks
  const connection = useQuery(api.integrations.platformConnections.getConnection, {
    projectId,
    platform: 'wordpress',
  });

  const connectWordPress = useAction(api.integrations.platformConnectionActions.connectWordPress);
  const deleteConnection = useMutation(api.integrations.platformConnections.deleteConnection);

  const handleConnect = async () => {
    if (!siteUrl || !username || !applicationPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsConnecting(true);
    try {
      const result = await connectWordPress({
        projectId,
        siteUrl: siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`,
        username,
        applicationPassword,
      });

      if (result.success) {
        toast({
          title: 'WordPress connected',
          description: `Connected to ${result.siteName}`,
          status: 'success',
          duration: 3000,
        });
        setShowForm(false);
        setSiteUrl('');
        setUsername('');
        setApplicationPassword('');
      } else {
        toast({
          title: 'Connection failed',
          description: result.error,
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connection) return;

    try {
      await deleteConnection({ connectionId: connection._id });
      toast({
        title: 'Disconnected',
        description: 'WordPress connection removed',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Show connected state
  if (connection) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={connection.isValid ? 'green.200' : 'orange.200'}
        bg={connection.isValid ? 'green.50' : 'orange.50'}
      >
        <HStack justify="space-between" mb={2}>
          <HStack>
            <SiWordpress size={24} />
            <Text fontWeight="bold">WordPress</Text>
            <Badge colorScheme={connection.isValid ? 'green' : 'orange'}>
              {connection.isValid ? 'Connected' : 'Invalid'}
            </Badge>
          </HStack>
          <HStack>
            <IconButton
              aria-label="Refresh connection"
              icon={<FiRefreshCw />}
              size="sm"
              variant="ghost"
              onClick={() => {
                // TODO: Validate connection action
              }}
            />
            <IconButton
              aria-label="Disconnect"
              icon={<FiTrash2 />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleDisconnect}
            />
          </HStack>
        </HStack>

        <VStack align="start" spacing={1}>
          <HStack>
            <Text fontSize="sm" color="gray.600">
              Site:
            </Text>
            <Link href={connection.siteUrl} isExternal fontSize="sm">
              {connection.siteName || connection.siteUrl}
              <FiExternalLink style={{ display: 'inline', marginLeft: 4 }} />
            </Link>
          </HStack>
          <HStack>
            <Text fontSize="sm" color="gray.600">
              User:
            </Text>
            <Text fontSize="sm">{connection.credentials.username}</Text>
          </HStack>
          {connection.capabilities && (
            <HStack wrap="wrap" gap={1} mt={1}>
              {connection.capabilities.canPublishPosts && (
                <Badge size="sm" colorScheme="blue">
                  Posts
                </Badge>
              )}
              {connection.capabilities.canPublishPages && (
                <Badge size="sm" colorScheme="blue">
                  Pages
                </Badge>
              )}
              {connection.capabilities.canUploadMedia && (
                <Badge size="sm" colorScheme="blue">
                  Media
                </Badge>
              )}
            </HStack>
          )}
        </VStack>
      </Box>
    );
  }

  // Show connect form
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
      <HStack justify="space-between" mb={4}>
        <HStack>
          <SiWordpress size={24} />
          <Text fontWeight="bold">WordPress</Text>
          <Badge colorScheme="gray">Not Connected</Badge>
        </HStack>
        <Button size="sm" colorScheme="blue" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Connect'}
        </Button>
      </HStack>

      <Collapse in={showForm} animateOpacity>
        <VStack spacing={4} align="stretch">
          <Alert status="info" fontSize="sm">
            <AlertIcon />
            <Box>
              <AlertTitle>How to connect</AlertTitle>
              <AlertDescription>
                Use an{' '}
                <Link
                  href="https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/"
                  isExternal
                  color="blue.500"
                >
                  Application Password
                </Link>{' '}
                from your WordPress admin → Users → Profile → Application Passwords
              </AlertDescription>
            </Box>
          </Alert>

          <FormControl isRequired>
            <FormLabel>WordPress Site URL</FormLabel>
            <Input
              placeholder="https://yoursite.com"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Application Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                value={applicationPassword}
                onChange={(e) => setApplicationPassword(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="blue"
            onClick={handleConnect}
            isLoading={isConnecting}
            loadingText="Connecting..."
            leftIcon={<FiCheck />}
          >
            Test & Connect
          </Button>
        </VStack>
      </Collapse>
    </Box>
  );
}

export default WordPressConnect;
