const { ConvexHttpClient } = require('convex/browser');
const { api } = require('../convex/_generated/api');
require('dotenv').config({ path: '.env.local' });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const MARTAI_KEYWORDS = [
  // High Intent / Commercial
  { keyword: 'autonomous seo agent', searchVolume: 1200, difficulty: 45, intent: 'commercial' },
  { keyword: 'ai marketing employee', searchVolume: 800, difficulty: 35, intent: 'commercial' },
  {
    keyword: 'semrush alternative for startups',
    searchVolume: 2500,
    difficulty: 65,
    intent: 'commercial',
  },
  {
    keyword: 'programmatic seo software',
    searchVolume: 1800,
    difficulty: 55,
    intent: 'commercial',
  },
  {
    keyword: 'automated content strategy',
    searchVolume: 3200,
    difficulty: 50,
    intent: 'commercial',
  },
  { keyword: 'ai copywriting agent', searchVolume: 5000, difficulty: 60, intent: 'commercial' },
  {
    keyword: 'best ai seo tools 2025',
    searchVolume: 15000,
    difficulty: 40,
    intent: 'informational',
  },

  // Informational / Problem Aware
  { keyword: 'how to automate seo', searchVolume: 8000, difficulty: 45, intent: 'informational' },
  {
    keyword: 'replace marketing agency with ai',
    searchVolume: 500,
    difficulty: 30,
    intent: 'informational',
  },
  {
    keyword: 'reduce content marketing cost',
    searchVolume: 1200,
    difficulty: 35,
    intent: 'informational',
  },
  {
    keyword: 'scale content production ai',
    searchVolume: 2400,
    difficulty: 42,
    intent: 'informational',
  },

  // Competitor Comparison
  { keyword: 'semrush vs martai', searchVolume: 10, difficulty: 10, intent: 'commercial' }, // Future proofing
  { keyword: 'jasper ai vs semantic seo', searchVolume: 400, difficulty: 50, intent: 'commercial' },
  { keyword: 'surfer seo alternative', searchVolume: 6000, difficulty: 55, intent: 'commercial' },
];

async function seed() {
  console.log('Seeding MartAI-specific keywords...');
  try {
    await client.action(api.seo.library.seedKeywords, { keywords: MARTAI_KEYWORDS });
    console.log(`Successfully seeded library with ${MARTAI_KEYWORDS.length} targeted keywords.`);
  } catch (error) {
    console.error('Error seeding library:', error);
  }
}

seed();
