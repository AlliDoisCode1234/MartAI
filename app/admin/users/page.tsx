'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  Avatar,
  HStack,
  VStack,
  Button,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const users = useQuery(api.admin.getAllUsers);
  const resetOnboarding = useMutation(api.users.resetOnboarding);

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Users</Heading>
        <Text color="gray.600">Manage registered accounts and subscriptions.</Text>
      </Box>

      <Card>
        <CardBody>
          {!users ? (
            <Text color="gray.500">Loading users…</Text>
          ) : users.length === 0 ? (
            <Text color="gray.500">No users found.</Text>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Plan</Th>
                  <Th>Joined</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user: any) => (
                  <Tr key={user._id}>
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={user.name} src={user.image} />
                        <Box>
                          <Text fontWeight="semibold">{user.name || 'Unnamed'}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {user.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          user.role === 'super_admin'
                            ? 'purple'
                            : user.role === 'admin'
                              ? 'blue'
                              : 'gray'
                        }
                      >
                        {user.role || 'user'}
                      </Badge>
                    </Td>
                    <Td>
                      {user.subscription ? (
                        <Badge
                          colorScheme={user.subscription.status === 'active' ? 'green' : 'red'}
                        >
                          {user.subscription.planTier}
                        </Badge>
                      ) : (
                        <Text fontSize="sm" color="gray.400">
                          Free
                        </Text>
                      )}
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {format(user.createdAt, 'MMM d, yyyy')}
                      </Text>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Badge
                          colorScheme={user.onboardingStatus === 'completed' ? 'green' : 'yellow'}
                        >
                          {user.onboardingStatus || 'unknown'}
                        </Badge>
                        <Button
                          size="xs"
                          variant="outline"
                          colorScheme="red"
                          onClick={async () => {
                            if (confirm(`Reset onboarding for ${user.name}?`)) {
                              await resetOnboarding({ userId: user._id });
                            }
                          }}
                        >
                          Reset
                        </Button>
                      </VStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
