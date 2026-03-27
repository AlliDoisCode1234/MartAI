const fs = require('fs');

let content = fs.readFileSync('convex/pagination.integration.test.ts', 'utf8');

content = content.replace(/t\.withIdentity\(\{\s*subject:\s*testUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: testUserId, email: 'pagination-test@example.com' })");
content = content.replace(/t\.withIdentity\(\{\s*subject:\s*regularUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: regularUserId, email: 'regular@example.com' })");
content = content.replace(/t\.withIdentity\(\{\s*subject:\s*adminUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: adminUserId, email: 'admin@example.com' })");
content = content.replace(/t\.withIdentity\(\{\s*subject:\s*superAdminUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' })");

fs.writeFileSync('convex/pagination.integration.test.ts', content);

let apiKeyContent = fs.readFileSync('__tests__/convex/apiKeys.integration.test.ts', 'utf8');
apiKeyContent = apiKeyContent.replace(/t\.withIdentity\(\{\s*subject:\s*testUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: testUserId, email: 'test@example.com' })");
apiKeyContent = apiKeyContent.replace(/t\.withIdentity\(\{\s*subject:\s*adminUserId,?[\s\n]*\}\)/g, "t.withIdentity({ subject: adminUserId, email: 'admin@example.com' })");
fs.writeFileSync('__tests__/convex/apiKeys.integration.test.ts', apiKeyContent);

