'use client';

import { useState } from 'react';
import { Container, VStack, Heading, Text, Box, Button, HStack, Grid, GridItem, Card, CardBody, Alert, AlertIcon, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Badge } from '@chakra-ui/react';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Array<{ platform: string; connected: boolean; siteUrl?: string }>>([
    { platform: 'wordpress', connected: false },
    { platform: 'shopify', connected: false },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlatform, setSelectedPlatform] = useState<'wordpress' | 'shopify' | null>(null);
  const [formData, setFormData] = useState({ siteUrl: '', username: '', password: '', shopDomain: '' });

  const handleConnect = (platform: 'wordpress' | 'shopify') => {
    setSelectedPlatform(platform);
    onOpen();
  };

  const handleSubmitConnection = async () => {
    if (!selectedPlatform) return;

    try {
      if (selectedPlatform === 'wordpress') {
        const response = await fetch('/api/oauth/wordpress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteUrl: formData.siteUrl,
            username: formData.username,
            password: formData.password,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setIntegrations(prev => prev.map(i => 
            i.platform === 'wordpress' 
              ? { ...i, connected: true, siteUrl: formData.siteUrl }
              : i
          ));
          onClose();
          alert('WordPress connected successfully!');
        } else {
          alert(`Error: ${result.error}`);
        }
      } else if (selectedPlatform === 'shopify') {
        const response = await fetch('/api/oauth/shopify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shopDomain: formData.shopDomain,
            accessToken: formData.password,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setIntegrations(prev => prev.map(i => 
            i.platform === 'shopify' 
              ? { ...i, connected: true, siteUrl: formData.shopDomain }
              : i
          ));
          onClose();
          alert('Shopify connected successfully!');
        } else {
          alert(`Error: ${result.error}`);
        }
      }
    } catch (error) {
      alert('Failed to connect');
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
            Platform Integrations
          </Heading>

          <Text color="gray.600">
            Connect your WordPress or Shopify site to automatically create optimized service pages with your generated keywords.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">WordPress</Heading>
                      <Badge colorScheme={integrations.find(i => i.platform === 'wordpress')?.connected ? 'green' : 'gray'}>
                        {integrations.find(i => i.platform === 'wordpress')?.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </HStack>
                    <Text color="gray.600" fontSize="sm">
                      Connect your WordPress site to automatically create and publish SEO-optimized service pages.
                    </Text>
                    {integrations.find(i => i.platform === 'wordpress')?.connected ? (
                      <Text fontSize="sm" color="green.600">
                        Connected to: {integrations.find(i => i.platform === 'wordpress')?.siteUrl}
                      </Text>
                    ) : (
                      <Button bg="brand.orange" color="white" onClick={() => handleConnect('wordpress')}>
                        Connect WordPress
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">Shopify</Heading>
                      <Badge colorScheme={integrations.find(i => i.platform === 'shopify')?.connected ? 'green' : 'gray'}>
                        {integrations.find(i => i.platform === 'shopify')?.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </HStack>
                    <Text color="gray.600" fontSize="sm">
                      Connect your Shopify store to automatically create and publish SEO-optimized service pages.
                    </Text>
                    {integrations.find(i => i.platform === 'shopify')?.connected ? (
                      <Text fontSize="sm" color="green.600">
                        Connected to: {integrations.find(i => i.platform === 'shopify')?.siteUrl}
                      </Text>
                    ) : (
                      <Button bg="brand.teal" color="white" onClick={() => handleConnect('shopify')}>
                        Connect Shopify
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              <strong>WordPress:</strong> You'll need to create an Application Password in WordPress (Users → Your Profile → Application Passwords).
              <br />
              <strong>Shopify:</strong> You'll need a Private App Access Token with content write permissions.
            </Text>
          </Alert>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Connect {selectedPlatform === 'wordpress' ? 'WordPress' : 'Shopify'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {selectedPlatform === 'wordpress' ? (
                <>
                  <FormControl isRequired>
                    <FormLabel>Site URL</FormLabel>
                    <Input 
                      placeholder="https://yoursite.com" 
                      value={formData.siteUrl}
                      onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input 
                      placeholder="WordPress username" 
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Application Password</FormLabel>
                    <Input 
                      type="password" 
                      placeholder="Application password" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </FormControl>
                </>
              ) : (
                <>
                  <FormControl isRequired>
                    <FormLabel>Shop Domain</FormLabel>
                    <Input 
                      placeholder="mystore.myshopify.com" 
                      value={formData.shopDomain}
                      onChange={(e) => setFormData({ ...formData, shopDomain: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Access Token</FormLabel>
                    <Input 
                      type="password" 
                      placeholder="Private app access token" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </FormControl>
                </>
              )}
              <Button bg="brand.orange" color="white" onClick={handleSubmitConnection}>
                Connect
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

