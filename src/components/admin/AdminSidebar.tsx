"use client";

import {
  Box,
  VStack,
  Text,
  Link,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiActivity, FiSettings } from "react-icons/fi";

const NAV_ITEMS = [
  { name: "Dashboard", icon: FiHome, path: "/admin" },
  { name: "Prospects", icon: FiUsers, path: "/admin/prospects" },
  { name: "Users", icon: FiUsers, path: "/admin/users" },
  { name: "Keywords", icon: FiActivity, path: "/admin/keywords" },
  { name: "Analysis", icon: FiActivity, path: "/admin/analysis" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      w="250px"
      h="calc(100vh - 64px)"
      pos="fixed"
      left="0"
      top="64px"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      overflowY="auto"
    >
      <VStack align="stretch" spacing={8}>
        <Box px={4}>
          <Text fontSize="xl" fontWeight="bold" color="purple.600">
            MartAI Admin
          </Text>
          <Text fontSize="xs" color="gray.500">
            CRM & Intelligence
          </Text>
        </Box>

        <VStack align="stretch" spacing={2}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                as={NextLink}
                href={item.path}
                _hover={{ textDecoration: "none" }}
              >
                <Flex
                  align="center"
                  p={3}
                  borderRadius="md"
                  bg={isActive ? "purple.50" : "transparent"}
                  color={isActive ? "purple.600" : "gray.600"}
                  _hover={{ bg: "purple.50", color: "purple.600" }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} mr={3} boxSize={5} />
                  <Text fontWeight={isActive ? "semibold" : "medium"}>
                    {item.name}
                  </Text>
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
}
