'use client';

/**
 * GeneratePlanModal Component
 *
 * Component Hierarchy:
 * App → Strategy → GeneratePlanModal (this file)
 *
 * Modal form for generating quarterly content plan.
 */

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { DEFAULT_PLAN_FORM } from '@/lib/constants/strategy';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (formData: typeof DEFAULT_PLAN_FORM) => Promise<void>;
  isLoading: boolean;
};

export function GeneratePlanModal({ isOpen, onClose, onGenerate, isLoading }: Props) {
  const [formData, setFormData] = useState(DEFAULT_PLAN_FORM);

  const handleGenerate = async () => {
    await onGenerate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Generate Quarterly Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Content Velocity (posts per week)</FormLabel>
              <NumberInput
                value={formData.contentVelocity}
                min={1}
                max={7}
                onChange={(_, val) => setFormData({ ...formData, contentVelocity: val })}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Traffic Goal (optional)</FormLabel>
              <Input
                type="number"
                placeholder="e.g., 10000"
                value={formData.trafficGoal}
                onChange={(e) => setFormData({ ...formData, trafficGoal: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Leads Goal (optional)</FormLabel>
              <Input
                type="number"
                placeholder="e.g., 100"
                value={formData.leadsGoal}
                onChange={(e) => setFormData({ ...formData, leadsGoal: e.target.value })}
              />
            </FormControl>
            <Alert status="info" fontSize="sm">
              <AlertIcon />
              This will generate a 12-week calendar with {formData.contentVelocity * 12} content
              briefs.
            </Alert>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button bg="brand.orange" color="white" onClick={handleGenerate} isLoading={isLoading}>
            Generate Plan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
