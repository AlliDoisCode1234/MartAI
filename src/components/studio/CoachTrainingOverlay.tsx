import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { FiRefreshCw, FiZap, FiCheckCircle } from 'react-icons/fi';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Props {
  contentTitle: string;
}

export function CoachTrainingOverlay({ contentTitle }: Props) {
  const toast = useToast();
  const user = useQuery(api.users.me);
  const updatePreferences = useMutation(api.users.updateCoachPreferences);

  const [tone, setTone] = useState('');
  const [audienceExpertise, setAudienceExpertise] = useState('');
  const [customConstraints, setCustomConstraints] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from user preferences once loaded
  useEffect(() => {
    if (user?.coachPreferences) {
      setTone(user.coachPreferences.tone || '');
      setAudienceExpertise(user.coachPreferences.audienceExpertise || '');
      setCustomConstraints(user.coachPreferences.customConstraints || '');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePreferences({
        tone: tone || undefined,
        audienceExpertise: audienceExpertise || undefined,
        customConstraints: customConstraints || undefined,
      });
      toast({
        title: 'Preferences Updated',
        description: 'Phoo Coach will use these settings for this and future generations.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Failed to save',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box maxW="3xl" mx="auto" py={12} px={6}>
      <VStack spacing={10} align="stretch">
        <VStack spacing={6} textAlign="center">
          <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="full" p={6} animation="pulse 2s infinite">
            <Icon as={FiRefreshCw} boxSize={12} color="#FF9D00" />
          </Box>
          <Heading size="lg" color="gray.800">
            Generating Your Content
          </Heading>
          <Text color="gray.500" fontSize="lg" fontWeight="medium">
            {contentTitle}
          </Text>
          <Progress size="sm" isIndeterminate colorScheme="orange" w="full" maxW="400px" borderRadius="full" />
        </VStack>

        <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.200" p={8} boxShadow="sm">
          <HStack spacing={4} mb={6}>
            <Box bg="rgba(139, 92, 246, 0.1)" p={3} borderRadius="lg">
              <Icon as={FiZap} boxSize={6} color="#8B5CF6" />
            </Box>
            <Box>
              <Heading size="md" color="gray.800">Train Your AI Coach</Heading>
              <Text color="gray.500" fontSize="sm">
                While we generate your content, tell us how you want Phoo Coach to write moving forward.
              </Text>
            </Box>
          </HStack>

          <VStack spacing={6} align="stretch">
            <HStack spacing={6} flexWrap="wrap">
              <FormControl flex={1} minW="200px">
                <FormLabel color="gray.700" fontWeight="600">Brand Tone</FormLabel>
                <Select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g., Professional, Conversational"
                  bg="gray.50"
                  _hover={{ bg: 'white' }}
                >
                  <option value="Professional & Authoritative">Professional & Authoritative</option>
                  <option value="Conversational & Friendly">Conversational & Friendly</option>
                  <option value="Academic & Data-Driven">Academic & Data-Driven</option>
                  <option value="Bold & Disruptive">Bold & Disruptive</option>
                  <option value="Empathetic & Supportive">Empathetic & Supportive</option>
                </Select>
              </FormControl>

              <FormControl flex={1} minW="200px">
                <FormLabel color="gray.700" fontWeight="600">Audience Expertise</FormLabel>
                <Select
                  value={audienceExpertise}
                  onChange={(e) => setAudienceExpertise(e.target.value)}
                  placeholder="Select audience level"
                  bg="gray.50"
                  _hover={{ bg: 'white' }}
                >
                  <option value="Beginner (No prior knowledge)">Beginner (No prior knowledge)</option>
                  <option value="Intermediate (Familiar with concepts)">Intermediate (Familiar with concepts)</option>
                  <option value="Advanced (Industry practitioners)">Advanced (Industry practitioners)</option>
                  <option value="Executive (C-Suite / Decision Makers)">Executive (C-Suite / Decision Makers)</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel color="gray.700" fontWeight="600">Custom Constraints & Rules</FormLabel>
              <Textarea
                value={customConstraints}
                onChange={(e) => setCustomConstraints(e.target.value)}
                placeholder="e.g., Never use the word 'utilize'. Always keep paragraphs under 3 sentences. Avoid cheesy marketing jargon."
                rows={3}
                bg="gray.50"
                _hover={{ bg: 'white' }}
                resize="none"
              />
              <Text fontSize="xs" color="gray.400" mt={2}>
                These rules are permanently stored as vector embeddings to steer the AI on future generations.
              </Text>
            </FormControl>

            <Button
              bg="gray.900"
              color="white"
              size="lg"
              leftIcon={<Icon as={FiCheckCircle} />}
              onClick={handleSave}
              isLoading={isSaving}
              _hover={{ bg: 'gray.800', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              alignSelf="flex-end"
            >
              Update Coach Preferences
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
