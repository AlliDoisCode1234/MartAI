'use client';

/**
 * Privacy Policy Page
 *
 * Component Hierarchy:
 * App → Privacy Policy
 *
 * Comprehensive privacy policy for Phoo.ai AI content platform.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 13, 2026';

  return (
    <Box bg="#0A0A0A" minH="100vh" py={16}>
      <Container maxW="4xl">
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <Box>
            <Link href="/">
              <Text color="#FF9D00" fontWeight="bold" fontSize="lg" mb={4}>
                Phoo.ai
              </Text>
            </Link>
            <Heading as="h1" size="2xl" color="white" mb={2}>
              Privacy Policy
            </Heading>
            <Text color="gray.500">Last updated: {lastUpdated}</Text>
          </Box>

          <Divider borderColor="gray.700" />

          {/* Introduction */}
          <Section title="Introduction">
            <Text>
              Phoo.ai (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our AI-powered content generation and SEO
              platform (&ldquo;Service&rdquo;).
            </Text>
            <Text>
              By using Phoo.ai, you consent to the data practices described in this policy. If you
              do not agree with this policy, please do not use our Service.
            </Text>
          </Section>

          {/* Information We Collect */}
          <Section title="Information We Collect">
            <SubSection title="Account Information">
              <Text>When you create an account, we collect:</Text>
              <UnorderedList pl={4} spacing={1}>
                <ListItem>Email address</ListItem>
                <ListItem>Name (optional)</ListItem>
                <ListItem>Profile picture (if using Google Sign-In)</ListItem>
                <ListItem>Organization/team information</ListItem>
              </UnorderedList>
            </SubSection>

            <SubSection title="Content and Usage Data">
              <Text>When you use our Service, we collect:</Text>
              <UnorderedList pl={4} spacing={1}>
                <ListItem>Content you create, edit, or generate using our AI tools</ListItem>
                <ListItem>Keywords, topics, and SEO strategy data</ListItem>
                <ListItem>Project and website information you provide</ListItem>
                <ListItem>Usage patterns and feature interactions</ListItem>
              </UnorderedList>
            </SubSection>

            <SubSection title="Third-Party Integration Data">
              <Text>When you connect integrations, we may access:</Text>
              <UnorderedList pl={4} spacing={1}>
                <ListItem>
                  <strong>Google Analytics / Search Console:</strong> Website traffic, search
                  performance, and keyword data
                </ListItem>
                <ListItem>
                  <strong>WordPress/Shopify/Wix:</strong> Blog post publishing credentials and site
                  information
                </ListItem>
                <ListItem>
                  <strong>OAuth Providers:</strong> Basic profile information for authentication
                </ListItem>
              </UnorderedList>
            </SubSection>

            <SubSection title="Automatically Collected Information">
              <Text>We automatically collect:</Text>
              <UnorderedList pl={4} spacing={1}>
                <ListItem>IP address and device information</ListItem>
                <ListItem>Browser type and operating system</ListItem>
                <ListItem>Pages visited and features used</ListItem>
                <ListItem>Cookies and similar tracking technologies</ListItem>
              </UnorderedList>
            </SubSection>
          </Section>

          {/* How We Use Your Information */}
          <Section title="How We Use Your Information">
            <Text>We use your information to:</Text>
            <UnorderedList pl={4} spacing={2}>
              <ListItem>Provide, maintain, and improve our Service</ListItem>
              <ListItem>Generate AI-powered content based on your inputs</ListItem>
              <ListItem>Analyze your website data to provide SEO insights</ListItem>
              <ListItem>Publish content to your connected platforms</ListItem>
              <ListItem>Send transactional emails and service updates</ListItem>
              <ListItem>Provide customer support</ListItem>
              <ListItem>Detect and prevent fraud or abuse</ListItem>
              <ListItem>Comply with legal obligations</ListItem>
            </UnorderedList>
          </Section>

          {/* AI and Machine Learning */}
          <Section title="AI and Machine Learning">
            <Text>
              Phoo.ai uses artificial intelligence to generate content. Here&apos;s how we handle
              AI-related data:
            </Text>
            <UnorderedList pl={4} spacing={2}>
              <ListItem>
                <strong>Content Generation:</strong> Your inputs (keywords, topics, briefs) are
                processed by AI models to generate content. We do not use your generated content to
                train our AI models without explicit consent.
              </ListItem>
              <ListItem>
                <strong>Third-Party AI Providers:</strong> We use services like OpenAI and Google to
                power our AI features. These providers have their own privacy policies and data
                handling practices.
              </ListItem>
              <ListItem>
                <strong>Data Retention:</strong> AI-generated content is stored in your account
                until you delete it or close your account.
              </ListItem>
            </UnorderedList>
          </Section>

          {/* Data Sharing */}
          <Section title="Data Sharing and Disclosure">
            <Text>We may share your information with:</Text>
            <UnorderedList pl={4} spacing={2}>
              <ListItem>
                <strong>Service Providers:</strong> Companies that help us operate our Service
                (hosting, analytics, payment processing)
              </ListItem>
              <ListItem>
                <strong>Connected Platforms:</strong> When you publish content to WordPress,
                Shopify, Wix, or other integrations
              </ListItem>
              <ListItem>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </ListItem>
              <ListItem>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                sale of assets
              </ListItem>
            </UnorderedList>
            <Text fontWeight="semibold" mt={4}>
              We do not sell your personal information to third parties.
            </Text>
          </Section>

          {/* Data Security */}
          <Section title="Data Security">
            <Text>We implement industry-standard security measures to protect your data:</Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Encryption in transit (TLS/HTTPS) and at rest</ListItem>
              <ListItem>Secure credential storage for integrations</ListItem>
              <ListItem>Regular security audits and monitoring</ListItem>
              <ListItem>Access controls and authentication</ListItem>
            </UnorderedList>
          </Section>

          {/* Your Rights */}
          <Section title="Your Rights">
            <Text>Depending on your location, you may have the right to:</Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Access your personal data</ListItem>
              <ListItem>Correct inaccurate data</ListItem>
              <ListItem>Delete your data</ListItem>
              <ListItem>Export your data (data portability)</ListItem>
              <ListItem>Opt out of certain data processing</ListItem>
              <ListItem>Withdraw consent</ListItem>
            </UnorderedList>
            <Text mt={4}>
              To exercise these rights, contact us at{' '}
              <ChakraLink href="mailto:privacy@phoo.ai" color="#FF9D00">
                privacy@phoo.ai
              </ChakraLink>
            </Text>
          </Section>

          {/* Cookies */}
          <Section title="Cookies and Tracking">
            <Text>We use cookies and similar technologies to:</Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Keep you logged in</ListItem>
              <ListItem>Remember your preferences</ListItem>
              <ListItem>Analyze usage patterns</ListItem>
              <ListItem>Improve our Service</ListItem>
            </UnorderedList>
            <Text mt={4}>
              You can control cookies through your browser settings. Disabling cookies may limit
              some features.
            </Text>
          </Section>

          {/* Data Retention */}
          <Section title="Data Retention">
            <Text>
              We retain your data for as long as your account is active or as needed to provide our
              Service. You can delete your account at any time, which will remove your personal data
              within 30 days (except where retention is required by law).
            </Text>
          </Section>

          {/* Children */}
          <Section title="Children's Privacy">
            <Text>
              Our Service is not intended for users under 13 years of age. We do not knowingly
              collect information from children under 13.
            </Text>
          </Section>

          {/* International */}
          <Section title="International Data Transfers">
            <Text>
              Your data may be transferred to and processed in countries other than your own. We
              ensure appropriate safeguards are in place for international transfers.
            </Text>
          </Section>

          {/* Changes */}
          <Section title="Changes to This Policy">
            <Text>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by email or through our Service. Your continued use after changes constitutes
              acceptance of the updated policy.
            </Text>
          </Section>

          {/* Contact */}
          <Section title="Contact Us">
            <Text>If you have questions about this Privacy Policy, please contact us:</Text>
            <UnorderedList pl={4} spacing={1} mt={2}>
              <ListItem>
                Email:{' '}
                <ChakraLink href="mailto:privacy@phoo.ai" color="#FF9D00">
                  privacy@phoo.ai
                </ChakraLink>
              </ListItem>
              <ListItem>
                Website:{' '}
                <ChakraLink href="https://phoo.ai" color="#FF9D00">
                  phoo.ai
                </ChakraLink>
              </ListItem>
            </UnorderedList>
          </Section>

          <Divider borderColor="gray.700" />

          {/* Footer */}
          <Box textAlign="center" py={4}>
            <Link href="/">
              <Text color="gray.500" _hover={{ color: '#FF9D00' }}>
                ← Back to Phoo.ai
              </Text>
            </Link>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Heading as="h2" size="lg" color="white" mb={4}>
        {title}
      </Heading>
      <VStack align="stretch" spacing={4} color="gray.300" fontSize="md" lineHeight="1.8">
        {children}
      </VStack>
    </Box>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Heading as="h3" size="md" color="gray.100" mb={2}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}
