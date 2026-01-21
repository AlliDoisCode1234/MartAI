/**
 * Test Personas for Multi-Industry E2E Validation
 *
 * 5 real customer personas with GA4/GSC-derived keywords.
 * Used to validate content generation quality across diverse industries.
 */

import { IndustryId } from '../phoo/industryTemplates';
import { ContentTypeId } from '../phoo/contentTypes';

// ============================================================================
// Test Persona Types
// ============================================================================

export interface TestPersona {
  id: string;
  name: string;
  industry: IndustryId;
  targetUrl: string;
  companyName: string;
  location: string;
  founderName: string;
  tone: 'professional' | 'warm' | 'empathetic' | 'inspirational' | 'friendly';
  targetAudience: string;
  keywords: string[]; // Real GA4/GSC-derived keywords
  topContentTypes: ContentTypeId[]; // Most relevant content types for this industry
}

// ============================================================================
// The 5 Test Personas (Real Client Datasets)
// ============================================================================

export const TEST_PERSONAS: TestPersona[] = [
  // 1. Marketing Agency (helps2.com) - User's reference case
  {
    id: 'helps2',
    name: 'Helps2 Marketing Agency',
    industry: 'marketingAgency',
    targetUrl: 'https://www.helps2.com',
    companyName: 'Helps2',
    location: 'Texas',
    founderName: 'Marketing Team',
    tone: 'professional',
    targetAudience: 'Business Owners',
    keywords: [
      'marketing agency',
      'digital marketing',
      'seo agency',
      'content marketing',
      'marketing strategy',
      'advertising agency',
      'marketing company',
    ],
    topContentTypes: ['homepage', 'service', 'blog', 'about', 'landing'],
  },

  // 2. Med Spa (Savage Beauty) - High volume, E-E-A-T
  {
    id: 'savageBeauty',
    name: 'Savage Beauty Med Spa',
    industry: 'medSpa',
    targetUrl: 'https://www.savagebeautymedspa.com',
    companyName: 'Savage Beauty Med Spa',
    location: 'Kansas City',
    founderName: 'Candice Armstrong',
    tone: 'warm',
    targetAudience: 'Women 30-55',
    keywords: [
      'lip fillers kansas city', // Volume: 590
      'med spa near me', // Volume: 390
      'botox', // Volume: 260
      'lip fillers', // Volume: 170
      'med spa kansas city', // Volume: 140
      'skinmedica', // Volume: 110
      'collagen treatment',
    ],
    topContentTypes: ['homepage', 'about', 'service', 'blog', 'leadMagnet'],
  },

  // 3. Chiropractic (Lifeway Mobile) - Healthcare E-E-A-T
  {
    id: 'lifewayChiro',
    name: 'Lifeway Mobile Chiropractic',
    industry: 'chiropractic',
    targetUrl: 'https://www.lifewaymobilechiropractic.com',
    companyName: 'Lifeway Mobile Chiropractic',
    location: 'Kansas City',
    founderName: 'Dr. Amy Crowe',
    tone: 'empathetic',
    targetAudience: 'Pain Sufferers, Athletes',
    keywords: [
      'sciatica', // Volume: 450,000
      'low back pain', // Volume: 301,000
      'carpal tunnel', // Volume: 301,000
      'shoulder pain', // Volume: 165,000
      'knee pain', // Volume: 135,000
      'chiropractor kansas city',
      'sciatica chiropractor',
    ],
    topContentTypes: ['homepage', 'about', 'service', 'blog', 'blogVersus'],
  },

  // 4. Non-Profit (Unity Queens) - Community focus
  {
    id: 'unityQueens',
    name: 'Unity Queens',
    industry: 'nonprofit',
    targetUrl: 'https://www.unityqueens.org',
    companyName: 'Unity Queens',
    location: 'New York',
    founderName: 'Founder',
    tone: 'inspirational',
    targetAudience: 'Youth, Donors, Volunteers',
    keywords: [
      'life skills curriculum', // Volume: 1,600
      'life skills for teens', // Volume: 1,600
      'mentorship programs', // Volume: 2,800
      'after school program', // Volume: 3,600
      'summer youth program', // Volume: 3,600
      'youth development program',
      'causes to donate to',
    ],
    topContentTypes: ['homepage', 'program', 'mentorship', 'events', 'partner', 'donate'],
  },

  // 5. Hardscaping - Local SEO, specialty services
  {
    id: 'hardscapeKC',
    name: 'KC Hardscapes',
    industry: 'hardscaping',
    targetUrl: 'https://www.kchardscapes.com',
    companyName: 'KC Hardscapes',
    location: 'Kansas City',
    founderName: 'Owner',
    tone: 'friendly',
    targetAudience: 'Homeowners',
    keywords: [
      'patio installation near me', // Volume: 5,400
      'pool deck installation', // Volume: 700
      'kansas city hardscapes', // Volume: 50
      'gunite pools', // Volume: 30
      'pebble tec pool resurfacing',
      'hardscape contractors kansas city',
      'pool installation kansas city',
    ],
    topContentTypes: ['homepage', 'about', 'service', 'areasWeServe', 'blog'],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get a persona by ID
 */
export function getPersonaById(id: string): TestPersona | undefined {
  return TEST_PERSONAS.find((p) => p.id === id);
}

/**
 * Get all persona IDs
 */
export function getAllPersonaIds(): string[] {
  return TEST_PERSONAS.map((p) => p.id);
}

/**
 * Get keywords for a specific persona
 */
export function getPersonaKeywords(personaId: string): string[] {
  const persona = getPersonaById(personaId);
  return persona?.keywords ?? [];
}

/**
 * Get content types most relevant for a persona
 */
export function getPersonaContentTypes(personaId: string): ContentTypeId[] {
  const persona = getPersonaById(personaId);
  return persona?.topContentTypes ?? [];
}
