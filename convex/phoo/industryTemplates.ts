/**
 * PhooIntelligence Industry Templates
 *
 * Industry-specific content calendars and keyword recommendations.
 * Derived from 15 real client datasets across diverse industries.
 */

import { v } from 'convex/values';
import { query, internalQuery, internalAction } from '../_generated/server';
import { ContentTypeId } from './contentTypes';

// ============================================================================
// Industry Definitions
// ============================================================================

export type IndustryId =
  | 'medSpa'
  | 'electricalContractor'
  | 'commercialCleaning'
  | 'hardscaping'
  | 'schoolTherapy'
  | 'privateChef'
  | 'chiropractic'
  | 'agriculture'
  | 'fashionDesign'
  | 'nonprofit'
  | 'tutoring'
  | 'church'
  | 'tourism'
  | 'teacherTraining'
  | 'marketingAgency'
  | 'general';

export interface IndustryTemplate {
  id: IndustryId;
  name: string;
  description: string;
  keywords: string[]; // Seed keywords for this industry
  contentPlan: ContentPlanItem[];
  detectionPatterns: string[]; // URL/content patterns to detect industry
}

export interface ContentPlanItem {
  contentType: ContentTypeId;
  month: number; // 1-6 (which month in calendar)
  priority: 'P0' | 'P1' | 'P2';
  titleTemplate: string;
  suggestedKeywords: string[];
}

// ============================================================================
// Industry Templates Registry
// ============================================================================

export const INDUSTRY_TEMPLATES: Record<IndustryId, IndustryTemplate> = {
  medSpa: {
    id: 'medSpa',
    name: 'Med Spa / Aesthetics',
    description: 'Medical spa, aesthetics, beauty treatments',
    detectionPatterns: ['medspa', 'med spa', 'botox', 'fillers', 'aesthetics', 'beauty', 'skin'],
    keywords: [
      'med spa near me',
      'botox',
      'lip fillers',
      'body contouring',
      'collagen treatment',
      'skinmedica',
      'b12 injections',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Trusted Med Spa {{location}} Depends On | {{companyName}}',
        suggestedKeywords: ['med spa {{location}}', 'med spa near me', 'best med spa {{location}}'],
      },
      {
        contentType: 'about',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Meet {{founderName}} | The Esthetician {{location}} Can Rely On',
        suggestedKeywords: ['esthetician {{location}}', '{{founderName}}'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Expert Botox {{location}} Can Depend On | {{companyName}}',
        suggestedKeywords: ['botox {{location}}', 'botox injections', 'best botox'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Lip Fillers {{location}} Can Trust | {{companyName}}',
        suggestedKeywords: ['lip fillers {{location}}', 'lip fillers near me'],
      },
      {
        contentType: 'service',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Body Contouring {{location}} Can Count On | {{companyName}}',
        suggestedKeywords: ['body contouring {{location}}', 'non-surgical body contouring'],
      },
      {
        contentType: 'blog',
        month: 4,
        priority: 'P1',
        titleTemplate: 'Is SkinMedica Worth It? Raw Advice from A Med Spa Owner',
        suggestedKeywords: ['is skinmedica worth it', 'skinmedica review'],
      },
      {
        contentType: 'blog',
        month: 5,
        priority: 'P1',
        titleTemplate: 'How Long Does Botox Last? An Honest Guide For First Timers',
        suggestedKeywords: ['how long does botox last', 'botox first time'],
      },
      {
        contentType: 'leadMagnet',
        month: 6,
        priority: 'P2',
        titleTemplate: 'What Is My Skin Type Quiz | Find Out in Minutes',
        suggestedKeywords: ['skin type quiz', 'what is my skin type'],
      },
    ],
  },

  electricalContractor: {
    id: 'electricalContractor',
    name: 'Electrical Contractor',
    description: 'Commercial/industrial electrical services',
    detectionPatterns: ['electric', 'electrical', 'power', 'lighting', 'generator', 'wiring'],
    keywords: [
      'electrical contractors',
      'commercial electrician',
      'generator installation',
      'power monitoring',
      'lighting systems',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Trusted Electrical Contractors {{location}} | {{companyName}}',
        suggestedKeywords: ['electrical contractors {{location}}', 'commercial electrician'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Commercial Generator Installation Services | {{companyName}}',
        suggestedKeywords: ['commercial generator installation', 'generator installation near me'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Commercial Lighting Systems for {{location}} Businesses',
        suggestedKeywords: ['commercial lighting systems', 'title 24', 'lighting control systems'],
      },
      {
        contentType: 'service',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Power Monitoring System | {{companyName}}',
        suggestedKeywords: ['power monitoring system', 'power quality monitoring'],
      },
      {
        contentType: 'areasWeServe',
        month: 4,
        priority: 'P1',
        titleTemplate: 'Commercial Electrician {{location}} | {{companyName}}',
        suggestedKeywords: [
          'commercial electrician {{location}}',
          'electrical contractor {{location}}',
        ],
      },
      {
        contentType: 'blogVersus',
        month: 5,
        priority: 'P2',
        titleTemplate: '{{companyName}} vs. {{competitor}}: Who Should You Trust?',
        suggestedKeywords: ['{{competitor}}', '{{competitor}} reviews'],
      },
    ],
  },

  commercialCleaning: {
    id: 'commercialCleaning',
    name: 'Commercial Cleaning',
    description: 'Commercial cleaning and janitorial services',
    detectionPatterns: ['cleaning', 'janitorial', 'sanitize', 'carpet', 'floor'],
    keywords: [
      'commercial cleaning company near me',
      'janitorial services',
      'commercial cleaning services',
      'carpet cleaning',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Your Go-To Commercial Cleaning Company | {{companyName}}',
        suggestedKeywords: ['commercial cleaning company', 'professional commercial cleaning'],
      },
      {
        contentType: 'landing',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Top-Rated Commercial Cleaning Company Near Me | {{companyName}}',
        suggestedKeywords: [
          'commercial cleaning company near me',
          'commercial cleaning services near me',
        ],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Affordable Janitorial Services | {{companyName}}',
        suggestedKeywords: ['janitorial services', 'janitorial services near me'],
      },
      {
        contentType: 'service',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Commercial Carpet Cleaning Service | {{companyName}}',
        suggestedKeywords: ['commercial carpet cleaning', 'carpet cleaning cost'],
      },
      {
        contentType: 'service',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Commercial Floor Cleaning Company | {{companyName}}',
        suggestedKeywords: ['commercial floor cleaning', 'floor maintenance'],
      },
    ],
  },

  hardscaping: {
    id: 'hardscaping',
    name: 'Pool/Patio/Hardscaping',
    description: 'Pool installation, patio, hardscaping services',
    detectionPatterns: ['pool', 'patio', 'hardscape', 'deck', 'gunite', 'pebble tec'],
    keywords: [
      'patio installation near me',
      'pool deck installation',
      'hardscape contractors',
      'gunite pools',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: '{{location}} Hardscapes | {{companyName}}',
        suggestedKeywords: ['{{location}} hardscapes', 'hardscaping {{location}}'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Expert Pool Installation in {{location}} | {{companyName}}',
        suggestedKeywords: ['pool installation {{location}}', 'pool builder {{location}}'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Expert Patio Installation in {{location}} | {{companyName}}',
        suggestedKeywords: ['patio installation', 'patio installation near me'],
      },
      {
        contentType: 'service',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Pool Deck Installation in {{location}} | {{companyName}}',
        suggestedKeywords: ['pool deck installation', 'pool decking'],
      },
      {
        contentType: 'about',
        month: 4,
        priority: 'P1',
        titleTemplate: 'Hardscape Contractors {{location}} Homeowners Trust',
        suggestedKeywords: ['hardscape contractors {{location}}'],
      },
    ],
  },

  schoolTherapy: {
    id: 'schoolTherapy',
    name: 'School Therapy Staffing',
    description: 'School therapy, special education staffing',
    detectionPatterns: ['therapy', 'therapist', 'school', 'speech', 'occupational', 'slp', 'ot'],
    keywords: [
      'school occupational therapist jobs',
      'speech language pathologist jobs',
      'school based therapist jobs',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'School Staffing Services | {{companyName}}',
        suggestedKeywords: ['school staffing', 'school staffing agencies'],
      },
      {
        contentType: 'employment',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Join Our Team: School Occupational Therapist Jobs',
        suggestedKeywords: ['school occupational therapist jobs', 'ot jobs near me'],
      },
      {
        contentType: 'employment',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Join Our Team: Speech Language Pathologist Jobs',
        suggestedKeywords: ['speech language pathologist jobs', 'slp jobs'],
      },
      {
        contentType: 'service',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Augmentative and Alternative Communication Services',
        suggestedKeywords: ['augmentative and alternative communication', 'aac services'],
      },
      {
        contentType: 'blogVersus',
        month: 4,
        priority: 'P2',
        titleTemplate: '{{companyName}} vs. {{competitor}}: What Job Seekers Need to Know',
        suggestedKeywords: ['{{competitor}} jobs', '{{competitor}}'],
      },
    ],
  },

  privateChef: {
    id: 'privateChef',
    name: 'Private Chef / Cooking',
    description: 'Private chef, cooking classes, meal prep',
    detectionPatterns: ['chef', 'cooking', 'meal prep', 'catering', 'culinary'],
    keywords: ['private chef', 'cooking classes', 'meal prep services', 'private cooking classes'],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Private Chef {{location}} | {{companyName}}',
        suggestedKeywords: ['private chef {{location}}', 'personal chef {{location}}'],
      },
      {
        contentType: 'about',
        month: 1,
        priority: 'P0',
        titleTemplate: "Meet {{founderName}}: {{location}}'s Personal Chef",
        suggestedKeywords: ['{{founderName}}', 'personal chef {{location}}'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Private Cooking Classes in {{location}}',
        suggestedKeywords: ['cooking classes {{location}}', 'private cooking classes'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Meal Prep Services in {{location}}',
        suggestedKeywords: ['meal prep services', 'meal prep {{location}}'],
      },
      {
        contentType: 'blog',
        month: 3,
        priority: 'P1',
        titleTemplate: 'How Much Does Meal Prep Service Cost? A Local Guide',
        suggestedKeywords: ['how much does meal prep service cost', 'meal prep cost'],
      },
      {
        contentType: 'leadMagnet',
        month: 4,
        priority: 'P2',
        titleTemplate: 'Free Kitchen Hacks That Will Elevate Your Cooking',
        suggestedKeywords: ['kitchen hacks', 'cooking tips'],
      },
    ],
  },

  chiropractic: {
    id: 'chiropractic',
    name: 'Chiropractic',
    description: 'Chiropractic care, pain relief, wellness',
    detectionPatterns: [
      'chiropractic',
      'chiropractor',
      'spine',
      'back pain',
      'sciatica',
      'adjustment',
    ],
    keywords: [
      'chiropractor near me',
      'sciatica chiropractor',
      'neck pain chiropractor',
      'back pain relief',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Top-Rated Chiropractor {{location}} | {{companyName}}',
        suggestedKeywords: ['chiropractor {{location}}', 'best chiropractor {{location}}'],
      },
      {
        contentType: 'about',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Meet Dr. {{founderName}}: Personalized Chiropractic Care',
        suggestedKeywords: ['new patient chiropractic', 'benefits of chiropractic care'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Sciatica Chiropractor | {{companyName}}',
        suggestedKeywords: ['sciatica chiropractor', 'can a chiropractor help with sciatica'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Chiropractor for Neck Pain Relief | {{companyName}}',
        suggestedKeywords: ['chiropractor for neck pain', 'neck pain relief'],
      },
      {
        contentType: 'blog',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Sciatica Stretches You Can Do at Home',
        suggestedKeywords: ['sciatica stretches', 'sciatica pain relief'],
      },
      {
        contentType: 'blog',
        month: 4,
        priority: 'P1',
        titleTemplate: 'Understanding Sciatica Causes: What Behind Your Pain?',
        suggestedKeywords: ['sciatica causes', 'what causes sciatica'],
      },
    ],
  },

  agriculture: {
    id: 'agriculture',
    name: 'Agriculture / Farming',
    description: 'Agricultural products, farming, fertilizer',
    detectionPatterns: ['farm', 'agriculture', 'fertilizer', 'crop', 'soil', 'seed'],
    keywords: [
      'phosphorus fertilizer',
      'starter fertilizer',
      'nitrogen fertilizer',
      'sustainable agriculture',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Sustainable Farming Solutions | {{companyName}}',
        suggestedKeywords: ['sustainable agriculture', 'farming solutions'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Phosphorus Fertilizer Solutions | {{companyName}}',
        suggestedKeywords: ['phosphorus fertilizer', 'high phosphorus fertilizer'],
      },
      {
        contentType: 'blog',
        month: 3,
        priority: 'P1',
        titleTemplate: 'How to Fix Phosphorus Deficiency in Plants',
        suggestedKeywords: ['phosphorus deficiency', 'phosphorus deficiency in plants'],
      },
      {
        contentType: 'blog',
        month: 4,
        priority: 'P1',
        titleTemplate: 'The Evolution of Starter Fertilizers for Modern Farmers',
        suggestedKeywords: ['starter fertilizer', 'corn fertilizer'],
      },
      {
        contentType: 'contentRefresh',
        month: 5,
        priority: 'P2',
        titleTemplate: 'Sustainable Farming Practices Update',
        suggestedKeywords: ['sustainable farming practices', 'sustainable farming'],
      },
    ],
  },

  fashionDesign: {
    id: 'fashionDesign',
    name: 'Fashion Design',
    description: 'Fashion design, bridal, evening wear',
    detectionPatterns: ['fashion', 'designer', 'bridal', 'wedding dress', 'gown', 'couture'],
    keywords: ['fashion designer', 'designer wedding dresses', 'evening gowns', 'bridal couture'],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Fashion Designer in {{location}} | {{companyName}}',
        suggestedKeywords: ['fashion designer', '{{location}} fashion designers'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Designer Wedding Dresses & Bridal Couture | {{companyName}}',
        suggestedKeywords: ['designer wedding dresses', 'wedding dress designer'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Evening Wear & Designer Gowns | {{companyName}}',
        suggestedKeywords: ['designer gowns', 'formal evening gowns'],
      },
      {
        contentType: 'about',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Dress Designer with a Global Mission | About {{companyName}}',
        suggestedKeywords: ['dress designer', 'dress designers near me'],
      },
      {
        contentType: 'blog',
        month: 4,
        priority: 'P2',
        titleTemplate: 'How Much Do Wedding Dresses Cost? What Every Bride Should Know',
        suggestedKeywords: ['how much do wedding dresses cost', 'wedding dress cost'],
      },
    ],
  },

  nonprofit: {
    id: 'nonprofit',
    name: 'Non-Profit Organization',
    description: 'Non-profit, charity, youth development',
    detectionPatterns: ['nonprofit', 'non-profit', 'charity', 'donate', 'youth', 'community'],
    keywords: [
      'youth development program',
      'mentorship programs',
      'after school program',
      'life skills curriculum',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Life Skills Curriculum & Community | {{companyName}}',
        suggestedKeywords: ['life skills curriculum', 'life skills for teens'],
      },
      {
        contentType: 'program',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Youth Development Program | {{companyName}}',
        suggestedKeywords: ['youth development program', 'youth program'],
      },
      {
        contentType: 'mentorship',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Become a Mentor: Mentorship Opportunities',
        suggestedKeywords: ['mentorship programs', 'christian mentorship'],
      },
      {
        contentType: 'partner',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Partner With Us: After School Program for Your Students',
        suggestedKeywords: ['after school program', 'after school program curriculum'],
      },
      {
        contentType: 'events',
        month: 4,
        priority: 'P1',
        titleTemplate: 'Networking Events for Women on a Mission',
        suggestedKeywords: ['networking events for women', 'women networking events'],
      },
      {
        contentType: 'donate',
        month: 5,
        priority: 'P2',
        titleTemplate: 'Support Our Cause | Donate to {{companyName}}',
        suggestedKeywords: ['causes to donate to', 'good causes to donate to'],
      },
    ],
  },

  tutoring: {
    id: 'tutoring',
    name: 'Tutoring / Education',
    description: 'Tutoring services, educational programs',
    detectionPatterns: ['tutor', 'tutoring', 'learning', 'math', 'education', 'test prep'],
    keywords: ['math tutoring near me', 'tutoring services', 'online tutoring', 'math tutor'],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Expert Math Tutoring | {{companyName}}',
        suggestedKeywords: ['math tutoring near me', 'math tutor'],
      },
      {
        contentType: 'leadMagnet',
        month: 1,
        priority: 'P0',
        titleTemplate: "Elementary Math Assessment: Discover Your Child's Learning Style",
        suggestedKeywords: ['elementary math assessment', 'learning style assessment'],
      },
      {
        contentType: 'blog',
        month: 2,
        priority: 'P1',
        titleTemplate: 'Why Tutoring is Important: What Every Parent Needs to Know',
        suggestedKeywords: ['why tutoring is important', 'math tutoring'],
      },
      {
        contentType: 'blogVersus',
        month: 3,
        priority: 'P1',
        titleTemplate: '{{companyName}} vs. Kumon: Which Program is Better?',
        suggestedKeywords: ['kumon', 'kumon vs', 'best math tutoring'],
      },
      {
        contentType: 'blog',
        month: 4,
        priority: 'P2',
        titleTemplate: 'Fun Math Activities to Keep Kids Engaged',
        suggestedKeywords: ['fun math activities', 'math games for kids'],
      },
    ],
  },

  church: {
    id: 'church',
    name: 'Church / Ministry',
    description: 'Church, ministry, faith-based services',
    detectionPatterns: ['church', 'ministry', 'faith', 'worship', 'spiritual', 'prayer'],
    keywords: [
      'church service',
      'spiritual warfare',
      'marriage counseling',
      'christian counseling',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Church Service That Ignites Faith | {{companyName}}',
        suggestedKeywords: ['church service', 'church in {{location}}'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Christian Marriage Counseling | {{companyName}}',
        suggestedKeywords: ['christian marriage counseling', 'marriage counseling'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Spiritual Warfare Teaching | {{companyName}}',
        suggestedKeywords: ['spiritual warfare', 'spiritual warfare prayers'],
      },
      {
        contentType: 'service',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Hearing the Voice of God | Learn to Discern His Guidance',
        suggestedKeywords: ['hearing the voice of god', 'hearing from god'],
      },
    ],
  },

  tourism: {
    id: 'tourism',
    name: 'Tourism / Tours',
    description: 'Tourism, tours, travel experiences',
    detectionPatterns: ['tour', 'tourism', 'travel', 'guide', 'experience', 'visit'],
    keywords: ['tours', 'walking tours', 'bus tours', 'what to do in'],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Unforgettable {{location}} Tours | {{companyName}}',
        suggestedKeywords: ['{{location}} tours', 'tours in {{location}}'],
      },
      {
        contentType: 'about',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Discover What to Do in {{location}} with {{companyName}}',
        suggestedKeywords: ['what to do in {{location}}', 'things to do in {{location}}'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: '{{location}} Walking Tours for Everyone',
        suggestedKeywords: ['{{location}} walking tours', 'walking tours'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P1',
        titleTemplate: '{{location}} Bus Tours | {{companyName}}',
        suggestedKeywords: ['bus tours {{location}}', 'senior bus tours'],
      },
    ],
  },

  teacherTraining: {
    id: 'teacherTraining',
    name: 'Teacher Training',
    description: 'Teacher professional development, education training',
    detectionPatterns: ['teacher', 'educator', 'professional development', 'curriculum', 'inquiry'],
    keywords: [
      'inquiry based learning',
      'teacher training',
      'professional development',
      'curriculum development',
    ],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Transform Education with {{companyName}}',
        suggestedKeywords: ['inquiry based learning', 'teacher training'],
      },
      {
        contentType: 'blogVideo',
        month: 2,
        priority: 'P0',
        titleTemplate: 'What is Inquiry-Based Learning? A Comprehensive Guide',
        suggestedKeywords: ['what is inquiry-based learning', 'inquiry based learning definition'],
      },
      {
        contentType: 'blogVideo',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Top 10 Inquiry-Based Questions to Ignite Student Curiosity',
        suggestedKeywords: ['inquiry based questions', 'inquiry questions'],
      },
      {
        contentType: 'blogVideo',
        month: 4,
        priority: 'P1',
        titleTemplate: 'Understanding the Inquiry Process: A Step-by-Step Guide',
        suggestedKeywords: ['inquiry process', 'what is the inquiry process'],
      },
    ],
  },

  marketingAgency: {
    id: 'marketingAgency',
    name: 'Marketing Agency',
    description: 'Marketing agency, digital marketing services',
    detectionPatterns: ['marketing', 'agency', 'digital', 'seo', 'advertising', 'brand'],
    keywords: ['marketing agency', 'digital marketing', 'seo agency', 'advertising agency'],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: 'Results-Driven Marketing Agency | {{companyName}}',
        suggestedKeywords: ['marketing agency', 'marketing company'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Digital Marketing Services | {{companyName}}',
        suggestedKeywords: ['digital marketing', 'digital marketing agency'],
      },
      {
        contentType: 'blog',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Marketing Ideas for {{industry}} Success',
        suggestedKeywords: ['marketing ideas', '{{industry}} marketing'],
      },
      {
        contentType: 'blog',
        month: 4,
        priority: 'P1',
        titleTemplate: 'Social Media Marketing Basics: From Posting to Engagement',
        suggestedKeywords: ['social media marketing', 'social media tips'],
      },
    ],
  },

  general: {
    id: 'general',
    name: 'General Business',
    description: 'Default template for undetected industries',
    detectionPatterns: [],
    keywords: ['services near me', 'best {{industry}}', '{{location}} {{industry}}'],
    contentPlan: [
      {
        contentType: 'homepage',
        month: 1,
        priority: 'P0',
        titleTemplate: '{{companyName}} | {{location}}',
        suggestedKeywords: ['{{industry}} near me', '{{industry}} {{location}}'],
      },
      {
        contentType: 'about',
        month: 1,
        priority: 'P0',
        titleTemplate: 'About {{companyName}} | Our Story',
        suggestedKeywords: ['{{companyName}}', 'about {{companyName}}'],
      },
      {
        contentType: 'service',
        month: 2,
        priority: 'P0',
        titleTemplate: 'Our Services | {{companyName}}',
        suggestedKeywords: ['{{industry}} services', 'professional {{industry}}'],
      },
      {
        contentType: 'blog',
        month: 3,
        priority: 'P1',
        titleTemplate: 'Why Choose {{companyName}} for Your {{industry}} Needs',
        suggestedKeywords: ['best {{industry}}', '{{industry}} benefits'],
      },
      {
        contentType: 'leadMagnet',
        month: 4,
        priority: 'P2',
        titleTemplate: 'Free Guide: {{industry}} Tips from the Experts',
        suggestedKeywords: ['{{industry}} tips', '{{industry}} guide'],
      },
    ],
  },
};

// ============================================================================
// Industry Detection
// ============================================================================

/**
 * Detect industry from website URL and/or content
 */
export const detectIndustry = internalAction({
  args: {
    url: v.optional(v.string()),
    content: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
  },
  handler: async (_, args): Promise<IndustryId> => {
    const textToAnalyze = [args.url || '', args.content || '', args.businessDescription || '']
      .join(' ')
      .toLowerCase();

    // Score each industry by pattern matches
    const scores: { id: IndustryId; score: number }[] = [];

    for (const [id, template] of Object.entries(INDUSTRY_TEMPLATES)) {
      if (id === 'general') continue;

      const score = template.detectionPatterns.reduce((acc, pattern) => {
        const regex = new RegExp(pattern, 'gi');
        const matches = (textToAnalyze.match(regex) || []).length;
        return acc + matches;
      }, 0);

      if (score > 0) {
        scores.push({ id: id as IndustryId, score });
      }
    }

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    // Return highest scored industry or 'general' if no matches
    return scores.length > 0 ? scores[0].id : 'general';
  },
});

// ============================================================================
// Queries
// ============================================================================

/**
 * Get all industry templates
 */
export const getAllIndustries = query({
  args: {},
  handler: async () => {
    return Object.values(INDUSTRY_TEMPLATES).map(({ id, name, description }) => ({
      id,
      name,
      description,
    }));
  },
});

/**
 * Get industry template by ID
 */
export const getIndustryTemplate = internalQuery({
  args: {
    industryId: v.string(),
  },
  handler: async (_, args) => {
    return INDUSTRY_TEMPLATES[args.industryId as IndustryId] || INDUSTRY_TEMPLATES.general;
  },
});

/**
 * Get content plan for an industry
 */
export const getContentPlan = internalQuery({
  args: {
    industryId: v.string(),
  },
  handler: async (_, args) => {
    const template =
      INDUSTRY_TEMPLATES[args.industryId as IndustryId] || INDUSTRY_TEMPLATES.general;
    return template.contentPlan;
  },
});
