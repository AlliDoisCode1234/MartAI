const { execSync } = require('child_process');

function runConvexAction(action, args) {
  const argsStr = JSON.stringify(args).replace(/"/g, '\\"');
  try {
    const cmd = `npx convex run ${action} "${argsStr}"`;
    // console.log(`Running: ${cmd}`);
    const output = execSync(cmd, { encoding: 'utf-8' });
    return output;
  } catch (e) {
    if (e.stdout) {
      return e.stdout;
    }
    console.error(`Failed to run ${action}:`, e.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🐶 STARTING DOGFOODING VERIFICATION 🐶');

  // 1. Create Project via Seed
  console.log('\n1. Creating "Semrush Dogfood" Project...');
  const seedArgs = {
    name: 'Semrush Dogfood',
    websiteUrl: 'https://www.semrush.com',
  };

  const seedOutput = runConvexAction('projects/projects:createTestProject', seedArgs);

  // Robustly extract the Project ID from CLI output
  const returnMarker = 'Return value:';
  const returnIndex = seedOutput.lastIndexOf(returnMarker);

  let projectId = '';
  if (returnIndex !== -1) {
    let rawId = seedOutput.substring(returnIndex + returnMarker.length).trim();
    projectId = rawId.replace(/^"|"$/g, '');
  } else {
    const idMatch = seedOutput.match(/[a-zA-Z0-9]{32,}/);
    if (idMatch) projectId = idMatch[0];
  }

  if (!projectId || projectId.length < 10) {
    console.error('Failed to get valid Project ID from seed output');
    console.log('Seed Output:', seedOutput);
    process.exit(1);
  }
  console.log(`✅ Project Created! ID: ${projectId}`);

  // 2. Run Agent
  console.log('\n2. Running SEO Agent on https://www.semrush.com ...');
  const agentArgs = {
    website: 'https://www.semrush.com',
    companyName: 'Semrush',
    industry: 'Marketing Tech',
    targetAudience: 'Marketers, Agencies',
    monthlyRevenueGoal: '$30M',
  };

  /*
   * REAL AGENT EXECUTION (Costly) - Commented out to save OpenAI credits.
   * To re-enable, uncomment this block and remove the mock data below.
   */
  /*
  const agentOutputRaw = runConvexAction('seo/agentActions:runSEOAgent', agentArgs);
  console.log('[DEBUG] Agent execution finished. Parsing output...');

  // Parsing logic would go here
  // ...
  */

  console.log('⚠️ USING MOCK AGENT DATA (Saving Credits) ⚠️');
  // Mocking the EXACT return structure of runSEOAgent
  const agentResult = {
    scores: { overall: 85, technical: 90, onPage: 80, content: 85 },
    keywords: [
      { keyword: 'test keyword', intent: 'commercial' },
      { keyword: 'audit tool', intent: 'transactional' },
    ],
    siteAnalysis: {
      issues: ['Mock Issue: Missing H1', 'Mock Issue: Slow Load'],
      loadTime: 1200,
      mobileFriendly: true,
    },
    aiAnalysis: {
      technicalRecommendations: ['Fix Mock Issue 1', 'Optimize Images'],
      contentStrategy: 'Focus on high-value mock content strategy.',
      top3Priorities: ['Fix Meta Tags', 'Improve Speed', 'Build Backlinks'],
    },
    traceId: 'mock-trace-id-12345',
  };

  console.log('✅ Agent run successful! (MOCKED)');
  console.log(`   Overall Score: ${agentResult.scores.overall}`);
  console.log(`   Keywords Found: ${agentResult.keywords ? agentResult.keywords.length : 0}`);

  // 3. Persist Results
  console.log('\n3. Persisting Audit Results...');
  const siteAnalysis = agentResult.siteAnalysis || {};
  const aiAnalysis = agentResult.aiAnalysis || {};
  const scores = agentResult.scores || {};

  const auditArgs = {
    projectId: projectId,
    website: 'https://www.semrush.com',
    overallScore: scores.overall || 0,
    technicalSeo: {
      score: scores.technical || 0,
      issues: siteAnalysis.issues || [],
      recommendations: aiAnalysis.technicalRecommendations || [],
    },
    onPageSeo: {
      score: scores.onPage || 0,
      issues: [],
      recommendations: [],
    },
    contentQuality: {
      score: scores.content || 0,
      issues: [],
      recommendations: aiAnalysis.contentStrategy ? [aiAnalysis.contentStrategy] : [],
    },
    backlinks: {
      score: 50,
      issues: [],
      recommendations: [],
    },
    priorityActions: aiAnalysis.top3Priorities || [],
    pageSpeed: siteAnalysis.loadTime || 0,
    mobileFriendly: siteAnalysis.mobileFriendly || false,
    sslEnabled: true,
  };

  runConvexAction('seo/seoAudits:createAudit', auditArgs);

  // 4. Verify Persistence
  console.log('\n4. Verifying Persistence...');
  const verifyOutput = runConvexAction('seo/seoAudits:getLatestAuditByProject', { projectId });

  if (verifyOutput.includes('https://www.semrush.com') && verifyOutput.includes(projectId)) {
    console.log('✅ SUCCESS: MOCKED Audit saved and retrieved correctly!');
  } else {
    console.error('❌ FAILURE: Could not verify saved audit.');
    console.log('Verify Output:', verifyOutput);
    process.exit(1);
  }

  console.log('\n🐶 DOGFOODING VERIFICATION COMPLETE (MOCK MODE) 🐶');
}

main();
