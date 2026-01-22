'use client';

/**
 * Pricing Page
 *
 * Component Hierarchy:
 * App → PricingPage (this file)
 *
 * GEO-optimized pricing page with FAQ schema for Google AI Overviews.
 * Highlights the SEO + GEO value proposition.
 */

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  List,
  ListItem,
  ListIcon,
  Text,
  useColorModeValue,
  Switch,
  Badge,
  SimpleGrid,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiZap, FiTarget, FiTrendingUp, FiCpu } from 'react-icons/fi';
import { getFaqSchema, PRICING_FAQ_ITEMS, schemaToJsonLd } from '@/src/lib/schemas';

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular,
  icon,
  buttonText = 'Get Started',
  onButtonClick,
}: {
  title: string;
  price: string;
  description: string;
  features: { text: string; included: boolean }[];
  isPopular?: boolean;
  icon: any;
  buttonText?: string;
  onButtonClick?: () => void;
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const popularBorderColor = 'blue.500';

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={isPopular ? popularBorderColor : borderColor}
      borderRadius="xl"
      p={8}
      position="relative"
      boxShadow={isPopular ? 'xl' : 'md'}
      transform={isPopular ? 'scale(1.05)' : 'none'}
      zIndex={isPopular ? 1 : 0}
      transition="all 0.3s"
      _hover={{ transform: isPopular ? 'scale(1.05)' : 'translateY(-5px)', boxShadow: 'xl' }}
    >
      {isPopular && (
        <Badge
          position="absolute"
          top="-3"
          right="50%"
          transform="translateX(50%)"
          colorScheme="blue"
          variant="solid"
          rounded="full"
          px={4}
          py={1}
          textTransform="uppercase"
          fontSize="xs"
          letterSpacing="wide"
        >
          Most Popular
        </Badge>
      )}

      <VStack spacing={4} align="start">
        <Box
          p={3}
          bg={isPopular ? 'blue.50' : 'gray.50'}
          color={isPopular ? 'blue.500' : 'gray.500'}
          rounded="lg"
        >
          <Icon as={icon} boxSize={6} />
        </Box>
        <VStack align="start" spacing={1}>
          <Heading size="md">{title}</Heading>
          <Text color="gray.500" fontSize="sm">
            {description}
          </Text>
        </VStack>

        <HStack align="baseline" spacing={1}>
          <Heading size="2xl">{price}</Heading>
          <Text color="gray.500">/mo</Text>
        </HStack>

        <Button
          w="full"
          colorScheme={isPopular ? 'blue' : 'gray'}
          variant={isPopular ? 'solid' : 'outline'}
          size="lg"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>

        <List spacing={3} w="full" pt={4}>
          {features.map((feature, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon
                as={feature.included ? FaCheck : FaTimes}
                color={feature.included ? 'green.500' : 'gray.300'}
              />
              <Text
                color={feature.included ? 'inherit' : 'gray.400'}
                textDecoration={feature.included ? 'none' : 'line-through'}
                fontSize="sm"
              >
                {feature.text}
              </Text>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
};

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  // Generate FAQ schema for Google AI Overviews
  const faqSchema = getFaqSchema(PRICING_FAQ_ITEMS);

  const plans = [
    {
      title: 'Solo',
      icon: FiTarget,
      price: isAnnual ? '$49' : '$59',
      description: 'Perfect for solopreneurs and freelancers.',
      features: [
        { text: '1 Project (URL)', included: true },
        { text: '250 Keyword Analysis / mo', included: true },
        { text: '4 AI Articles / mo', included: true },
        { text: 'Basic SEO Audit', included: true },
        { text: 'WordPress Integration', included: true },
        { text: 'Team Members', included: false },
      ],
    },
    {
      title: 'Growth',
      icon: FiTrendingUp,
      price: isAnnual ? '$119' : '$149',
      description: 'For growing businesses scaling their content.',
      isPopular: true,
      features: [
        { text: '3 Projects (URLs)', included: true },
        { text: '1,000 Keyword Analysis / mo', included: true },
        { text: '12 AI Articles / mo', included: true },
        { text: 'Advanced SEO Audit', included: true },
        { text: 'WordPress Integration', included: true },
        { text: '3 Team Members', included: true },
      ],
    },
    {
      title: 'Team',
      icon: FiZap,
      price: isAnnual ? '$239' : '$299',
      description: 'For marketing teams and small agencies.',
      features: [
        { text: '10 Projects (URLs)', included: true },
        { text: '2,500 Keyword Analysis / mo', included: true },
        { text: '30 AI Articles / mo', included: true },
        { text: 'White-label Reports', included: true },
        { text: 'All Integrations', included: true },
        { text: '10 Team Members', included: true },
      ],
    },
  ];

  return (
    <>
      {/* FAQ Schema for Google AI Overviews */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(faqSchema) }}
      />

      <Box bg="#0A0A0A" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center" mb={16}>
            <HStack justify="center" mb={2}>
              <Badge
                bg="rgba(255, 157, 0, 0.1)"
                color="brand.orange"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                <HStack spacing={1}>
                  <Icon as={FiCpu} boxSize={3} />
                  <Text>SEO + GEO Included</Text>
                </HStack>
              </Badge>
            </HStack>
            <Heading size="2xl" fontWeight="bold" color="white">
              SEO + AI Content for $149/mo
            </Heading>
            <Text fontSize="xl" color="gray.400" maxW="2xl">
              Competitors charge $600+/mo for SEO tools alone. Phoo gives you keyword research, AI
              content generation, AND GEO optimization—so you rank in search results AND get cited
              by Google&apos;s AI.
            </Text>
            <Text fontSize="md" color="brand.orange" fontWeight="semibold">
              Join 1,200+ businesses growing their organic traffic with Phoo
            </Text>

            <Flex align="center" mt={8}>
              <Text
                fontWeight={!isAnnual ? 'bold' : 'medium'}
                color={!isAnnual ? 'gray.900' : 'gray.500'}
                mr={3}
              >
                Monthly
              </Text>
              <Switch
                size="lg"
                isChecked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
                colorScheme="blue"
              />
              <Text
                fontWeight={isAnnual ? 'bold' : 'medium'}
                color={isAnnual ? 'gray.900' : 'gray.500'}
                ml={3}
              >
                Annual
              </Text>
              <Badge ml={2} colorScheme="green" variant="solid" rounded="full">
                Save 20%
              </Badge>
            </Flex>
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={10} alignItems="center">
            {plans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </SimpleGrid>

          <Box mt={20} bg={useColorModeValue('gray.50', 'gray.900')} p={10} borderRadius="xl">
            <Heading size="lg" mb={8} textAlign="center">
              Frequently Asked Questions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Box>
                <Heading size="sm" mb={2}>
                  How do keyword limits work?
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Each plan includes monthly keyword analysis credits. For example, Growth gives you
                  500 keyword analyses per month—enough to research 5-10 content clusters. Unused
                  credits don't roll over.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2}>
                  What counts as an "AI Article"?
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Each AI article is a 1,500-2,500 word SEO-optimized blog post, complete with meta
                  tags, headings, and internal linking suggestions. You can regenerate or edit
                  before publishing.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2}>
                  Can I upgrade or downgrade anytime?
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Yes! Upgrade instantly to unlock more features. Downgrades take effect at the end
                  of your billing cycle. Annual plans can be upgraded mid-term with prorated
                  pricing.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2}>
                  Do you offer refunds?
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  We offer a 14-day money-back guarantee on all plans. If you're not satisfied,
                  email us within 14 days of your first payment for a full refund—no questions
                  asked.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          <Box mt={20} textAlign="center">
            <Heading size="lg" mb={4}>
              Need a custom solution?
            </Heading>
            <Text color="gray.500" mb={8}>
              We offer custom plans for large agencies and enterprise teams with high-volume needs.
            </Text>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
