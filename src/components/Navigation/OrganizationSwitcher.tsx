'use client';

import { type FC } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Text,
  HStack,
  Box,
  useToast,
} from '@chakra-ui/react';
import { FiBriefcase, FiCheck, FiChevronDown } from 'react-icons/fi';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import { Id } from '@/convex/_generated/dataModel';

export const OrganizationSwitcher: FC = () => {
  const { user } = useAuth();
  const organizations = useQuery(api.organizations.organizations.getMyOrganizations);
  const switchOrg = useMutation(api.users.switchOrganization);
  const toast = useToast();

  // If loading, or user only has 1 organization natively, don't show the switcher at all
  if (organizations === undefined || organizations.length <= 1 || !user) {
    return null;
  }

  const currentOrg = organizations.find((org: any) => org._id === user.organizationId);

  const handleSwitch = async (organizationId: string, orgName: string) => {
    try {
      await switchOrg({ organizationId: organizationId as Id<'organizations'> });
      toast({
        title: 'Workspace Switched',
        description: `You are now working in ${orgName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Optionally reload the page to flush any stale context or data if needed,
      // but convex subscriptions are reactive so it should update instantly.
    } catch (error: any) {
      toast({
        title: 'Failed to switch workspace',
        description: error.message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        variant="ghost"
        color="gray.600"
        rightIcon={<Icon as={FiChevronDown} />}
        leftIcon={<Icon as={FiBriefcase} />}
        _hover={{ color: 'brand.orange', bg: 'orange.50' }}
        display={{ base: 'none', md: 'flex' }}
        maxWidth="200px"
      >
        <Text noOfLines={1}>
          {currentOrg?.name || 'Select Workspace'}
        </Text>
      </MenuButton>
      <MenuList minW="240px">
        {organizations.map((org: any) => (
          <MenuItem
            key={org._id}
            onClick={() => handleSwitch(org._id, org.name)}
            justifyContent="space-between"
            _hover={{ bg: 'orange.50' }}
          >
            <HStack spacing={3}>
              <Icon
                as={FiBriefcase}
                color={org._id === user.organizationId ? 'brand.orange' : 'gray.400'}
              />
              <Box>
                <Text fontWeight={org._id === user.organizationId ? 'bold' : 'normal'}>
                  {org.name}
                </Text>
                <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                  {org.role}
                </Text>
              </Box>
            </HStack>
            {org._id === user.organizationId && <Icon as={FiCheck} color="brand.orange" />}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
