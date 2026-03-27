const fs = require('fs');
let content = fs.readFileSync('convex/admin.integration.test.ts', 'utf8');
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\n\s*,\n/g, '\n');
fs.writeFileSync('convex/admin.integration.test.ts', content);

let content2 = fs.readFileSync('__tests__/convex/security/impersonation.test.ts', 'utf8');
content2 = content2.replace(/,\s*,/g, ',');
content2 = content2.replace(/\n\s*,\n/g, '\n');
fs.writeFileSync('__tests__/convex/security/impersonation.test.ts', content2);
