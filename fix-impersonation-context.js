const fs = require('fs');

let content = fs.readFileSync('__tests__/convex/security/impersonation.test.ts', 'utf8');
content = content.replace(/import \{ convexTest \} from 'convex-test';/, "import { convexTest } from 'convex-test';\nimport { createTestContext } from '../testHelpers';");
content = content.replace(/t = convexTest\(schema\);/g, "t = createTestContext();");
fs.writeFileSync('__tests__/convex/security/impersonation.test.ts', content);

