'use client';

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { FiShield, FiTrash2, FiUserPlus, FiAlertTriangle } from 'react-icons/fi';
import { format } from 'date-fns';
import { Id } from '@/convex/_generated/dataModel';

export default function InternalStaffPage() {
  const me = useQuery(api.users.me);
  const staffArray = useQuery(
    api.admin.internalStaff.listStaff,
    me?.role === 'super_admin' ? {} : 'skip'
  );
  const promoteUser = useMutation(api.admin.internalStaff.promoteUser);
  const revokeAccess = useMutation(api.admin.internalStaff.revokeAccess);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [targetEmail, setTargetEmail] = useState('');
  const [targetRole, setTargetRole] = useState<'super_admin' | 'admin' | 'sales'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security check: Route level protection
  if (me === undefined) {
    return <Container mt={10}><Text>Loading security context...</Text></Container>;
  }

  if (me === null || me.role !== 'super_admin') {
    return (
      <Container maxW="container.md" mt={20}>
        <Alert status="error" variant="left-accent" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={10}>
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            God-Mode Protected Route
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            This route is strictly isolated for super_admin personnel. Your current authorization level ({me?.role || 'None'}) is insufficient.
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  if (staffArray === undefined) {
    return <Container mt={10}><Text>Loading staff roster...</Text></Container>;
  }

  const handlePromote = async () => {
    if (!targetEmail.trim()) {
      toast({ title: 'Exact email is required', status: 'warning', duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      await promoteUser({ email: targetEmail.trim(), role: targetRole });
      toast({
        title: 'User Promoted',
        description: `${targetEmail} has been granted internal ${targetRole} access.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTargetEmail('');
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Validation failed. Ensure exact email match.';
      toast({
        title: 'Promotion Failed',
        description: errorMessage,
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (adminId: Id<'internalAdmins'>, email: string) => {
    if (confirm(`CRITICAL DESTRUCTIVE ACTION\n\nAre you absolutely sure you want to REVOKE ALL SYSTEM ACCESS for ${email}?`)) {
      try {
        await revokeAccess({ adminId });
        toast({ title: 'Access Revoked', status: 'success' });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        toast({ title: 'Error', description: errorMessage, status: 'error' });
      }
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <HStack spacing={3}>
            <Icon as={FiShield} boxSize={6} color="red.500" />
            <Heading size="lg" color="red.600">Internal Staff Management</Heading>
          </HStack>
          <Text color="gray.600" mt={1}>
            Decoupled RBAC System. Manage God-mode access to the Phoo Admin infrastructure.
          </Text>
        </Box>
        <Button
          leftIcon={<FiUserPlus />}
          colorScheme="red"
          onClick={onOpen}
        >
          Elevate User
        </Button>
      </Flex>

      <Box bg="white" border="1px solid" borderColor="red.100" borderRadius="xl" overflow="hidden" boxShadow="sm">
        <Table variant="simple">
          <Thead bg="red.50">
            <Tr>
              <Th>Name / Email</Th>
              <Th>Internal Role</Th>
              <Th>Granted On</Th>
              <Th>Last Active</Th>
              <Th textAlign="right">Destructive Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {staffArray.map((staff: { _id: Id<'internalAdmins'>; name: string; email: string; role: string; createdAt: number; lastActiveAt?: number; userId?: Id<'users'> }) => (
              <Tr key={staff._id}>
                <Td>
                  <Text fontWeight="bold">{staff.name}</Text>
                  <Text fontSize="sm" color="gray.500">{staff.email}</Text>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={staff.role === 'super_admin' ? 'red' : staff.role === 'admin' ? 'purple' : 'blue'}
                  >
                    {staff.role.toUpperCase()}
                  </Badge>
                </Td>
                <Td>{format(staff.createdAt, 'MMM d, yyyy')}</Td>
                <Td>{staff.lastActiveAt ? format(staff.lastActiveAt, 'MMM d, yyyy') : 'Unknown'}</Td>
                <Td textAlign="right">
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    leftIcon={<FiTrash2 />}
                    onClick={() => handleRevoke(staff._id, staff.email)}
                    isDisabled={staff.userId === me?._id} // Prevent self-lockout via UI
                    title={staff.userId === me?._id ? "Cannot revoke your own access" : "Revoke Access"}
                  >
                    Revoke
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* High Friction Promotion Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
        <ModalContent borderTop="4px solid" borderColor="red.500">
          <ModalHeader color="red.600">
            <HStack>
              <Icon as={FiAlertTriangle} />
              <Text>Elevate to Internal System Access</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>High Friction Execution</AlertTitle>
                  <AlertDescription fontSize="sm">
                    You are granting a user God-mode access across all multi-tenant boundaries. You MUST enter the exact verified email address of an existing user profile to proceed.
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl isRequired>
                <FormLabel>Exact User Email</FormLabel>
                <Input 
                  placeholder="e.g., employee@phoo.ai" 
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  autoFocus
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Initial Internal Role</FormLabel>
                <Select value={targetRole} onChange={(e) => setTargetRole(e.target.value as 'super_admin' | 'admin' | 'sales')}>
                  <option value="admin">Admin (Standard Engineering/Support)</option>
                  <option value="sales">Sales (Read-Only Prospecting)</option>
                  <option value="super_admin">Super Admin (God-Mode + Staff Management)</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50">
            <Button onClick={onClose} mr={3} variant="ghost">Cancel</Button>
            <Button 
              colorScheme="red" 
              onClick={handlePromote}
              isLoading={isSubmitting}
              loadingText="Verifying..."
              leftIcon={<FiShield />}
            >
              Confirm Elevation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
