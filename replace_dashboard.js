const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/routes/HomePage/index.tsx',
  'src/lib/emailTriggers.ts',
  'src/components/Navigation/BottomTabBar.tsx',
  'src/components/Navigation/index.tsx',
  'src/components/mart/MartGuide.tsx',
  'src/components/assistant/TutorialCard.tsx',
  'src/components/home/LandingHeader.tsx',
  'src/components/admin/AdminGuard.tsx',
  'app/subscription/page.tsx',
  'app/onboarding/page.tsx',
  'app/page.tsx',
  'app/not-found.tsx',
  'app/invite/[token]/page.tsx',
  'app/admin/users/[id]/page.tsx',
  'app/auth/reset-password/page.tsx',
  'app/auth/login/page.tsx',
  'app/auth/callback/page.tsx',
];

const workspaceRoot = process.cwd();
let totalReplacements = 0;

filesToUpdate.forEach((relativePath) => {
  const absolutePath = path.join(workspaceRoot, relativePath);
  if (fs.existsSync(absolutePath)) {
    const content = fs.readFileSync(absolutePath, 'utf8');
    // Replace exact quotes
    const newContent = content
      .replaceAll("'/dashboard'", "'/studio'")
      .replaceAll('"/dashboard"', '"/studio"');

    if (content !== newContent) {
      fs.writeFileSync(absolutePath, newContent, 'utf8');
      console.log(`Updated: ${relativePath}`);
      totalReplacements++;
    }
  } else {
    console.error(`File not found: ${absolutePath}`);
  }
});

console.log(`DONE. Replaced in ${totalReplacements} files.`);
