const fs = require('fs');

let content = fs.readFileSync('__tests__/convex/security/impersonation.test.ts', 'utf8');

// Fix the regularAdminId reference
content = content.replace(/subject: regularAdminId/g, "subject: adminId");

// Find anything missing for history
content = content.replace(/adminUserId:\s*adminId/g, "adminUserId: adminId");

fs.writeFileSync('__tests__/convex/security/impersonation.test.ts', content);

