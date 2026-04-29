'use client';

/**
 * ScheduleModal (formerly QuickCreateModal)
 *
 * Component Hierarchy:
 * App → StudioLayout → CalendarPage → QuickCreateModal (this file)
 *
 * Modal dialog to select a publish date and time from the calendar.
 * Routes the user to the Create page with the scheduledDate param.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  VStack,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Id } from '@/convex/_generated/dataModel';

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
  const router = useRouter();
  const toast = useToast();
  
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('09:00');

  useEffect(() => {
    if (isOpen) {
      const d = selectedDate ? new Date(selectedDate) : new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setDateStr(`${year}-${month}-${day}`);
      setTimeStr('09:00');
    }
  }, [isOpen, selectedDate]);

  const handleSubmit = () => {
    if (!dateStr || !timeStr) {
      toast({
        title: 'Missing information',
        description: 'Please select a date and time.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      
      const scheduledTimestamp = Date.UTC(year, month - 1, day, hour, minute);

      if (scheduledTimestamp <= Date.now()) {
        toast({
          title: 'Invalid Date',
          description: 'Please select a future date and time.',
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      onClose();
      router.push(`/studio/create?scheduledDate=${scheduledTimestamp}`);
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Invalid date or time format.',
        status: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.700" />
      <ModalContent bg="white" border="1px solid" borderColor="gray.200">
        <ModalHeader color="gray.800" borderBottom="1px solid" borderColor="gray.100">
          <Icon as={FiCalendar} mr={2} color="#F99F2A" />
          Select Publish Date
        </ModalHeader>
        <ModalCloseButton color="gray.400" mt={1} />

        <ModalBody py={6}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="gray.600" fontSize="sm">
                Date
              </FormLabel>
              <Input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                color="gray.800"
                _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600" fontSize="sm">
                Time
              </FormLabel>
              <Input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                color="gray.800"
                _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.100">
          <Button variant="ghost" mr={3} onClick={onClose} color="gray.500">
            Cancel
          </Button>
          <Button
            bg="#F99F2A"
            color="white"
            _hover={{ bg: '#FFB859' }}
            rightIcon={<Icon as={FiArrowRight} />}
            onClick={handleSubmit}
          >
            Continue to Studio
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

