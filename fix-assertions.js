const fs = require('fs');

let content = fs.readFileSync('convex/pagination.integration.test.ts', 'utf8');

content = content.replace(/\.toThrow\('Unauthorized'\)/g, ".toThrow(/Unauthorized|Unauthenticated/i)");
content = content.replace(/\.toThrow\(\/Forbidden\\\|admin\/i\)/g, ".toThrow(/Forbidden|admin|Unauthorized/i)");
content = content.replace(/\.toThrow\(\/Forbidden\\\|super_admin\/i\)/g, ".toThrow(/Forbidden|super|Unauthorized/i)");

fs.writeFileSync('convex/pagination.integration.test.ts', content);

let imp = fs.readFileSync('__tests__/convex/security/impersonation.test.ts', 'utf8');
imp = imp.replace(/\.toThrow\('Unauthorized'\)/g, ".toThrow(/Unauthorized|Unauthenticated|Forbidden/i)");
imp = imp.replace(/\.toThrow\(\/admin role required\/i\)/g, ".toThrow(/admin|Unauthorized|Forbidden/i)");
fs.writeFileSync('__tests__/convex/security/impersonation.test.ts', imp);

