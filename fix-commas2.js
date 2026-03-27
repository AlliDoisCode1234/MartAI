const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Match lines that only contain whitespace, a comma, and whitespace
  content = content.replace(/^\s*,\s*$/gm, '');
  fs.writeFileSync(file, content);
}

fix('convex/admin.integration.test.ts');
fix('__tests__/convex/security/impersonation.test.ts');
