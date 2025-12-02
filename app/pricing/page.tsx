"use client";

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
  Stack,
  Text,
  useColorModeValue,
  Switch,
  Badge,
  SimpleGrid,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiZap, FiTarget, FiTrendingUp } from "react-icons/fi";

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular,
  icon,
  buttonText = "Get Started",
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
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const popularBorderColor = "blue.500";

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={isPopular ? popularBorderColor : borderColor}
      borderRadius="xl"
      p={8}
      position="relative"
      boxShadow={isPopular ? "xl" : "md"}
      transform={isPopular ? "scale(1.05)" : "none"}
      zIndex={isPopular ? 1 : 0}
      transition="all 0.3s"
      _hover={{ transform: isPopular ? "scale(1.05)" : "translateY(-5px)", boxShadow: "xl" }}
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
          bg={isPopular ? "blue.50" : "gray.50"}
          color={isPopular ? "blue.500" : "gray.500"}
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
          colorScheme={isPopular ? "blue" : "gray"}
          variant={isPopular ? "solid" : "outline"}
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
                color={feature.included ? "green.500" : "gray.300"}
              />
              <Text
                color={feature.included ? "inherit" : "gray.400"}
                textDecoration={feature.included ? "none" : "line-through"}
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

  const plans = [
    {
      title: "Starter",
      icon: FiTarget,
      price: isAnnual ? "$49" : "$59",
      description: "Perfect for solopreneurs and new websites.",
      features: [
        { text: "5 Projects (URLs)", included: true },
        { text: "100 Keyword Analysis / mo", included: true },
        { text: "2 AI Articles / mo", included: true },
        { text: "Basic SEO Audit", included: true },
        { text: "WordPress Integration", included: false },
        { text: "Competitor Analysis", included: false },
      ],
    },
    {
      title: "Growth",
      icon: FiTrendingUp,
      price: isAnnual ? "$149" : "$179",
      description: "For growing businesses scaling their content.",
      isPopular: true,
      features: [
        { text: "20 Projects (URLs)", included: true },
        { text: "500 Keyword Analysis / mo", included: true },
        { text: "8 AI Articles / mo (2/week)", included: true },
        { text: "Advanced SEO Audit", included: true },
        { text: "WordPress Integration", included: true },
        { text: "Competitor Analysis", included: true },
      ],
    },
    {
      title: "Scale",
      icon: FiZap,
      price: isAnnual ? "$399" : "$479",
      description: "Maximum power for agencies and content teams.",
      features: [
        { text: "Unlimited Projects", included: true },
        { text: "2,000 Keyword Analysis / mo", included: true },
        { text: "20 AI Articles / mo (Daily)", included: true },
        { text: "White-label Reports", included: true },
        { text: "All Integrations (WP, Shopify)", included: true },
        { text: "Priority Support", included: true },
      ],
    },
  ];

  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <VStack spacing={4} textAlign="center" mb={16}>
          <Heading size="2xl" fontWeight="bold">
            Simple, Transparent Pricing
          </Heading>
          <Text fontSize="xl" color="gray.500" maxW="2xl">
            Stop guessing with your SEO. Get data-driven insights and AI-generated content that actually ranks.
          </Text>

          <Flex align="center" mt={8}>
            <Text
              fontWeight={!isAnnual ? "bold" : "medium"}
              color={!isAnnual ? "gray.900" : "gray.500"}
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
              fontWeight={isAnnual ? "bold" : "medium"}
              color={isAnnual ? "gray.900" : "gray.500"}
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
  );
}
