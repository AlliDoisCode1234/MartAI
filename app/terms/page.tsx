'use client';

/**
 * Terms of Service Page
 *
 * Component Hierarchy:
 * App → Terms of Service
 *
 * Comprehensive terms of service for Phoo.ai AI content platform.
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

export default function TermsOfServicePage() {
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
              Terms of Service
            </Heading>
            <Text color="gray.500">Last updated: {lastUpdated}</Text>
          </Box>

          <Divider borderColor="gray.700" />

          {/* Agreement */}
          <Section title="Agreement to Terms">
            <Text>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of Phoo.ai
              (&ldquo;Service&rdquo;), operated by Phoo.ai (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;). By accessing or using our Service, you agree to be bound by these
              Terms.
            </Text>
            <Text>
              If you do not agree to these Terms, you may not access or use the Service. We reserve
              the right to update these Terms at any time, and your continued use constitutes
              acceptance of any changes.
            </Text>
          </Section>

          {/* Description */}
          <Section title="Description of Service">
            <Text>
              Phoo.ai is an AI-powered content generation and SEO platform that helps businesses
              create, optimize, and publish content. Our Service includes:
            </Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>AI-powered content generation and writing assistance</ListItem>
              <ListItem>Keyword research and SEO strategy tools</ListItem>
              <ListItem>Content calendar and scheduling features</ListItem>
              <ListItem>
                Integration with third-party platforms (WordPress, Shopify, Wix, Google Analytics,
                etc.)
              </ListItem>
              <ListItem>Analytics and performance tracking</ListItem>
            </UnorderedList>
          </Section>

          {/* Accounts */}
          <Section title="User Accounts">
            <Text>
              To use certain features of our Service, you must create an account. You agree to:
            </Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Provide accurate and complete registration information</ListItem>
              <ListItem>Maintain the security of your account credentials</ListItem>
              <ListItem>Notify us immediately of any unauthorized use</ListItem>
              <ListItem>Accept responsibility for all activities under your account</ListItem>
            </UnorderedList>
            <Text mt={4}>
              You must be at least 13 years old to use our Service. If you are under 18, you
              represent that you have your parent or guardian&apos;s permission.
            </Text>
          </Section>

          {/* Subscription */}
          <Section title="Subscription and Billing">
            <Text>
              Some features of our Service require a paid subscription. By subscribing, you agree
              to:
            </Text>
            <UnorderedList pl={4} spacing={2}>
              <ListItem>
                <strong>Payment:</strong> Pay all applicable fees using your designated payment
                method
              </ListItem>
              <ListItem>
                <strong>Automatic Renewal:</strong> Subscriptions automatically renew unless
                cancelled before the renewal date
              </ListItem>
              <ListItem>
                <strong>Cancellation:</strong> You may cancel at any time through your account
                settings. Access continues until the end of the current billing period
              </ListItem>
              <ListItem>
                <strong>Refunds:</strong> Refunds are provided at our discretion. We do not offer
                refunds for partial months
              </ListItem>
              <ListItem>
                <strong>Price Changes:</strong> We may change pricing with 30 days&apos; notice
              </ListItem>
            </UnorderedList>
          </Section>

          {/* Acceptable Use */}
          <Section title="Acceptable Use">
            <Text>You agree NOT to use our Service to:</Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Violate any laws or regulations</ListItem>
              <ListItem>Infringe on intellectual property rights</ListItem>
              <ListItem>Generate misleading, defamatory, or harmful content</ListItem>
              <ListItem>Spread malware or engage in hacking activities</ListItem>
              <ListItem>Impersonate others or misrepresent your affiliation</ListItem>
              <ListItem>Attempt to reverse engineer or exploit our systems</ListItem>
              <ListItem>Abuse, harass, or threaten others</ListItem>
              <ListItem>Generate spam or unsolicited communications</ListItem>
              <ListItem>Create content that violates third-party platform terms</ListItem>
            </UnorderedList>
          </Section>

          {/* AI Content */}
          <Section title="AI-Generated Content">
            <Text>
              Our Service uses artificial intelligence to generate content. You understand and
              agree:
            </Text>
            <UnorderedList pl={4} spacing={2}>
              <ListItem>
                <strong>Review Required:</strong> You are responsible for reviewing, editing, and
                fact-checking all AI-generated content before publishing
              </ListItem>
              <ListItem>
                <strong>No Guarantees:</strong> We do not guarantee that AI-generated content is
                accurate, complete, or suitable for any purpose
              </ListItem>
              <ListItem>
                <strong>Ownership:</strong> Subject to these Terms, you own the content you generate
                using our Service
              </ListItem>
              <ListItem>
                <strong>Compliance:</strong> You are responsible for ensuring content complies with
                applicable laws and third-party platform policies
              </ListItem>
            </UnorderedList>
          </Section>

          {/* Intellectual Property */}
          <Section title="Intellectual Property">
            <SubSection title="Your Content">
              <Text>
                You retain ownership of the content you create using our Service. By using our
                Service, you grant us a limited license to host, display, and process your content
                as necessary to provide the Service.
              </Text>
            </SubSection>

            <SubSection title="Our Content">
              <Text>
                The Service, including its design, features, code, and branding, is owned by Phoo.ai
                and protected by intellectual property laws. You may not copy, modify, distribute,
                or create derivative works without our permission.
              </Text>
            </SubSection>
          </Section>

          {/* Third-Party Integrations */}
          <Section title="Third-Party Integrations">
            <Text>Our Service integrates with third-party platforms. You acknowledge:</Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Third-party services have their own terms and policies</ListItem>
              <ListItem>
                We are not responsible for third-party service availability or performance
              </ListItem>
              <ListItem>Your use of integrations may be subject to additional terms</ListItem>
              <ListItem>
                You authorize us to access your third-party accounts as needed to provide our
                Service
              </ListItem>
            </UnorderedList>
          </Section>

          {/* Disclaimers */}
          <Section title="Disclaimers">
            <Text fontWeight="semibold">
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            </Text>
            <Text>
              We do not warrant that the Service will be uninterrupted, error-free, or secure. We
              disclaim all warranties, including merchantability, fitness for a particular purpose,
              and non-infringement.
            </Text>
          </Section>

          {/* Limitation of Liability */}
          <Section title="Limitation of Liability">
            <Text>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PHOO.AI SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA
              LOSS, OR BUSINESS INTERRUPTION.
            </Text>
            <Text>
              Our total liability for any claims arising from your use of the Service shall not
              exceed the amount you paid us in the 12 months preceding the claim.
            </Text>
          </Section>

          {/* Indemnification */}
          <Section title="Indemnification">
            <Text>
              You agree to indemnify, defend, and hold harmless Phoo.ai and its officers, directors,
              employees, and agents from any claims, damages, losses, or expenses arising from:
            </Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Your use of the Service</ListItem>
              <ListItem>Your violation of these Terms</ListItem>
              <ListItem>Your violation of any third-party rights</ListItem>
              <ListItem>Content you create or publish using our Service</ListItem>
            </UnorderedList>
          </Section>

          {/* Termination */}
          <Section title="Termination">
            <Text>
              We may suspend or terminate your access to the Service at any time for any reason,
              including violation of these Terms. Upon termination:
            </Text>
            <UnorderedList pl={4} spacing={1}>
              <ListItem>Your right to use the Service ends immediately</ListItem>
              <ListItem>We may delete your account and data</ListItem>
              <ListItem>Provisions that should survive termination will remain in effect</ListItem>
            </UnorderedList>
          </Section>

          {/* Governing Law */}
          <Section title="Governing Law">
            <Text>
              These Terms are governed by the laws of the State of Delaware, United States, without
              regard to conflict of law principles. Any disputes shall be resolved in the courts of
              Delaware.
            </Text>
          </Section>

          {/* Changes */}
          <Section title="Changes to Terms">
            <Text>
              We may modify these Terms at any time. We will notify you of material changes via
              email or through the Service. Your continued use after changes constitutes acceptance.
            </Text>
          </Section>

          {/* Contact */}
          <Section title="Contact Us">
            <Text>If you have questions about these Terms, please contact us:</Text>
            <UnorderedList pl={4} spacing={1} mt={2}>
              <ListItem>
                Email:{' '}
                <ChakraLink href="mailto:legal@phoo.ai" color="#FF9D00">
                  legal@phoo.ai
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
