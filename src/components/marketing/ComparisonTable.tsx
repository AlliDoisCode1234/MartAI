'use client';

/**
 * ComparisonTable
 *
 * Component Hierarchy:
 * App -> ProductPage -> ComparisonTable
 *
 * Per LDD section 5.3: Feature comparison table
 * "Agency vs DIY vs Phoo" — the strongest sales objection killer.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiCheck, FiX, FiMinus } from 'react-icons/fi';

const MotionBox = motion(Box);

type CellValue = 'check' | 'x' | 'minus' | string;

interface ComparisonRow {
  feature: string;
  agency: CellValue;
  diy: CellValue;
  phoo: CellValue;
}

const COMPARISON_DATA: ComparisonRow[] = [
  { feature: 'Monthly Cost', agency: '$2,500+', diy: '$0 (your time)', phoo: 'From $164/mo' },
  { feature: 'Content Quality', agency: 'Varies', diy: 'Low', phoo: 'AI-Optimized' },
  { feature: 'Publishing Speed', agency: 'Weeks', diy: 'Days', phoo: 'Minutes' },
  { feature: 'SEO Optimization', agency: 'Manual', diy: 'Guesswork', phoo: 'Automated' },
  { feature: 'GEO (AI Citations)', agency: 'x', diy: 'x', phoo: 'check' },
  { feature: 'Real-Time Analytics', agency: 'Monthly Report', diy: 'x', phoo: 'check' },
  { feature: 'CMS Publishing', agency: 'Manual Upload', diy: 'Manual', phoo: 'check' },
  { feature: 'Keyword Intelligence', agency: 'Extra Cost', diy: 'Free Tools', phoo: 'check' },
  { feature: 'Content Calendar', agency: 'check', diy: 'Spreadsheet', phoo: 'check' },
  { feature: '24/7 Availability', agency: 'x', diy: 'check', phoo: 'check' },
];

function CellContent({ value }: { value: CellValue }) {
  if (value === 'check') {
    return (
      <Box as="span" role="img" aria-label="Included">
        <Icon as={FiCheck} boxSize={5} color="green.500" strokeWidth={3} aria-hidden="true" />
      </Box>
    );
  }
  if (value === 'x') {
    return (
      <Box as="span" role="img" aria-label="Not included">
        <Icon as={FiX} boxSize={5} color="red.400" strokeWidth={3} aria-hidden="true" />
      </Box>
    );
  }
  if (value === 'minus') {
    return (
      <Box as="span" role="img" aria-label="Partial">
        <Icon as={FiMinus} boxSize={5} color="gray.400" aria-hidden="true" />
      </Box>
    );
  }
  return (
    <Text fontSize="sm" color="gray.600">
      {value}
    </Text>
  );
}

export function ComparisonTable() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-80px' });

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="white" ref={ref}>
      <Container maxW="5xl">
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <VStack spacing={{ base: 4, md: 6 }} mb={{ base: 8, md: 12 }} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="extrabold"
              color="gray.800"
            >
              Phoo vs.{' '}
              <Text as="span" color="brand.orange">
                Traditional Marketing
              </Text>
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" maxW="600px">
              See how Phoo compares to hiring an agency or doing it yourself. Spoiler: you get more
              for less.
            </Text>
          </VStack>

          {/* Table with horizontal scroll on mobile */}
          <Box
            overflowX="auto"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.06)"
          >
            <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
              <Thead>
                <Tr bg="gray.50">
                  <Th
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={4}
                    borderColor="gray.200"
                  >
                    Feature
                  </Th>
                  <Th
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    py={4}
                    borderColor="gray.200"
                  >
                    Agency
                  </Th>
                  <Th
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    py={4}
                    borderColor="gray.200"
                  >
                    DIY
                  </Th>
                  <Th
                    fontSize={{ base: 'xs', md: 'sm' }}
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    py={4}
                    borderColor="gray.200"
                    color="brand.orange"
                    fontWeight="extrabold"
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      h="3px"
                      bgGradient="linear(to-r, brand.orange, brand.red)"
                      borderRadius="full"
                    />
                    Phoo
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {COMPARISON_DATA.map((row) => (
                  <Tr
                    key={row.feature}
                    _hover={{ bg: 'orange.50' }}
                    transition="background 0.2s ease"
                  >
                    <Td
                      borderColor="gray.100"
                      py={4}
                      fontWeight="medium"
                      color="gray.800"
                      fontSize={{ base: 'sm', md: 'md' }}
                    >
                      {row.feature}
                    </Td>
                    <Td borderColor="gray.100" textAlign="center" py={4}>
                      <CellContent value={row.agency} />
                    </Td>
                    <Td borderColor="gray.100" textAlign="center" py={4}>
                      <CellContent value={row.diy} />
                    </Td>
                    <Td borderColor="gray.100" textAlign="center" py={4} bg="orange.50">
                      <CellContent value={row.phoo} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
