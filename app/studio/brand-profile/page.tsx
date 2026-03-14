'use client';

/**
 * Brand Profile Page - Content Preferences
 *
 * Component Hierarchy:
 * App -> StudioLayout -> BrandProfilePage
 *
 * Configure content preferences, brand voice, and publishing defaults.
 * Persists to Convex projects table via updateProject mutation.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
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
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout } from '@/src/components/studio';
import { FiTarget, FiEdit3, FiGlobe, FiLink, FiBell, FiSave, FiHelpCircle, FiAlertTriangle } from 'react-icons/fi';
import { BRAND } from '@/lib/constants/brand';
import { useProject } from '@/lib/hooks';

const MotionCard = motion(Card);

// Industry options
const INDUSTRIES = [
  { value: 'technology', label: 'Technology & SaaS' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'marketing', label: 'Marketing & Agencies' },
  { value: 'education', label: 'Education' },
  { value: 'lifestyle', label: 'Lifestyle & Wellness' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

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
  const { projectId, project, isLoading } = useProject(null, { autoSelect: true });
  const updateProject = useMutation(api.projects.projects.updateProject);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Industry change confirmation modal
  const { isOpen: isIndustryModalOpen, onOpen: onIndustryModalOpen, onClose: onIndustryModalClose } = useDisclosure();
  const [pendingIndustry, setPendingIndustry] = useState('');

  // Local settings state (hydrated from project data)
  const [settings, setSettings] = useState({
    brandName: '',
    brandVoice: 'professional',
    targetAudience: '',
    toneKeywords: '',
    industry: '',
    defaultWordCount: '1500',
    includeImages: true,
    includeFaq: true,
    includeSchema: true,
    contentFormat: 'blog',
    autoPublish: false,
    reviewRequired: true,
    defaultCta: '',
    emailOnPublish: true,
    emailOnDraft: false,
    weeklyDigest: true,
  });

  // Hydrate from project data on first load
  useEffect(() => {
    if (project) {
      setSettings((prev) => ({
        ...prev,
        brandName: project.brandName || project.name || '',
        brandVoice: project.brandVoice || 'professional',
        targetAudience: project.targetAudience || '',
        toneKeywords: (project.toneKeywords || []).join(', '),
        industry: project.industry || '',
        defaultWordCount: String(project.defaultWordCount || 1500),
      }));
    }
  }, [project]);

  const updateSetting = useCallback((key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    if (!projectId) {
      toast({
        title: 'No project selected',
        description: 'Please create or select a project first.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setSaving(true);
    try {
      await updateProject({
        projectId,
        brandName: settings.brandName || undefined,
        brandVoice: settings.brandVoice || undefined,
        targetAudience: settings.targetAudience || undefined,
        toneKeywords: settings.toneKeywords
          ? settings.toneKeywords.split(',').map((k) => k.trim()).filter(Boolean)
          : undefined,
        industry: settings.industry || undefined,
        defaultWordCount: settings.defaultWordCount
          ? Number(settings.defaultWordCount)
          : undefined,
      });
      setHasChanges(false);
      toast({
        title: 'Settings saved',
        description: 'Your brand profile has been updated.',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Save failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <StudioLayout>
        <VStack spacing={6} align="stretch">
          <Skeleton height="40px" width="300px" />
          <Skeleton height="300px" borderRadius="xl" />
        </VStack>
      </StudioLayout>
    );
  }

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
          <HStack spacing={2}>
            {hasChanges && (
              <Badge colorScheme="orange" fontSize="xs" px={2} py={1} borderRadius="full">
                Unsaved changes
              </Badge>
            )}
            <Button
              bg="linear-gradient(135deg, #FF9D00 0%, #FF6B00 100%)"
              color="white"
              leftIcon={<FiSave />}
              onClick={handleSave}
              isLoading={saving}
              isDisabled={!hasChanges}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              Save Changes
            </Button>
          </HStack>
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
                      <FormLabel color="gray.600">Industry</FormLabel>
                      {settings.industry ? (
                        <HStack justify="space-between" p={3} bg="gray.50" borderRadius="lg">
                          <HStack>
                            <Badge colorScheme="orange" fontSize="sm" px={3} py={1} borderRadius="full">
                              {INDUSTRIES.find((ind) => ind.value === settings.industry)?.label || settings.industry}
                            </Badge>
                          </HStack>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="orange"
                            onClick={onIndustryModalOpen}
                          >
                            Change Industry
                          </Button>
                        </HStack>
                      ) : (
                        <Select
                          {...inputStyles}
                          value=""
                          onChange={(e) => {
                            updateSetting('industry', e.target.value);
                          }}
                          placeholder="Select your industry"
                        >
                          {INDUSTRIES.map((ind) => (
                            <option key={ind.value} value={ind.value} style={{ background: '#FFFFFF' }}>
                              {ind.label}
                            </option>
                          ))}
                        </Select>
                      )}
                      <FormHelperText color="gray.500">
                        This calibrates content scoring to your industry standards
                      </FormHelperText>
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
                      <FormLabel color="gray.600">Default Word Count</FormLabel>
                      <Select
                        {...inputStyles}
                        value={settings.defaultWordCount}
                        onChange={(e) => updateSetting('defaultWordCount', e.target.value)}
                      >
                        <option value="800" style={{ background: '#FFFFFF' }}>
                          Short (800 words)
                        </option>
                        <option value="1500" style={{ background: '#FFFFFF' }}>
                          Medium (1500 words)
                        </option>
                        <option value="2500" style={{ background: '#FFFFFF' }}>
                          Long (2500 words)
                        </option>
                        <option value="4000" style={{ background: '#FFFFFF' }}>
                          Comprehensive (4000+ words)
                        </option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.600">Content Format</FormLabel>
                      <Select
                        {...inputStyles}
                        value={settings.contentFormat}
                        onChange={(e) => updateSetting('contentFormat', e.target.value)}
                      >
                        <option value="blog" style={{ background: '#FFFFFF' }}>Blog Post</option>
                        <option value="guide" style={{ background: '#FFFFFF' }}>Guide/Tutorial</option>
                        <option value="listicle" style={{ background: '#FFFFFF' }}>Listicle</option>
                        <option value="comparison" style={{ background: '#FFFFFF' }}>Comparison</option>
                        <option value="howto" style={{ background: '#FFFFFF' }}>How-To</option>
                      </Select>
                    </FormControl>

                    <Divider borderColor="gray.200" />

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel color="gray.600" mb={0}>Include Image Suggestions</FormLabel>
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
                        <FormLabel color="gray.600" mb={0}>Include FAQ Section</FormLabel>
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
                        <FormLabel color="gray.600" mb={0}>Include Schema Markup</FormLabel>
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
                        <FormLabel color="gray.600" mb={0}>Auto-Publish</FormLabel>
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
                        <FormLabel color="gray.600" mb={0}>Require Review</FormLabel>
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
                      <FormLabel color="gray.600">Default CTA</FormLabel>
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
                          <Text color="gray.500" fontSize="sm">Not connected</Text>
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
                        <FormLabel color="gray.600" mb={0}>Content Published</FormLabel>
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
                        <FormLabel color="gray.600" mb={0}>Draft Ready for Review</FormLabel>
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
                        <FormLabel color="gray.600" mb={0}>Weekly Digest</FormLabel>
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

      {/* Industry Change Confirmation Modal */}
      <Modal isOpen={isIndustryModalOpen} onClose={onIndustryModalClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(4px)" />
        <ModalContent bg="white" borderRadius="16px" mx={4}>
          <ModalHeader color="gray.800">
            <HStack>
              <Icon as={FiAlertTriangle} color="orange.400" />
              <Text>Change Industry</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Text color="gray.600" fontSize="sm">
                Changing your industry recalibrates how Phoo scores your content.
                Existing scores in your library will update to reflect the new
                industry standard.
              </Text>
              <FormControl>
                <FormLabel color="gray.600" fontSize="sm">New Industry</FormLabel>
                <Select
                  {...inputStyles}
                  value={pendingIndustry}
                  onChange={(e) => setPendingIndustry(e.target.value)}
                  placeholder="Select new industry"
                >
                  {INDUSTRIES.filter((ind) => ind.value !== settings.industry).map((ind) => (
                    <option key={ind.value} value={ind.value} style={{ background: '#FFFFFF' }}>
                      {ind.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onIndustryModalClose}>
                Cancel
              </Button>
              <Button
                bg="linear-gradient(135deg, #FF9D00 0%, #FF6B00 100%)"
                color="white"
                isDisabled={!pendingIndustry}
                onClick={() => {
                  updateSetting('industry', pendingIndustry);
                  setPendingIndustry('');
                  onIndustryModalClose();
                }}
                _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              >
                Confirm Change
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </StudioLayout>
  );
}
