'use client';

/**
 * PremiumFooter
 *
 * Component Hierarchy:
 * App -> PremiumFooter
 *
 * Dark-themed multi-column footer for all marketing pages.
 * Replaces the inline footer in app/page.tsx.
 */

import { type FC } from 'react';
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaXTwitter, FaLinkedinIn, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa6';

interface FooterLink {
  label: string;
  href: string;
}

const PRODUCT_LINKS: FooterLink[] = [
  { label: 'Content Studio', href: '/features/content-studio' },
  { label: 'Keyword Intelligence', href: '/features/keyword-intelligence' },
  { label: 'Analytics Dashboard', href: '/features/analytics' },
  { label: 'CMS Publishing', href: '/features/publishing' },
  { label: 'GEO Optimization', href: '/features/geo-optimization' },
  { label: 'Content Calendar', href: '/features/content-calendar' },
];

const RESOURCE_LINKS: FooterLink[] = [
  { label: 'Blog & Guides', href: '/resources' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: 'Small Business', href: '/solutions/small-business' },
  { label: 'Marketing Teams', href: '/solutions/marketing-teams' },
  { label: 'Agencies', href: '/solutions/agencies' },
  { label: 'E-Commerce', href: '/solutions/ecommerce' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const SOCIAL_LINKS = [
  { icon: FaXTwitter, href: '#', label: 'X (Twitter)' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
];

const FooterColumn: FC<{ title: string; links: FooterLink[] }> = ({ title, links }) => (
  <VStack align="flex-start" spacing={3}>
    <Text
      fontSize="xs"
      fontWeight="bold"
      textTransform="uppercase"
      letterSpacing="0.08em"
      color="gray.400"
    >
      {title}
    </Text>
    {links.map((link) => (
      <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
        <Text
          fontSize="sm"
          color="rgba(255, 255, 255, 0.6)"
          _hover={{ color: 'brand.orange' }}
          transition="color 0.2s ease"
          cursor="pointer"
        >
          {link.label}
        </Text>
      </Link>
    ))}
  </VStack>
);

export const PremiumFooter: FC = () => {
  return (
    <Box as="footer" bg="#0a0a0a" color="white" pt={{ base: 12, md: 16 }} pb={8}>
      <Container maxW="7xl">
        {/* ── Main Grid ──────────────────────────────────────── */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          gap={{ base: 10, md: 8 }}
          mb={{ base: 10, md: 14 }}
        >
          {/* Brand Column */}
          <VStack align="flex-start" spacing={4} maxW="280px">
            <Text fontSize="2xl" fontWeight="bold" color="brand.orange">
              Phoo
            </Text>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)" lineHeight="1.7">
              AI-powered SEO and lead generation for small businesses. Replace your agency, not your
              ambition.
            </Text>
          </VStack>

          {/* Link Columns */}
          <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={{ base: 8, md: 12 }}>
            <FooterColumn title="Product" links={PRODUCT_LINKS} />
            <FooterColumn title="Resources" links={RESOURCE_LINKS} />
            <FooterColumn title="Solutions" links={COMPANY_LINKS} />
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
          </SimpleGrid>
        </Flex>

        <Divider borderColor="rgba(255, 255, 255, 0.1)" mb={8} />

        {/* ── Bottom Row ──────────────────────────────────────── */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          {/* Copyright */}
          <Text fontSize="xs" color="rgba(255, 255, 255, 0.4)">
            &copy; {new Date().getFullYear()} Phoo AI. All rights reserved.
          </Text>

          {/* Social Icons */}
          <HStack spacing={6}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <Icon
                  as={social.icon}
                  boxSize={5}
                  color="rgba(255, 255, 255, 0.5)"
                  _hover={{ color: 'brand.orange' }}
                  transition="color 0.2s ease"
                  cursor="pointer"
                />
              </a>
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
