import fs from 'fs';
import path from 'path';

// Define the absolute paths
const convexDir = path.resolve('c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex');
const testsDir = path.resolve('c:/Users/josia/Desktop/Anti_MartAI/MartAI/__tests__');
const apiDecFile = path.resolve(convexDir, '_generated/api.d.ts');

async function audit() {
  console.log('--- Starting Swarm Audit ---');

  if (!fs.existsSync(apiDecFile)) {
    console.error('API declaration file not found:', apiDecFile);
    return;
  }

  // Very naive parsing of the api.d.ts to find all exported modules
  const apiFileContent = fs.readFileSync(apiDecFile, 'utf-8');
  const importRegex = /import type \* as (.*?) from "\.\.\/(.*?)\.js";/g;

  const modules = [];
  let match;
  while ((match = importRegex.exec(apiFileContent)) !== null) {
    modules.push({
      alias: match[1],
      filepath: match[2], // relative to convex/ e.g., "admin" or "auth/passwordRateLimit"
    });
  }

  // Exclude _generated and internal stuff that aren't real endpoint files
  const validModules = modules.filter((m) => !m.filepath.startsWith('_generated'));

  console.log(`Found ${validModules.length} valid feature modules in convex/`);

  const untested = [];

  for (const mod of validModules) {
    // Check if a corresponding test file exists
    // Common patterns:
    // convex/${mod.filepath}.test.ts
    // convex/${mod.filepath}.integration.test.ts
    // __tests__/${mod.filepath}.test.ts
    // __tests__/integration/${mod.filepath}.integration.test.ts

    const possibleTestPaths = [
      path.join(convexDir, `${mod.filepath}.test.ts`),
      path.join(convexDir, `${mod.filepath}.test.tsx`),
      path.join(convexDir, `${mod.filepath}.integration.test.ts`),
      path.join(testsDir, `${mod.filepath}.test.ts`),
      path.join(testsDir, `${mod.filepath}.integration.test.ts`),
      path.join(testsDir, `convex/${mod.filepath}.test.ts`),
      path.join(testsDir, `convex/${mod.filepath}.integration.test.ts`),
      path.join(testsDir, `integration/${mod.filepath}.test.ts`),
      path.join(testsDir, `integration/${mod.filepath}.integration.test.ts`),
      path.join(testsDir, `integration/${path.basename(mod.filepath)}.integration.test.ts`),
      path.join(testsDir, `integration/${path.basename(mod.filepath)}.test.ts`),
      path.join(testsDir, `convex/${path.basename(mod.filepath)}.test.ts`),
    ];

    let isTested = false;
    for (const testPath of possibleTestPaths) {
      if (fs.existsSync(testPath)) {
        isTested = true;
        break;
      }
    }

    if (!isTested) {
      untested.push(mod.filepath);
    }
  }

  console.log(`Found ${untested.length} untested modules.`);
  console.log(untested.map((u) => `- ${u}`).join('\n'));
}

audit().catch(console.error);
