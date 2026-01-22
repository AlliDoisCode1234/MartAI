/**
 * Seed Content Script
 *
 * Creates all 17 content types with A+ SEO and GEO scores.
 * Run with: npx tsx scripts/seed/seedContent.ts
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error('Please set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL before running this script.');
}

// All 17 content types
const CONTENT_TYPES = [
  {
    id: 'homepage',
    title: 'Transform Your Business with AI-Powered Solutions',
    keywords: ['AI solutions', 'business transformation', 'automation'],
  },
  {
    id: 'about',
    title: 'Our Story: Building the Future of Marketing',
    keywords: ['about us', 'company history', 'team'],
  },
  {
    id: 'service',
    title: 'Content Marketing Services That Drive Results',
    keywords: ['content marketing', 'SEO services', 'digital marketing'],
  },
  {
    id: 'landing',
    title: 'Get Started with Phoo Today - Free Trial',
    keywords: ['free trial', 'get started', 'signup'],
  },
  {
    id: 'blog',
    title: 'The Ultimate Guide to GEO in 2026',
    keywords: ['GEO', 'generative engine optimization', 'AI search'],
  },
  {
    id: 'blogVersus',
    title: 'Phoo vs Competitors: Complete Comparison',
    keywords: ['comparison', 'alternative', 'vs'],
  },
  {
    id: 'blogVideo',
    title: 'How to Optimize Content for AI Search [Video Guide]',
    keywords: ['video tutorial', 'how to', 'AI optimization'],
  },
  {
    id: 'contentRefresh',
    title: 'Updated: SEO Best Practices for Modern Search',
    keywords: ['SEO best practices', 'updated', 'refresh'],
  },
  {
    id: 'leadMagnet',
    title: 'Free SEO Audit Checklist - 50 Point Review',
    keywords: ['free download', 'SEO audit', 'checklist'],
  },
  {
    id: 'paidProduct',
    title: 'Advanced GEO Masterclass - Premium Course',
    keywords: ['course', 'masterclass', 'training'],
  },
  {
    id: 'areasWeServe',
    title: 'SEO Services in New York City',
    keywords: ['New York', 'NYC SEO', 'local SEO'],
  },
  {
    id: 'employment',
    title: 'Join Our Team - Open Positions',
    keywords: ['careers', 'jobs', 'hiring'],
  },
  {
    id: 'mentorship',
    title: 'SEO Mentorship Program - Learn from Experts',
    keywords: ['mentorship', 'coaching', 'learning'],
  },
  {
    id: 'donate',
    title: 'Support Open Source SEO Tools',
    keywords: ['donate', 'support', 'open source'],
  },
  {
    id: 'events',
    title: 'Upcoming SEO & Marketing Events 2026',
    keywords: ['events', 'webinars', 'conferences'],
  },
  {
    id: 'partner',
    title: 'Partner with Phoo - Agency Program',
    keywords: ['partnership', 'agency', 'reseller'],
  },
  {
    id: 'program',
    title: 'SEO Certification Program - Get Certified',
    keywords: ['certification', 'program', 'training'],
  },
] as const;

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL);

  // Get first project for authenticated user
  console.log('\\n🔍 Finding project to seed...');

  // We need a projectId - get it from args or query
  const projectIdArg = process.argv[2];
  if (!projectIdArg) {
    console.error('Usage: npx tsx scripts/seed/seedContent.ts <projectId>');
    console.error('Get projectId from browser: localStorage.getItem("currentProjectId")');
    process.exit(1);
  }

  console.log(`\\n📝 Seeding ${CONTENT_TYPES.length} content types for project: ${projectIdArg}`);

  let createdCount = 0;
  for (const contentType of CONTENT_TYPES) {
    try {
      // Check if content type already exists
      const existing = await client.query(api.contentPieces.listByProject, {
        projectId: projectIdArg as any,
        limit: 100,
      });

      const alreadyExists = existing?.some((p: any) => p.contentType === contentType.id);

      if (alreadyExists) {
        console.log(`   ⏩ Skipping ${contentType.id} (already exists)`);
        continue;
      }

      // Create content piece
      const pieceId = await client.mutation(api.contentPieces.create, {
        projectId: projectIdArg as any,
        contentType: contentType.id as any,
        title: contentType.title,
        keywords: contentType.keywords,
      });

      // Update with A+ scores and sample content
      await client.mutation(api.contentPieces.update, {
        contentPieceId: pieceId,
        status: 'draft',
        seoScore: 95, // A+ SEO
        geoScore: 92, // A+ GEO
        wordCount: 1200,
        h2Outline: [
          'Introduction',
          'Key Benefits',
          'How It Works',
          'Best Practices',
          'Common Mistakes to Avoid',
          'Case Studies',
          'Frequently Asked Questions',
          'Conclusion',
        ],
        metaTitle: contentType.title.slice(0, 60),
        metaDescription: `Learn about ${contentType.keywords[0]} with our comprehensive guide. Expert insights and actionable tips.`,
      });

      console.log(`   ✅ Created ${contentType.id}: "${contentType.title.slice(0, 40)}..."`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Failed to create ${contentType.id}:`, error);
    }
  }

  console.log(
    `\\n✨ Done! Created ${createdCount}/${CONTENT_TYPES.length} content pieces with A+ scores.`
  );
  console.log('\\n📊 Phoo Rating should now show GEO Readiness component.');
}

main().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
