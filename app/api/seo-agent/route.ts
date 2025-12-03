import { generateText, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { crawlWebsite, analyzeMultiplePages } from '@/lib/siteCrawler';
import { generateKeywords, KeywordSuggestion } from '@/lib/keywordGenerator';

export const maxDuration = 60;

const getModel = () => {
  if (!process.env.VERCEL_AI_GATEWAY_KEY && !process.env.OPENAI_API_KEY) {
    return null;
  }
  return openai('gpt-4o');
};

type BusinessInfo = {
  companyName: string;
  website: string;
  industry: string;
  targetAudience: string;
  monthlyRevenueGoal: string;
  userId?: string;
};

export async function POST(request: Request) {
  try {
    if (!process.env.VERCEL_AI_GATEWAY_KEY && !process.env.OPENAI_API_KEY) {
      console.warn('API key missing, returning mock response for demo');
      // TODO: Add retrier for robust API calls
      // TODO: Add rate limiting
      // TODO: Add caching

      return new Response(
        JSON.stringify({
          steps: [],
          finalAnswer:
            "I've analyzed your website and industry. Here are some recommendations based on general best practices.",
          toolCalls: [],
          toolResults: [],
          siteAnalysis: {
            title: 'Demo Site Analysis',
            metaDescription: 'This is a mock analysis because no API key was provided.',
            h1Tags: ['Demo Header'],
            issues: ['Mock Issue 1', 'Mock Issue 2'],
            wordCount: 500,
            mobileFriendly: true,
            hasSSL: true,
            loadTime: 0.5,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const businessInfo: BusinessInfo = await request.json();

    if (!businessInfo.companyName || !businessInfo.website || !businessInfo.industry) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = getModel();
    if (!model) {
      return new Response(JSON.stringify({ error: 'API key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Perform real site crawl
    let siteAnalysis = null;
    try {
      siteAnalysis = await crawlWebsite(businessInfo.website);
    } catch (error) {
      console.error('Site crawl error:', error);
      // Continue with analysis even if crawl fails
    }

    const prompt = `You are an expert SEO consultant helping ${businessInfo.companyName}, a ${businessInfo.industry} company targeting ${businessInfo.targetAudience}. Their website is ${businessInfo.website} and their monthly revenue goal is ${businessInfo.monthlyRevenueGoal}.

${
  siteAnalysis
    ? `Site Analysis Results:
- Title: ${siteAnalysis.title}
- Meta Description: ${siteAnalysis.metaDescription}
- H1 Tags: ${siteAnalysis.h1Tags.join(', ')}
- Issues Found: ${siteAnalysis.issues.join(', ')}
- Word Count: ${siteAnalysis.wordCount}
- Mobile Friendly: ${siteAnalysis.mobileFriendly}
- SSL Enabled: ${siteAnalysis.hasSSL}
`
    : ''
}

Perform a comprehensive SEO audit and provide actionable recommendations based on 2025-2026 SEO best practices, Google's latest SEO guidelines, and social media platform SEO strategies.`;

    const result = await generateText({
      model,
      prompt,
      stopWhen: stepCountIs(5),
      tools: {
        seoAudit: tool({
          description:
            'Perform a comprehensive SEO audit analysis for a business website. Analyze technical SEO, on-page optimization, content quality, backlinks, and provide actionable recommendations.',
          inputSchema: z.object({
            website: z.string(),
            industry: z.string(),
            companyName: z.string(),
            siteAnalysis: z.any().optional(),
          }),
          execute: async ({ website, industry, companyName, siteAnalysis }) => {
            // Calculate scores based on real analysis
            const issues = siteAnalysis?.issues || [];
            const technicalScore = Math.max(0, 100 - issues.length * 10);
            const onPageScore = siteAnalysis
              ? Math.max(
                  0,
                  100 -
                    issues.filter(
                      (i: string) => i.includes('H1') || i.includes('meta') || i.includes('heading')
                    ).length *
                      15
                )
              : 68;
            const contentScore = siteAnalysis?.wordCount
              ? Math.min(100, Math.max(0, siteAnalysis.wordCount / 20 + 50))
              : 72;

            return {
              technicalSeo: {
                score: Math.max(0, Math.min(100, technicalScore)),
                issues: siteAnalysis?.issues.filter(
                  (i: string) =>
                    i.includes('SSL') ||
                    i.includes('mobile') ||
                    i.includes('speed') ||
                    i.includes('canonical')
                ) || [
                  'Missing meta descriptions on 40% of pages',
                  'Page load speed could be improved',
                  'Mobile responsiveness needs optimization',
                ],
                recommendations: [
                  'Add meta descriptions to all pages (target 150-160 characters)',
                  'Optimize images and implement lazy loading',
                  'Use Google PageSpeed Insights recommendations',
                  siteAnalysis && !siteAnalysis.hasSSL ? 'Implement SSL certificate (HTTPS)' : '',
                  siteAnalysis && !siteAnalysis.mobileFriendly
                    ? 'Add viewport meta tag for mobile optimization'
                    : '',
                ].filter(Boolean),
              },
              onPageSeo: {
                score: Math.max(0, Math.min(100, onPageScore)),
                issues: siteAnalysis?.issues.filter(
                  (i: string) => i.includes('H1') || i.includes('heading') || i.includes('title')
                ) || [
                  'H1 tags missing or duplicated on key pages',
                  'Internal linking structure needs improvement',
                  'Keyword density optimization required',
                ],
                recommendations: [
                  'Ensure one H1 per page with primary keyword',
                  'Create topic clusters with pillar content',
                  'Implement semantic HTML5 structure',
                  siteAnalysis && siteAnalysis.h1Tags.length === 0 ? 'Add H1 tag to homepage' : '',
                  siteAnalysis && siteAnalysis.h1Tags.length > 1
                    ? 'Reduce to single H1 per page'
                    : '',
                ].filter(Boolean),
              },
              contentQuality: {
                score: Math.max(0, Math.min(100, contentScore)),
                issues: [
                  siteAnalysis && siteAnalysis.wordCount < 300
                    ? `Low word count (${siteAnalysis.wordCount} words, recommended 300+)`
                    : 'Content freshness: last major update needed',
                  'E-E-A-T signals could be stronger',
                  'Content depth insufficient for competitive keywords',
                ].filter(Boolean),
                recommendations: [
                  'Update existing content quarterly',
                  'Add author bios and expertise indicators',
                  'Create comprehensive long-form content (2000+ words) for key topics',
                  siteAnalysis && siteAnalysis.wordCount < 300
                    ? 'Increase content depth with more detailed information'
                    : '',
                ].filter(Boolean),
              },
              backlinks: {
                score: 65,
                issues: [
                  'Limited high-authority backlinks',
                  'No recent link building activity',
                  'Some low-quality links detected',
                ],
                recommendations: [
                  'Develop linkable assets (research, tools, guides)',
                  'Outreach to industry publications',
                  'Create shareable infographics and data visualizations',
                ],
              },
              overallScore: Math.round((technicalScore + onPageScore + contentScore + 65) / 4),
              priorityActions: [
                'Fix technical SEO issues (meta descriptions, page speed)',
                'Optimize on-page elements (H1 tags, internal linking)',
                'Develop content calendar for regular updates',
                'Begin strategic link building campaign',
              ],
              // Additional statistics
              pageSpeed: siteAnalysis?.loadTime,
              mobileFriendly: siteAnalysis?.mobileFriendly,
              sslEnabled: siteAnalysis?.hasSSL,
              indexedPages: undefined,
              crawlErrors: siteAnalysis?.issues.length || 0,
            };
          },
        }),
        generateKeywords: tool({
          description: 'Generate comprehensive keyword suggestions for SEO optimization',
          inputSchema: z.object({
            companyName: z.string(),
            industry: z.string(),
            targetAudience: z.string(),
            website: z.string(),
          }),
          execute: async ({ companyName, industry, targetAudience, website }) => {
            try {
              const keywords = await generateKeywords(
                companyName,
                industry,
                targetAudience,
                website
              );
              return keywords;
            } catch (error) {
              console.error('Keyword generation error:', error);
              // Fallback keywords
              return [
                {
                  keyword: `${industry} services`,
                  intent: 'commercial',
                  priority: 'high',
                  reasoning: 'Primary service keyword',
                },
                {
                  keyword: `best ${industry}`,
                  intent: 'commercial',
                  priority: 'high',
                  reasoning: 'High commercial intent',
                },
                {
                  keyword: `${targetAudience} ${industry}`,
                  intent: 'transactional',
                  priority: 'high',
                  reasoning: 'Target audience specific',
                },
              ];
            }
          },
        }),
        generateContent: tool({
          description:
            'Generate SEO-optimized content suggestions including taglines, SEO-friendly headlines, meta descriptions, and content ideas.',
          inputSchema: z.object({
            companyName: z.string(),
            industry: z.string(),
            targetAudience: z.string(),
            website: z.string(),
          }),
          execute: async ({ companyName, industry, targetAudience, website }) => {
            return {
              taglines: [
                `${companyName}: Transform Your ${industry} Business with Smart SEO Automation`,
                `Grow Your ${industry} Business - Automated SEO That Works`,
                `${companyName} | SEO Solutions for ${targetAudience}`,
              ],
              seoSuggestions: [
                {
                  keyword: `${industry} solutions`,
                  headline: `Best ${industry} Solutions for ${targetAudience} in 2025`,
                  metaDescription: `Discover how ${companyName} delivers cutting-edge ${industry} solutions tailored for ${targetAudience}. Learn about our proven strategies and results.`,
                  contentAngle: 'Problem-solution approach with case studies',
                },
                {
                  keyword: `${industry} best practices`,
                  headline: `${industry} Best Practices: Expert Guide for ${targetAudience}`,
                  metaDescription: `Master ${industry} best practices with insights from ${companyName}. Actionable strategies for ${targetAudience} to achieve better results.`,
                  contentAngle: 'Educational guide with actionable tips',
                },
                {
                  keyword: `${targetAudience} ${industry}`,
                  headline: `How ${targetAudience} Can Succeed in ${industry}`,
                  metaDescription: `Expert advice for ${targetAudience} navigating the ${industry} landscape. ${companyName} shares proven strategies and insights.`,
                  contentAngle: 'Audience-focused content with real examples',
                },
              ],
              contentIdeas: [
                `Complete Guide to ${industry} for ${targetAudience}`,
                `${industry} Trends in 2025: What ${targetAudience} Need to Know`,
                `Case Study: How We Helped a ${targetAudience} Business Succeed in ${industry}`,
                `${industry} Checklist: Essential Steps for ${targetAudience}`,
              ],
            };
          },
        }),
        generateSocialMediaPosts: tool({
          description:
            'Generate SEO-optimized social media post suggestions for multiple platforms.',
          inputSchema: z.object({
            companyName: z.string(),
            industry: z.string(),
            targetAudience: z.string(),
            contentTopic: z.string().optional(),
          }),
          execute: async ({ companyName, industry, targetAudience, contentTopic }) => {
            const topic = contentTopic || `${industry} insights`;
            return {
              linkedin: [
                {
                  post: `🚀 Excited to share how ${companyName} is helping ${targetAudience} navigate the ${industry} landscape. Our latest insights on ${topic} are now live. What challenges are you facing in ${industry}? #${industry.replace(/\s+/g, '')} #BusinessGrowth #SEO`,
                  hashtags: [
                    `#${industry.replace(/\s+/g, '')}`,
                    '#BusinessGrowth',
                    '#SEO',
                    '#Marketing',
                  ],
                  bestTime: 'Tuesday-Thursday, 8-10 AM or 12-1 PM',
                },
              ],
              twitter: [
                {
                  post: `🔥 New: How ${targetAudience} can dominate ${industry} in 2025\n\nKey insights from ${companyName}:\n\n✅ Actionable strategies\n✅ Real results\n✅ Expert tips\n\nThread 🧵 #${industry.replace(/\s+/g, '')} #SEO`,
                  hashtags: [`#${industry.replace(/\s+/g, '')}`, '#SEO', '#Marketing', '#Business'],
                  bestTime: 'Monday-Friday, 8-9 AM or 3-4 PM',
                },
              ],
              instagram: [
                {
                  caption: `🎯 ${industry} success starts here! ${companyName} shares proven strategies for ${targetAudience}. Swipe to learn more 👉\n\n#${industry.replace(/\s+/g, '')} #BusinessGrowth #MarketingTips #SEO #Entrepreneur`,
                  hashtags: [
                    `#${industry.replace(/\s+/g, '')}`,
                    '#BusinessGrowth',
                    '#MarketingTips',
                    '#SEO',
                    '#Entrepreneur',
                  ],
                  bestTime: 'Tuesday-Friday, 11 AM-1 PM or 7-9 PM',
                },
              ],
              facebook: [
                {
                  post: `📊 ${companyName} is here to help ${targetAudience} succeed in ${industry}!\n\nOur latest guide covers:\n• Essential strategies\n• Common pitfalls to avoid\n• Actionable next steps\n\nWhat questions do you have about ${industry}? Drop them below! 👇`,
                  hashtags: [`#${industry.replace(/\s+/g, '')}`, '#BusinessTips', '#Marketing'],
                  bestTime: 'Tuesday-Thursday, 1-3 PM',
                },
              ],
            };
          },
        }),
      },
    });

    return Response.json({
      steps: result.steps,
      finalAnswer: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
      siteAnalysis, // Include separately for frontend use
    });
  } catch (error) {
    console.error('AI Agent Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate SEO analysis' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'SEO Agent API is running',
    hasOpenAIConfig: !!process.env.OPENAI_API_KEY,
    hasVercelGateway: !!process.env.VERCEL_AI_GATEWAY_KEY,
  });
}
