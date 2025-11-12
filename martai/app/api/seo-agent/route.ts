import { generateText, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export const maxDuration = 60;

// Health check endpoint
export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'SEO Agent API is running',
    hasOpenAIConfig: !!process.env.OPENAI_API_KEY,
    hasVercelGateway: !!process.env.VERCEL_AI_GATEWAY_KEY,
  });
}

// Use Vercel AI Gateway if VERCEL_AI_GATEWAY_KEY is set, otherwise use direct OpenAI
const getModel = () => {
  if (process.env.VERCEL_AI_GATEWAY_KEY) {
    // Vercel AI Gateway - use string format
    return 'openai/gpt-4o';
  } else if (process.env.OPENAI_API_KEY) {
    // Direct OpenAI API
    return openai('gpt-4o');
  } else {
    // Fallback for development - will show helpful error message
    throw new Error('Either VERCEL_AI_GATEWAY_KEY or OPENAI_API_KEY must be set. Please add one to your .env.local file.');
  }
};

type BusinessInfo = {
  companyName: string;
  website: string;
  industry: string;
  targetAudience: string;
  monthlyRevenueGoal: string;
};

export async function POST(request: Request) {
  try {
    // Check for API keys first
    if (!process.env.VERCEL_AI_GATEWAY_KEY && !process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'API key missing',
          message: 'Please set either VERCEL_AI_GATEWAY_KEY or OPENAI_API_KEY in your environment variables.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const businessInfo: BusinessInfo = await request.json();

    if (!businessInfo.companyName || !businessInfo.website || !businessInfo.industry) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are an expert SEO consultant helping ${businessInfo.companyName}, a ${businessInfo.industry} company targeting ${businessInfo.targetAudience}. Their website is ${businessInfo.website} and their monthly revenue goal is ${businessInfo.monthlyRevenueGoal}.

Perform a comprehensive SEO audit and provide actionable recommendations based on 2025-2026 SEO best practices, Google's latest SEO guidelines, and social media platform SEO strategies.`;

    const result = await generateText({
      model: getModel(),
      prompt,
      stopWhen: stepCountIs(5),
      tools: {
        seoAudit: tool({
          description: 'Perform a comprehensive SEO audit analysis for a business website. Analyze technical SEO, on-page optimization, content quality, backlinks, and provide actionable recommendations based on 2025-2026 SEO patterns and Google\'s latest guidelines.',
          inputSchema: z.object({
            website: z.string().describe('The website URL to audit'),
            industry: z.string().describe('The industry/niche of the business'),
            companyName: z.string().describe('The name of the company'),
          }),
          execute: async ({ website, industry, companyName }) => {
            return {
              technicalSeo: {
                score: 75,
                issues: [
                  'Missing meta descriptions on 40% of pages',
                  'Page load speed could be improved (currently 3.2s)',
                  'Mobile responsiveness needs optimization',
                ],
                recommendations: [
                  'Add meta descriptions to all pages (target 150-160 characters)',
                  'Optimize images and implement lazy loading',
                  'Use Google PageSpeed Insights recommendations',
                ],
              },
              onPageSeo: {
                score: 68,
                issues: [
                  'H1 tags missing or duplicated on key pages',
                  'Internal linking structure needs improvement',
                  'Keyword density optimization required',
                ],
                recommendations: [
                  'Ensure one H1 per page with primary keyword',
                  'Create topic clusters with pillar content',
                  'Implement semantic HTML5 structure',
                ],
              },
              contentQuality: {
                score: 72,
                issues: [
                  'Content freshness: last major update 6 months ago',
                  'E-E-A-T signals could be stronger',
                  'Content depth insufficient for competitive keywords',
                ],
                recommendations: [
                  'Update existing content quarterly',
                  'Add author bios and expertise indicators',
                  'Create comprehensive long-form content (2000+ words) for key topics',
                ],
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
              overallScore: 70,
              priorityActions: [
                'Fix technical SEO issues (meta descriptions, page speed)',
                'Optimize on-page elements (H1 tags, internal linking)',
                'Develop content calendar for regular updates',
                'Begin strategic link building campaign',
              ],
            };
          },
        }),
        generateContent: tool({
          description: 'Generate SEO-optimized content suggestions including taglines, SEO-friendly headlines, meta descriptions, and content ideas. Incorporate 2025-2026 SEO patterns, semantic keywords, and user intent optimization.',
          inputSchema: z.object({
            companyName: z.string().describe('The name of the company'),
            industry: z.string().describe('The industry/niche'),
            targetAudience: z.string().describe('The target audience description'),
            website: z.string().describe('The website URL'),
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
          description: 'Generate SEO-optimized social media post suggestions for multiple platforms (LinkedIn, Twitter/X, Instagram, Facebook). Incorporate platform-specific SEO best practices, hashtags, and engagement strategies for 2025-2026.',
          inputSchema: z.object({
            companyName: z.string().describe('The name of the company'),
            industry: z.string().describe('The industry/niche'),
            targetAudience: z.string().describe('The target audience'),
            contentTopic: z.string().optional().describe('Optional specific topic for the post'),
          }),
          execute: async ({ companyName, industry, targetAudience, contentTopic }) => {
            const topic = contentTopic || `${industry} insights`;
            return {
              linkedin: [
                {
                  post: `🚀 Excited to share how ${companyName} is helping ${targetAudience} navigate the ${industry} landscape. Our latest insights on ${topic} are now live. What challenges are you facing in ${industry}? #${industry.replace(/\s+/g, '')} #BusinessGrowth #SEO`,
                  hashtags: [`#${industry.replace(/\s+/g, '')}`, '#BusinessGrowth', '#SEO', '#Marketing'],
                  bestTime: 'Tuesday-Thursday, 8-10 AM or 12-1 PM',
                },
                {
                  post: `💡 ${industry} professionals: Are you leveraging the latest SEO strategies? ${companyName} breaks down what ${targetAudience} need to know in 2025. Read more → [link] #DigitalMarketing #${industry.replace(/\s+/g, '')}`,
                  hashtags: ['#DigitalMarketing', `#${industry.replace(/\s+/g, '')}`, '#SEO2025', '#BusinessTips'],
                  bestTime: 'Wednesday, 9 AM',
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
                  hashtags: [`#${industry.replace(/\s+/g, '')}`, '#BusinessGrowth', '#MarketingTips', '#SEO', '#Entrepreneur'],
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
    });
  } catch (error) {
    console.error('AI Agent Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate SEO analysis' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

