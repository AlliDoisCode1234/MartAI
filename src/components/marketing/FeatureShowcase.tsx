'use client';

/**
 * FeatureShowcase
 *
 * Component Hierarchy:
 * App -> MarketingPage -> FeatureShowcase
 *
 * Alternating left/right layout showcasing a product feature
 * with text on one side and a screenshot on the other.
 * Inspired by Instantly.ai's product explanation sections.
 */

import { type FC, type ReactNode } from 'react';
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { type IconType } from 'react-icons';

const MotionBox = motion(Box);

interface Props {
  /** Badge text above the heading */
  badge?: string;
  /** Badge icon */
  badgeIcon?: IconType;
  /** Section heading */
  heading: string;
  /** Highlighted portion of the heading (rendered in orange gradient) */
  headingHighlight?: string;
  /** Description paragraph */
  description: string;
  /** Bullet point features */
  features?: string[];
  /** Reverse layout — screenshot on left, text on right */
  reverse?: boolean;
  /** Background color for the section */
  bg?: string;
  /** The screenshot/visual element */
  children: ReactNode;
}

export const FeatureShowcase: FC<Props> = ({
  badge,
  badgeIcon,
  heading,
  headingHighlight,
  description,
  features,
  reverse = false,
  bg = 'white',
  children,
}) => {
  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg={bg}>
      <Container maxW="7xl">
        <Flex
          direction={{ base: 'column', lg: reverse ? 'row-reverse' : 'row' }}
          align="center"
          gap={{ base: 10, lg: 16 }}
        >
          {/* Text Side */}
          <VStack
            align={{ base: 'center', lg: 'flex-start' }}
            spacing={6}
            flex={1}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            {badge && (
              <MotionBox
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                // @ts-ignore
                transition={{ duration: 0.5 }}
              >
                <HStack
                  spacing={2}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="orange.50"
                  border="1px solid"
                  borderColor="orange.200"
                >
                  {badgeIcon && <Icon as={badgeIcon} boxSize={4} color="brand.orange" />}
                  <Text fontSize="sm" color="brand.orange" fontWeight="semibold">
                    {badge}
                  </Text>
                </HStack>
              </MotionBox>
            )}

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // @ts-ignore
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                fontWeight="bold"
                lineHeight="1.2"
                color="gray.800"
              >
                {heading}{' '}
                {headingHighlight && (
                  <Text as="span" bgGradient="linear(to-r, brand.orange, brand.red)" bgClip="text">
                    {headingHighlight}
                  </Text>
                )}
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // @ts-ignore
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Text fontSize="lg" color="gray.600" lineHeight="1.7" maxW="500px">
                {description}
              </Text>
            </MotionBox>

            {features && features.length > 0 && (
              <MotionBox
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                // @ts-ignore
                transition={{ duration: 0.5, delay: 0.3 }}
                w="full"
              >
                <List spacing={3}>
                  {features.map((feature) => (
                    <ListItem
                      key={feature}
                      display="flex"
                      alignItems="center"
                      fontSize="md"
                      color="gray.700"
                    >
                      <ListIcon as={FiCheck} color="green.500" boxSize={5} />
                      {feature}
                    </ListItem>
                  ))}
                </List>
              </MotionBox>
            )}
          </VStack>

          {/* Visual Side */}
          <MotionBox
            flex={1}
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            // @ts-ignore
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {children}
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
};
