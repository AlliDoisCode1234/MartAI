'use client';

/**
 * UserHeaderCard Component
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] → UserHeaderCard (this file)
 *
 * Displays user avatar, name, badges, and metadata.
 */

import {
  Card,
  CardBody,
  HStack,
  VStack,
  Box,
  Avatar,
  Heading,
  Badge,
  Text,
} from '@chakra-ui/react';
import { format, formatDistanceToNow } from 'date-fns';
import { ROLE_COLORS, ACCOUNT_STATUS_COLORS } from '@/lib/constants/admin';

type Props = {
  user: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    accountStatus?: string;
    createdAt?: number;
    lastActiveAt?: number;
  };
};

export function UserHeaderCard({ user }: Props) {
  return (
    <Card>
      <CardBody>
        <HStack spacing={6} align="start">
          <Avatar size="xl" name={user.name} src={user.image} />
          <Box flex={1}>
            <HStack mb={2} flexWrap="wrap" gap={2}>
              <Heading size="lg">{user.name || 'Unnamed User'}</Heading>
              <Badge colorScheme={ROLE_COLORS[user.role || 'user']}>{user.role || 'user'}</Badge>
              <Badge colorScheme={ACCOUNT_STATUS_COLORS[user.accountStatus || 'active']}>
                {user.accountStatus || 'active'}
              </Badge>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              {user.email}
            </Text>
            <HStack mt={2} spacing={4}>
              <Text fontSize="sm" color="gray.500">
                Joined: {user.createdAt ? format(user.createdAt, 'MMMM d, yyyy') : 'N/A'}
              </Text>
              {user.lastActiveAt && (
                <Text fontSize="sm" color="gray.500">
                  Last active: {formatDistanceToNow(user.lastActiveAt, { addSuffix: true })}
                </Text>
              )}
            </HStack>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
}
