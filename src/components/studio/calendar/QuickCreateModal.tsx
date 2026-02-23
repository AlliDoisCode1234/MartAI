import { useState } from 'react';
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
  Icon,
} from '@chakra-ui/react';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

// Content Types mapped exactly from convex/phoo/contentTypes.ts
const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'blogVersus', label: 'Comparison Post' },
  { value: 'blogVideo', label: 'Video Post' },
  { value: 'contentRefresh', label: 'Content Refresh' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'service', label: 'Service Page' },
  { value: 'about', label: 'About Page' },
  { value: 'homepage', label: 'Homepage' },
  { value: 'leadMagnet', label: 'Lead Magnet' },
  { value: 'paidProduct', label: 'Paid Product' },
  { value: 'areasWeServe', label: 'Areas We Serve' },
  { value: 'employment', label: 'Employment' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'donate', label: 'Donate' },
  { value: 'events', label: 'Events' },
  { value: 'partner', label: 'Partner' },
  { value: 'program', label: 'Program' },
];

export interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  projectId: Id<'projects'> | undefined;
}

export function QuickCreateModal({
  isOpen,
  onClose,
  selectedDate,
  projectId,
}: QuickCreateModalProps) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('blog');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutations
  const createPiece = useMutation(api.contentPieces.create);
  const schedulePiece = useMutation(api.contentPieces.schedule);

  const handleSubmit = async () => {
    if (!title || !projectId || !selectedDate) {
      toast({
        title: 'Missing information',
        description: 'Please provide at least a title.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create a raw shell with generating/draft status
      const pieceId = await createPiece({
        projectId,
        title,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contentType: type as any, // Cast to union type
        keywords: keyword ? [keyword] : [],
      });

      // 2. Schedule it immediately (sets status: 'scheduled' and scheduledDate)
      await schedulePiece({
        contentPieceId: pieceId,
        publishDate: selectedDate.getTime(),
      });

      toast({
        title: 'Content Scheduled',
        description: `Scheduled for ${selectedDate.toLocaleDateString()}`,
        status: 'success',
      });

      // Reset & Close
      setTitle('');
      setKeyword('');
      setType('blog');
      onClose();
    } catch (e) {
      toast({
        title: 'Error scheduling content',
        description: e instanceof Error ? e.message : 'Unknown error',
        status: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.700" />
      <ModalContent bg="#0f172a" border="1px solid rgba(249, 159, 42, 0.2)">
        <ModalHeader color="white" borderBottom="1px solid rgba(255, 255, 255, 0.05)">
          <Icon as={FiCalendar} mr={2} color="#F99F2A" />
          Schedule Content
        </ModalHeader>
        <ModalCloseButton color="gray.400" mt={1} />

        <ModalBody py={6}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">
                Title
              </FormLabel>
              <Input
                placeholder="Content Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                bg="rgba(0,0,0,0.2)"
                border="1px solid rgba(255,255,255,0.1)"
                color="white"
                _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">
                Target Keyword (Optional)
              </FormLabel>
              <Input
                placeholder="e.g. digital marketing tips"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                bg="rgba(0,0,0,0.2)"
                border="1px solid rgba(255,255,255,0.1)"
                color="white"
                _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">
                Content Type
              </FormLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                bg="rgba(0,0,0,0.2)"
                border="1px solid rgba(255,255,255,0.1)"
                color="white"
                _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
              >
                {CONTENT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value} style={{ background: '#0f172a' }}>
                    {ct.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid rgba(255, 255, 255, 0.05)">
          <Button variant="ghost" mr={3} onClick={onClose} color="gray.400">
            Cancel
          </Button>
          <Button
            bg="#F99F2A"
            color="white"
            _hover={{ bg: '#FFB859' }}
            leftIcon={<Icon as={FiPlus} />}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Create & Schedule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
