import { action } from '../_generated/server';
import { internal } from '../_generated/api';
import { v } from 'convex/values';
import { NormalizedKeywordMetric } from './dataForSeo';


/**
 * DataForSEO Integration Testing Suite
 * 
 * Used to validate the `dataForSeo.ts` architecture, ensure Nomenclature mappings
 * conform to SEAN's interface, and test graceful mock degradation BEFORE
 * actual DataForSEO API keys and credits are consumed.
 */
export const runIntegrationDiagnostics = action({
  args: {
    testKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<{ status: string; mode?: string; gapAnalysis: string; dataSample?: any; errors?: string[]; message?: string }> => {
    console.log('[DataForSEO Test] Starting Integration Diagnostic Run...');
    const keywordsToTest = args.testKeywords || ['b2b saas marketing', 'enterprise content strategy'];

    try {
      // 1. Trigger the main workflow Action (using Mock degradation if no env vars exist).
      console.log(`[DataForSEO Test] Calling getKeywordIdeas for: ${keywordsToTest.join(', ')}`);
      
      const results = (await ctx.runAction(internal.integrations.dataForSeo.getKeywordIdeas, {
        keywords: keywordsToTest,
        locationName: 'United States',
        languageName: 'English',
      })) as NormalizedKeywordMetric[];

      // 2. Perform Gap Analysis on schema response (SEAN's Rule)
      console.log('[DataForSEO Test] Analyzing SEAN Nomenclature Parity...');
      const schemaErrors: string[] = [];

      results.forEach((item: NormalizedKeywordMetric, index: number) => {
        if (typeof item.keyword !== 'string') schemaErrors.push(`[Item ${index}] Missing string 'keyword'`);
        if (typeof item.monthlySearches !== 'number') schemaErrors.push(`[Item ${index}] Missing number 'monthlySearches' (Mapped from search_volume)`);
        if (typeof item.adCostCpc !== 'number') schemaErrors.push(`[Item ${index}] Missing number 'adCostCpc' (Mapped from cpc)`);
        if (!['LOW', 'MEDIUM', 'HIGH', 'UNKNOWN'].includes(item.paidCompetition)) {
           schemaErrors.push(`[Item ${index}] Invalid 'paidCompetition' enum: ${item.paidCompetition}`);
        }
        if (typeof item.rankingDifficulty !== 'number') schemaErrors.push(`[Item ${index}] Missing number 'rankingDifficulty' (Mapped from keyword_difficulty)`);
      });

      if (schemaErrors.length > 0) {
        console.error('[DataForSEO Test] ❌ SCHEMA VALIDATION FAILED:', schemaErrors);
        return {
          status: 'Failed',
          gapAnalysis: 'Schema Validation Mismatch',
          errors: schemaErrors,
        };
      }

      console.log('[DataForSEO Test] ✅ SCHEMA VALIDATION PASSED');
      
      // Check environmental modes
      const hasRealKeys = !!process.env.DATAFORSEO_LOGIN && !!process.env.DATAFORSEO_PASSWORD;

      return {
        status: 'Pass',
        mode: hasRealKeys ? 'LIVE (Real Credits Consumed)' : 'MOCK FALLBACK (Safe degradation)',
        gapAnalysis: '100% Feature Readiness established in architecture',
        dataSample: results,
      };

    } catch (error: any) {
      console.error('[DataForSEO Test] 🚨 FATAL INFRASTRUCTURE ERROR:', error);
      return {
        status: 'Error',
        gapAnalysis: 'Exception caught during execution',
        message: error.message || String(error),
      };
    }
  },
});
