/**
 * PhooChatDrawer - Marketing chat drawer for guests
 *
 * Component Hierarchy:
 * App → Layout → PhooChatDrawer (this file)
 *
 * Slide-in drawer containing PhooChatWidget for marketing/FAQ mode.
 * Only shown to non-authenticated users.
 */

'use client';

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import PhooChatWidget from './PhooChatWidget';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhooChatDrawer({ isOpen, onClose }: Props) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <HStack spacing={2}>
            <FiMessageCircle />
            <Text>Chat with Phoo</Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          <PhooChatWidget isAuthenticated={false} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
