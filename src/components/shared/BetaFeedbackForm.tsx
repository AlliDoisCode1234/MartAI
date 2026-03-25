'use client';

/**
 * BetaFeedbackForm
 *
 * Component Hierarchy:
 * App -> [AnyRoute] -> BetaFeedbackForm
 *
 * This component dynamically loads the HubSpot form script and renders
 * a fully native HubSpot form for Beta User Product Feedback. No data
 * passes through Convex; it goes directly to the CRM Service Hub.
 */

import { useEffect, useRef, useState } from 'react';
import { Box, Spinner, VStack, Text, useToast } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';

declare global {
  interface Window {
    hbspt: any;
  }
}

// Replace these with the actual HubSpot Portal ID and Form ID once created in the CRM
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || 'PORTAL_ID';
const HUBSPOT_BETA_FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_BETA_FORM_ID || 'FORM_ID';

export const BetaFeedbackForm = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // Prevent duplicate injections
    if (document.getElementById('hs-form-script')) {
      if (window.hbspt && !isLoaded) {
        renderForm();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'hs-form-script';
    script.src = 'https://js.hsforms.net/forms/embed/v2.js';
    script.async = true;
    script.onload = () => {
      renderForm();
    };
    script.onerror = () => {
      setError('Failed to load feedback form. Please check your network or ad blocker.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script tag on unmount if it's the only one using it
      // For safety, we usually leave it since other components might use HubSpot forms
    };
  }, []);

  const renderForm = () => {
    if (!window.hbspt || !formRef.current) return;

    try {
      window.hbspt.forms.create({
        region: 'na1', // default region
        portalId: HUBSPOT_PORTAL_ID,
        formId: HUBSPOT_BETA_FORM_ID,
        target: `#${formRef.current.id}`,
        // Pre-fill user data if they are authenticated
        onFormReady: ($form: any) => {
          setIsLoaded(true);
          
          if (isAuthenticated && user) {
            // HubSpot forms look for inputs by name
            const emailInput = $form.find('input[name="email"]');
            if (emailInput && user.email) {
              emailInput.val(user.email).change();
            }
          }
        },
        onFormSubmitted: () => {
          toast({
            title: 'Feedback Submitted',
            description: 'Thank you for helping us improve Phoo!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
      });
    } catch (err) {
      console.error('Error rendering HubSpot form:', err);
      setError('An error occurred while rendering the form.');
    }
  };

  return (
    <Box w="full" maxW="lg" mx="auto" p={6} bg="white" rounded="xl" shadow="sm" borderWidth="1px" borderColor="gray.100">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold" color="gray.800">
          Beta Feedback
        </Text>
        <Text fontSize="sm" color="gray.500">
          Your feedback goes directly to our product team to help shape the future of Phoo.
        </Text>
        
        {error ? (
          <Text color="red.500" fontSize="sm">{error}</Text>
        ) : (
          <Box position="relative" minH="200px">
            {!isLoaded && (
              <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center">
                <Spinner color="brand.orange" />
              </Box>
            )}
            {/* The ID must be unique so HubSpot knows where to mount */}
            <div ref={formRef} id="hubspot-beta-feedback-form" />
          </Box>
        )}
      </VStack>
    </Box>
  );
};
