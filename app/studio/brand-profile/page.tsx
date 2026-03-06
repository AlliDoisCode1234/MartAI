'use client';

/**
 * Brand Profile Page - Content Preferences
 *
 * Component Hierarchy:
 * App → StudioLayout → BrandProfilePage
 *
 * Configure content preferences, brand voice, and publishing defaults.
 */

import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Divider,
  Switch,
  Select,
  Input,
  Button,
  Badge,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { StudioLayout } from '@/src/components/studio';
import { FiTarget, FiEdit3, FiGlobe, FiLink, FiBell, FiSave, FiHelpCircle } from 'react-icons/fi';
import { BRAND } from '@/lib/constants/brand';

const MotionCard = motion(Card);

// Glass card styles
const glassCard = {
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'gray.200',
  borderRadius: '2xl',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
};

// Form input styles
const inputStyles = {
  bg: 'white',
  borderColor: 'gray.200',
  color: 'gray.800',
  borderRadius: 'lg',
  _placeholder: { color: 'gray.400' },
  _hover: { borderColor: 'gray.300' },
  _focus: {
    borderColor: 'orange.400',
    boxShadow: '0 0 0 1px var(--chakra-colors-orange-400), 0 0 8px rgba(255, 157, 0, 0.15)',
  },
};

interface SettingSectionProps {
  icon: typeof FiTarget;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}

function SettingSection({ icon, title, description, children, delay = 0 }: SettingSectionProps) {
  return (
    <MotionCard
      {...glassCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <CardBody>
        <HStack mb={4}>
          <Box p={2} borderRadius="lg" bg="rgba(255, 157, 0, 0.15)">
            <Icon as={icon} color="orange.400" boxSize={5} />
          </Box>
          <Box>
            <Heading size="md" color="gray.800">
              {title}
            </Heading>
            <Text color="gray.400" fontSize="sm">
              {description}
            </Text>
          </Box>
        </HStack>
        <Divider borderColor="gray.200" mb={4} />
        {children}
      </CardBody>
    </MotionCard>
  );
}

export default function BrandProfilePage() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Brand Voice
    brandName: '',
    brandVoice: 'professional',
    targetAudience: '',
    toneKeywords: '',

    // Content Defaults
    defaultWordCount: '1500',
    includeImages: true,
    includeFaq: true,
    includeSchema: true,
    contentFormat: 'blog',

    // Publishing
    autoPublish: false,
    reviewRequired: true,
    defaultCta: '',

    // Notifications
    emailOnPublish: true,
    emailOnDraft: false,
    weeklyDigest: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated.',
      status: 'success',
      duration: 3000,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <StudioLayout>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <Box>
            <HStack mb={2}>
              <Icon as={FiTarget} color="orange.400" boxSize={6} />
              <Heading size="lg" color="gray.800">
                Brand Profile & Defaults
              </Heading>
            </HStack>
            <Text color="gray.400">Configure your brand voice and AI content defaults</Text>
          </Box>
          <Button
            bg="linear-gradient(135deg, #FF9D00 0%, #FF6B00 100%)"
            color="white"
            leftIcon={<FiSave />}
            onClick={handleSave}
            isLoading={saving}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          >
            Save Changes
          </Button>
        </HStack>

        <Tabs variant="soft-rounded" colorScheme="orange">
          <TabList mb={6} bg="gray.100" p={2} borderRadius="xl">
            <Tab color="gray.500" _selected={{ color: 'gray.800', bg: 'white', boxShadow: 'sm' }}>
              Brand Voice
            </Tab>
            <Tab color="gray.500" _selected={{ color: 'gray.800', bg: 'white', boxShadow: 'sm' }}>
              Content Defaults
            </Tab>
            <Tab color="gray.500" _selected={{ color: 'gray.800', bg: 'white', boxShadow: 'sm' }}>
              Publishing
            </Tab>
            <Tab color="gray.500" _selected={{ color: 'gray.800', bg: 'white', boxShadow: 'sm' }}>
              Notifications
            </Tab>
            <Tab color="gray.500" _selected={{ color: 'gray.800', bg: 'white', boxShadow: 'sm' }}>
              Support
            </Tab>
          </TabList>

          <TabPanels>
            {/* Brand Voice Tab */}
            <TabPanel p={0}>
              <VStack spacing={6} align="stretch">
                <SettingSection
                  icon={FiEdit3}
                  title="Brand Identity"
                  description="Define your brand voice and tone"
                  delay={0.1}
                >
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel color="gray.600">Brand Name</FormLabel>
                      <Input
                        {...inputStyles}
                        placeholder="Your company name"
                        value={settings.brandName}
                        onChange={(e) => updateSetting('brandName', e.target.value)}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.600">Brand Voice</FormLabel>
                      <Select
                        {...inputStyles}
                        value={settings.brandVoice}
                        onChange={(e) => updateSetting('brandVoice', e.target.value)}
                      >
                        <option value="professional" style={{ background: '#FFFFFF' }}>
                          Professional
                        </option>
                        <option value="casual" style={{ background: '#FFFFFF' }}>
                          Casual & Friendly
                        </option>
                        <option value="authoritative" style={{ background: '#FFFFFF' }}>
                          Authoritative
                        </option>
                        <option value="conversational" style={{ background: '#FFFFFF' }}>
                          Conversational
                        </option>
                        <option value="technical" style={{ background: '#FFFFFF' }}>
                          Technical
                        </option>
                      </Select>
                      <FormHelperText color="gray.500">
                        This affects the tone of AI-generated content
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.600">Target Audience</FormLabel>
                      <Textarea
                        {...inputStyles}
                        placeholder="Describe your ideal reader..."
                        value={settings.targetAudience}
                        onChange={(e) => updateSetting('targetAudience', e.target.value)}
                        rows={3}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.600">Tone Keywords</FormLabel>
                      <Input
                        {...inputStyles}
                        placeholder="expert, helpful, data-driven..."
                        value={settings.toneKeywords}
                        onChange={(e) => updateSetting('toneKeywords', e.target.value)}
                      />
                      <FormHelperText color="gray.500">
                        Comma-separated keywords that define your content style
                      </FormHelperText>
                    </FormControl>
                  </VStack>
                </SettingSection>
              </VStack>
            </TabPanel>

            {/* Content Defaults Tab */}
            <TabPanel p={0}>
              <VStack spacing={6} align="stretch">
                <SettingSection
                  icon={FiEdit3}
                  title="Content Generation"
                  description="Default settings for new content"
                  delay={0.1}
                >
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel color="gray.300">Default Word Count</FormLabel>
                      <Select
                        {...inputStyles}
                        value={settings.defaultWordCount}
                        onChange={(e) => updateSetting('defaultWordCount', e.target.value)}
                      >
                        <option value="800" style={{ background: '#1e1e1e' }}>
                          Short (800 words)
                        </option>
                        <option value="1500" style={{ background: '#1e1e1e' }}>
                          Medium (1500 words)
                        </option>
                        <option value="2500" style={{ background: '#1e1e1e' }}>
                          Long (2500 words)
                        </option>
                        <option value="4000" style={{ background: '#1e1e1e' }}>
                          Comprehensive (4000+ words)
                        </option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.300">Content Format</FormLabel>
                      <Select
                        {...inputStyles}
                        value={settings.contentFormat}
                        onChange={(e) => updateSetting('contentFormat', e.target.value)}
                      >
                        <option value="blog" style={{ background: '#1e1e1e' }}>
                          Blog Post
                        </option>
                        <option value="guide" style={{ background: '#1e1e1e' }}>
                          Guide/Tutorial
                        </option>
                        <option value="listicle" style={{ background: '#1e1e1e' }}>
                          Listicle
                        </option>
                        <option value="comparison" style={{ background: '#1e1e1e' }}>
                          Comparison
                        </option>
                        <option value="howto" style={{ background: '#1e1e1e' }}>
                          How-To
                        </option>
                      </Select>
                    </FormControl>

                    <Divider borderColor="gray.200" />

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Include Image Suggestions
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Add AI-suggested image placements
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.includeImages}
                        onChange={(e) => updateSetting('includeImages', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Include FAQ Section
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Auto-generate FAQ from topic
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.includeFaq}
                        onChange={(e) => updateSetting('includeFaq', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Include Schema Markup
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Generate JSON-LD structured data
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.includeSchema}
                        onChange={(e) => updateSetting('includeSchema', e.target.checked)}
                      />
                    </FormControl>
                  </VStack>
                </SettingSection>
              </VStack>
            </TabPanel>

            {/* Publishing Tab */}
            <TabPanel p={0}>
              <VStack spacing={6} align="stretch">
                <SettingSection
                  icon={FiGlobe}
                  title="Publishing Settings"
                  description="Configure how content gets published"
                  delay={0.1}
                >
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Auto-Publish
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Automatically publish to WordPress when approved
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.autoPublish}
                        onChange={(e) => updateSetting('autoPublish', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Require Review
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Content must be reviewed before publishing
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.reviewRequired}
                        onChange={(e) => updateSetting('reviewRequired', e.target.checked)}
                      />
                    </FormControl>

                    <Divider borderColor="gray.200" />

                    <FormControl>
                      <FormLabel color="gray.300">Default CTA</FormLabel>
                      <Textarea
                        {...inputStyles}
                        placeholder="Your default call-to-action text..."
                        value={settings.defaultCta}
                        onChange={(e) => updateSetting('defaultCta', e.target.value)}
                        rows={2}
                      />
                      <FormHelperText color="gray.500">
                        This CTA will be appended to all published content
                      </FormHelperText>
                    </FormControl>
                  </VStack>
                </SettingSection>

                <SettingSection
                  icon={FiLink}
                  title="Integrations"
                  description="Connect your publishing platforms"
                  delay={0.2}
                >
                  <VStack spacing={3} align="stretch">
                    <HStack p={4} borderRadius="lg" bg="gray.50" justify="space-between">
                      <HStack>
                        <Icon as={FiGlobe} color="blue.400" />
                        <Box>
                          <Text color="gray.700">WordPress</Text>
                          <Text color="gray.500" fontSize="sm">
                            Not connected
                          </Text>
                        </Box>
                      </HStack>
                      <Button size="sm" variant="outline" colorScheme="orange">
                        Connect
                      </Button>
                    </HStack>
                    <Text color="gray.500" fontSize="sm">
                      Connect WordPress to enable direct publishing
                    </Text>
                  </VStack>
                </SettingSection>
              </VStack>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel p={0}>
              <VStack spacing={6} align="stretch">
                <SettingSection
                  icon={FiBell}
                  title="Email Notifications"
                  description="Manage your notification preferences"
                  delay={0.1}
                >
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Content Published
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Get notified when content is published
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.emailOnPublish}
                        onChange={(e) => updateSetting('emailOnPublish', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Draft Ready for Review
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Get notified when AI completes a draft
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.emailOnDraft}
                        onChange={(e) => updateSetting('emailOnDraft', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.300" mb={0}>
                          Weekly Digest
                        </FormLabel>
                        <FormHelperText color="gray.500" mt={1}>
                          Weekly summary of content performance
                        </FormHelperText>
                      </Box>
                      <Switch
                        colorScheme="orange"
                        isChecked={settings.weeklyDigest}
                        onChange={(e) => updateSetting('weeklyDigest', e.target.checked)}
                      />
                    </FormControl>
                  </VStack>
                </SettingSection>
              </VStack>
            </TabPanel>

            {/* Support Tab */}
            <TabPanel p={0}>
              <VStack spacing={6} align="stretch">
                <SettingSection
                  icon={FiHelpCircle}
                  title="Need Help?"
                  description="Get support from the Phoo team"
                  delay={0.1}
                >
                  <VStack spacing={4} align="stretch">
                    <Box p={4} borderRadius="lg" bg="gray.50">
                      <Text color="gray.600" mb={2}>
                        Have a question or need assistance? Reach out to our support team:
                      </Text>
                      <Button
                        as="a"
                        href={`mailto:${BRAND.supportEmail}`}
                        variant="outline"
                        colorScheme="orange"
                        size="lg"
                        leftIcon={<FiHelpCircle />}
                      >
                        {BRAND.supportEmail}
                      </Button>
                    </Box>
                    <Text color="gray.500" fontSize="sm">
                      We typically respond within 24 hours during business days.
                    </Text>
                  </VStack>
                </SettingSection>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </StudioLayout>
  );
}
