'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<'projects'>;
  projectName: string;
}

export function DeleteProjectModal({ isOpen, onClose, projectId, projectName }: DeleteProjectModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteProject = useMutation(api.projects.projects.deleteProject);
  const toast = useToast();
  const router = useRouter();

  const isConfirmed = confirmText === projectName;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteProject({ projectId });
      
      // Successfully soft-deleted — nuke Context Memory
      localStorage.removeItem('currentProjectId');
      
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully archived and your limits have been restored.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
      // Eject user cleanly to the generic studio router
      router.push('/studio');
      router.refresh();
      
    } catch (error: any) {
      toast({
        title: 'Deletion Failed',
        description: error.message || 'There was a security issue trying to delete the project.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent border="1px solid" borderColor="red.100">
        <ModalHeader color="red.600">Delete Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="error" borderRadius="md" alignItems="flex-start">
              <AlertIcon mt={1} />
              <VStack align="start" spacing={1}>
                <AlertTitle fontSize="sm">This action cannot be cleanly reversed by you.</AlertTitle>
                <AlertDescription fontSize="xs">
                  This will immediately sever your integrations, queue the AI models to drop your data context, and remove all keywords, articles, and scheduled operations from your view.
                </AlertDescription>
              </VStack>
            </Alert>
            
            <Text fontSize="sm" color="gray.600">
              Please type <strong>{projectName}</strong> to confirm you want to surrender this project.
            </Text>
            
            <Input 
              placeholder={projectName}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              focusBorderColor="red.500"
              bg="white"
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            colorScheme="red" 
            onClick={handleDelete} 
            isDisabled={!isConfirmed || isDeleting}
            isLoading={isDeleting}
          >
            I understand, delete project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
