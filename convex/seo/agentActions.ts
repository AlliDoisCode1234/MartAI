'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { crawlWebsite } from '../../lib/siteCrawler';
import { generateKeywords } from '../../lib/keywordGenerator';
import { IntelligenceService } from '../lib/services/intelligence';

export const runSEOAgent = action({
  args: {
    website: v.string(),
    companyName: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    monthlyRevenueGoal: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`[SEO Agent] Starting analysis for ${args.companyName} (${args.website})`);

    // 1. Crawl Website
    let siteAnalysis: any;
    try {
      siteAnalysis = await crawlWebsite(args.website);
    } catch (error) {
      console.error('[SEO Agent] Crawl failed:', error);
      // Fallback or partial analysis if crawl fails
      // We'll proceed with null analysis to let AI handle general advice
    }

    // 2. Score Calculation (Deterministic)
    const issues = siteAnalysis?.issues ?? [];

    const calculateTechnicalScore = () => {
      if (!siteAnalysis) return 50; // default for no crawl
      const baseScore = 100;
      const deductions = issues.length * 10;
      return Math.max(0, baseScore - deductions);
    };

    const calculateOnPageScore = () => {
      if (!siteAnalysis) return 50;
      const critialIssues = issues.filter(
        (i: string) => i.includes('H1') || i.includes('meta') || i.includes('heading')
      ).length;
      return Math.max(0, 100 - critialIssues * 15);
    };

    const calculateContentScore = () => {
      if (!siteAnalysis) return 50;
      const wordCount = siteAnalysis.wordCount;
      return Math.min(100, Math.max(0, wordCount / 20 + 50));
    };

    const technicalScore = calculateTechnicalScore();
    const onPageScore = calculateOnPageScore();
    const contentScore = calculateContentScore();
    const overallScore = Math.round((technicalScore + onPageScore + contentScore + 65) / 4);

    // 3. Generate Keywords
    let keywords: any[] = [];
    try {
      keywords = await generateKeywords(
        args.companyName,
        args.industry,
        args.targetAudience,
        args.website
      );
    } catch (e) {
      console.error('[SEO Agent] Keyword generation failed:', e);
    }

    // 4. Intelligence Service (Mart Persona)
    const service = new IntelligenceService(ctx);

    const context = `
    Business Info:
    Name: ${args.companyName}
    Industry: ${args.industry}
    Target Audience: ${args.targetAudience}
    Revenue Goal: ${args.monthlyRevenueGoal}
    
    Site Analysis Data:
    ${
      siteAnalysis
        ? JSON.stringify(
            {
              title: siteAnalysis.title,
              metaDescription: siteAnalysis.metaDescription,
              h1Tags: siteAnalysis.h1Tags,
              wordCount: siteAnalysis.wordCount,
              loadTime: siteAnalysis.loadTime,
              mobileFriendly: siteAnalysis.mobileFriendly,
              issues: siteAnalysis.issues,
            },
            null,
            2
          )
        : 'Crawl failed or skipped.'
    }

    Generated Keywords:
    ${keywords.map((k) => `- ${k.keyword} (${k.intent})`).join('\n')}

    Computed Scores:
    Technical: ${technicalScore}
    OnPage: ${onPageScore}
    Content: ${contentScore}
    Overall: ${overallScore}
    `;

    const prompt = `Perform a comprehensive executive SEO Audit for this client.
    
    Analyze the provided technical data and keyword opportunities.
    Provide actionable recommendations prioritized by impact on their revenue goal (${args.monthlyRevenueGoal}).
    
    Be concise, professional, but authoritative. Use the "Mart" persona (Senior SEO Analyst).
    
    Output Format:
    Return a valid JSON object ONLY, with this structure:
    {
      "executiveSummary": "string",
      "top3Priorities": ["string", "string", "string"],
      "contentStrategy": "string",
      "technicalRecommendations": ["string"],
      "marketingAngle": "string"
    }
    `;

    const result = await service.generate(prompt, context, {
      persona: 'Mart',
      temperature: 0.7,
      useReflection: true, // Self-correct to ensure high quality
    });

    let aiAnalysis;
    try {
      // clean up code blocks if persistent
      const jsonText = result.content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      aiAnalysis = JSON.parse(jsonText);
    } catch (e) {
      console.error('[SEO Agent] Failed to parse AI JSON:', e);
      // Fallback text structure
      aiAnalysis = {
        executiveSummary: result.content,
        top3Priorities: ['Review technical issues', 'Update content', 'Build backlinks'],
        contentStrategy: 'Focus on high-intent keywords.',
        technicalRecommendations: issues.slice(0, 3) || ['Check site speed'],
        marketingAngle: 'Authority based approach',
      };
    }

    return {
      siteAnalysis,
      scores: {
        technical: technicalScore,
        onPage: onPageScore,
        content: contentScore,
        overall: overallScore,
      },
      keywords,
      aiAnalysis,
      traceId: result.traceId,
    };
  },
});
