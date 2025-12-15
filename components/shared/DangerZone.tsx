'use client';

/**
 * DangerZone Component
 *
 * Component Hierarchy:
 * App → Any Page → DangerZone (this file)
 *
 * Danger zone card wrapper with warning alert.
 */

import { ReactNode } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';

type Props = {
  children: ReactNode;
};

export function DangerZone({ children }: Props) {
  return (
    <Card borderColor="red.200" borderWidth={1}>
      <CardHeader pb={0}>
        <Heading size="md" color="red.600">
          Danger Zone
        </Heading>
      </CardHeader>
      <CardBody>
        <Alert status="warning" variant="left-accent" mb={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>Destructive Actions</AlertTitle>
            <AlertDescription>These actions cannot be easily undone.</AlertDescription>
          </Box>
        </Alert>
        <VStack spacing={3} align="stretch">
          {children}
        </VStack>
      </CardBody>
    </Card>
  );
}
