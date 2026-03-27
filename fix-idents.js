const fs = require('fs');

function fixKeys() {
  let content = fs.readFileSync('__tests__/convex/apiKeys.integration.test.ts', 'utf8');
  content = content.replace(/const authT = t\.withIdentity\(\{ email([^}]*)\}\); \/\/ Won't match/g, 
    "const authT = t.withIdentity({ subject: userId, email$1}); // Won't match");
  content = content.replace(/const authT = t\.withIdentity\(\{ email \}\);/g, 
    "const authT = t.withIdentity({ subject: userId, email });");
  fs.writeFileSync('__tests__/convex/apiKeys.integration.test.ts', content);
}

function fixPagination() {
  let content = fs.readFileSync('convex/pagination.integration.test.ts', 'utf8');
  // Add email back to existing subject blocks
  content = content.replace(/subject: regularUserId,/g, "subject: regularUserId, email: 'regular@example.com',");
  content = content.replace(/subject: adminUserId,/g, "subject: adminUserId, email: 'admin@example.com',");
  content = content.replace(/subject: superAdminUserId,/g, "subject: superAdminUserId, email: 'super@example.com',");
  content = content.replace(/subject: testUserId,/g, "subject: testUserId, email: 'pagination-test@example.com',");
  fs.writeFileSync('convex/pagination.integration.test.ts', content);
}

fixKeys();
fixPagination();
