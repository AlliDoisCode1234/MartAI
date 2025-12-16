'use client';

/**
 * ScheduleModal Component
 *
 * Component Hierarchy:
 * App → Publish → ScheduleModal (this file)
 *
 * Modal for scheduling post publication.
 */

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
  Select,
  Button,
} from '@chakra-ui/react';
import { formatDate, getCurrentDate } from '@/lib/dateUtils';

type ScheduleForm = {
  publishDate: string;
  publishTime: string;
  timezone: string;
  platform: string;
  tags: string;
  categories: string;
  slug: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  form: ScheduleForm;
  onFormChange: (form: ScheduleForm) => void;
  onSchedule: () => void;
  scheduling: boolean;
};

export function ScheduleModal({
  isOpen,
  onClose,
  form,
  onFormChange,
  onSchedule,
  scheduling,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Publish</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Publish Date</FormLabel>
              <Input
                type="date"
                value={form.publishDate}
                onChange={(e) => onFormChange({ ...form, publishDate: e.target.value })}
                min={formatDate(getCurrentDate(), 'yyyy-MM-dd')}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Publish Time</FormLabel>
              <Input
                type="time"
                value={form.publishTime}
                onChange={(e) => onFormChange({ ...form, publishTime: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Timezone</FormLabel>
              <Select
                value={form.timezone}
                onChange={(e) => onFormChange({ ...form, timezone: e.target.value })}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Platform</FormLabel>
              <Select
                value={form.platform}
                onChange={(e) => onFormChange({ ...form, platform: e.target.value })}
              >
                <option value="wordpress">WordPress</option>
                <option value="shopify">Shopify</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Slug (optional)</FormLabel>
              <Input
                value={form.slug}
                onChange={(e) => onFormChange({ ...form, slug: e.target.value })}
                placeholder="post-url-slug"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <Input
                value={form.tags}
                onChange={(e) => onFormChange({ ...form, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Categories (comma-separated)</FormLabel>
              <Input
                value={form.categories}
                onChange={(e) => onFormChange({ ...form, categories: e.target.value })}
                placeholder="category1, category2"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button bg="brand.orange" color="white" onClick={onSchedule} isLoading={scheduling}>
            Schedule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
