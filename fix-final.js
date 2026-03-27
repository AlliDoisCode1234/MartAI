const fs = require('fs');

function fix(file, helperPath) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace convexTest with createTestContext
  content = content.replace(/import \{ convexTest \} from 'convex-test';/, `import { convexTest } from 'convex-test';\nimport { createTestContext } from '${helperPath}';`);
  content = content.replace(/t = convexTest\(schema\);/g, "t = createTestContext();");

  // Fix identities in pagination
  if (file.includes('pagination')) {
    content = content.replace(/t\.withIdentity\(\{\s*subject:\s*testUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: testUserId, email: 'pagination-test@example.com' })");
    content = content.replace(/t\.withIdentity\(\{\s*subject:\s*regularUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: regularUserId, email: 'regular@example.com' })");
    content = content.replace(/t\.withIdentity\(\{\s*subject:\s*adminUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: adminUserId, email: 'admin@example.com' })");
    content = content.replace(/t\.withIdentity\(\{\s*subject:\s*superAdminUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' })");
  }

  fs.writeFileSync(file, content);
}

fix('convex/pagination.integration.test.ts', '../__tests__/convex/testHelpers');
fix('convex/admin.integration.test.ts', '../__tests__/convex/testHelpers');

let apiKeyContent = fs.readFileSync('__tests__/convex/apiKeys.integration.test.ts', 'utf8');
apiKeyContent = apiKeyContent.replace(/const authT = t\.withIdentity\(\{ email([^}]*)\}\); \/\/ Won't match/g, 
  "const authT = t.withIdentity({ subject: userId, email$1}); // Won't match");
apiKeyContent = apiKeyContent.replace(/const authT = t\.withIdentity\(\{ email \}\);/g, 
  "const authT = t.withIdentity({ subject: userId, email });");
fs.writeFileSync('__tests__/convex/apiKeys.integration.test.ts', apiKeyContent);

// Fix impersonation Test File Missing Email
let imp = fs.readFileSync('__tests__/convex/security/impersonation.test.ts', 'utf8');
imp = imp.replace(/t\.withIdentity\(\{ email:\s*'admin@example.com'\s*\}\)/g, "t.withIdentity({ subject: adminId, email: 'admin@example.com' })");
imp = imp.replace(/t\.withIdentity\(\{ email:\s*'regular-admin@example.com'\s*\}\)/g, "t.withIdentity({ subject: regularAdminId, email: 'regular-admin@example.com' })");
imp = imp.replace(/t\.withIdentity\(\{ email:\s*'user@example.com'\s*\}\)/g, "t.withIdentity({ subject: targetUserId, email: 'user@example.com' })");
fs.writeFileSync('__tests__/convex/security/impersonation.test.ts', imp);

