'use client';

/**
 * ProjectsTableCard Component
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] → ProjectsTableCard (this file)
 *
 * Displays user's projects in a table format.
 */

import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import Link from 'next/link';

type Project = {
  _id: string;
  name?: string;
  websiteUrl?: string;
  createdAt?: number;
};

type Props = {
  projects: Project[] | undefined;
};

export function ProjectsTableCard({ projects }: Props) {
  return (
    <Card>
      <CardHeader pb={0}>
        <Heading size="md">Projects</Heading>
      </CardHeader>
      <CardBody>
        {!projects ? (
          <Text color="gray.500">Loading...</Text>
        ) : projects.length === 0 ? (
          <Text color="gray.500">No projects yet.</Text>
        ) : (
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Website</Th>
                <Th>Created</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {projects.map((p) => (
                <Tr key={p._id}>
                  <Td fontWeight="medium">{p.name}</Td>
                  <Td fontSize="sm" color="gray.600">
                    {p.websiteUrl ? new URL(p.websiteUrl).hostname : '—'}
                  </Td>
                  <Td fontSize="sm" color="gray.500">
                    {p.createdAt ? format(p.createdAt, 'MMM d, yyyy') : '—'}
                  </Td>
                  <Td>
                    <IconButton
                      as={Link}
                      href={`/projects/${p._id}`}
                      aria-label="View"
                      icon={<ExternalLinkIcon />}
                      size="xs"
                      variant="ghost"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
