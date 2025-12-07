const { ConvexHttpClient } = require('convex/browser');
const { api } = require('../convex/_generated/api');
require('dotenv').config({ path: '.env.local' });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const SEED_KEYWORDS = [
  {
    keyword: 'marketing automation software',
    searchVolume: 12000,
    difficulty: 65,
    intent: 'commercial',
  },
  { keyword: 'email marketing tools', searchVolume: 45000, difficulty: 72, intent: 'commercial' },
  {
    keyword: 'best crm for small business',
    searchVolume: 8000,
    difficulty: 58,
    intent: 'transactional',
  },
  {
    keyword: 'seo tools for beginners',
    searchVolume: 5400,
    difficulty: 45,
    intent: 'informational',
  },
  {
    keyword: 'content marketing strategy',
    searchVolume: 3200,
    difficulty: 50,
    intent: 'informational',
  },
  { keyword: 'social media scheduler', searchVolume: 15000, difficulty: 60, intent: 'commercial' },
  {
    keyword: 'growth hacking techniques',
    searchVolume: 2400,
    difficulty: 40,
    intent: 'informational',
  },
  {
    keyword: 'ppc management services',
    searchVolume: 1800,
    difficulty: 75,
    intent: 'transactional',
  },
  { keyword: 'saas pricing models', searchVolume: 1000, difficulty: 35, intent: 'informational' },
  {
    keyword: 'lead generation strategies',
    searchVolume: 6600,
    difficulty: 55,
    intent: 'informational',
  },
  {
    keyword: 'digital marketing agency',
    searchVolume: 90000,
    difficulty: 85,
    intent: 'transactional',
  },
  { keyword: 'google ads tutorial', searchVolume: 12000, difficulty: 30, intent: 'informational' },
  { keyword: 'facebook ads cost', searchVolume: 8800, difficulty: 42, intent: 'informational' },
  {
    keyword: 'influencer marketing platform',
    searchVolume: 5000,
    difficulty: 68,
    intent: 'commercial',
  },
  {
    keyword: 'affiliate marketing guide',
    searchVolume: 22000,
    difficulty: 55,
    intent: 'informational',
  },
  {
    keyword: 'artificial intelligence in marketing',
    searchVolume: 1500,
    difficulty: 48,
    intent: 'informational',
  },
  { keyword: 'chatbot software', searchVolume: 25000, difficulty: 70, intent: 'commercial' },
  {
    keyword: 'customer retention strategies',
    searchVolume: 2900,
    difficulty: 45,
    intent: 'informational',
  },
  { keyword: 'landing page builder', searchVolume: 33000, difficulty: 74, intent: 'commercial' },
  { keyword: 'web analytics tools', searchVolume: 6000, difficulty: 52, intent: 'commercial' },
];

async function seed() {
  console.log('Seeding keyword library...');
  try {
    // Note: seedKeywords is an action that calls OpenAI for embeddings
    await client.action(api.seo.library.seedKeywords, { keywords: SEED_KEYWORDS });
    console.log('Successfully seeded library with 20 keywords.');
  } catch (error) {
    console.error('Error seeding library:', error);
  }
}

seed();
