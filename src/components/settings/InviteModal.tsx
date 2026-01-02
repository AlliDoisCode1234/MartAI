'use client';

/**
 * Invite Modal Component
 *
 * Component Hierarchy:
 * App → Settings → Team → InviteModal (this file)
 *
 * Features: Email input, role selector, copy invite link
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Text,
  HStack,
  IconButton,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  organizationId: Id<'organizations'>;
}

export function InviteModal({ isOpen, onClose, organizationId }: Props) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createInvitation = useMutation(api.teams.invitations.createInvitation);

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast({ title: 'Please enter an email address', status: 'warning', duration: 2000 });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createInvitation({
        organizationId,
        email: email.trim().toLowerCase(),
        role,
      });

      // Generate invite link
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/invite/${result.token}`;
      setInviteLink(link);

      toast({
        title: 'Invitation sent!',
        description: 'Share the link or they can accept via email.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to send invitation',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({ title: 'Link copied!', status: 'success', duration: 1500 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Failed to copy', status: 'error', duration: 2000 });
    }
  };

  const handleClose = () => {
    setEmail('');
    setRole('editor');
    setInviteLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite Team Member</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {!inviteLink ? (
              <>
                <FormControl isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                  >
                    <option value="admin">Admin - Can invite and remove members</option>
                    <option value="editor">Editor - Can edit content</option>
                    <option value="viewer">Viewer - Read-only access</option>
                  </Select>
                </FormControl>

                <Text fontSize="sm" color="gray.500">
                  Invitations expire after 7 days.
                </Text>
              </>
            ) : (
              <>
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  Invitation created for {email}
                </Alert>

                <FormControl>
                  <FormLabel>Share this invite link</FormLabel>
                  <InputGroup>
                    <Input
                      value={inviteLink}
                      isReadOnly
                      pr="3rem"
                      fontFamily="mono"
                      fontSize="sm"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Copy link"
                        icon={copied ? <FiCheck /> : <FiCopy />}
                        size="sm"
                        colorScheme={copied ? 'green' : 'gray'}
                        onClick={handleCopyLink}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Text fontSize="sm" color="gray.500">
                  The invitee will need to sign up or log in to accept.
                </Text>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          {!inviteLink ? (
            <HStack spacing={3}>
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button colorScheme="orange" onClick={handleSubmit} isLoading={isLoading}>
                Send Invitation
              </Button>
            </HStack>
          ) : (
            <HStack spacing={3}>
              <Button variant="ghost" onClick={handleClose}>
                Done
              </Button>
              <Button
                colorScheme="orange"
                onClick={() => {
                  setEmail('');
                  setInviteLink(null);
                }}
              >
                Invite Another
              </Button>
            </HStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
