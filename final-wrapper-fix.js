const fs = require('fs');

let content = fs.readFileSync('convex/pagination.integration.test.ts', 'utf8');
content = content.replace(/import \{ convexTest \} from 'convex-test';/, "import { convexTest } from 'convex-test';\nimport { createTestContext } from '../__tests__/convex/testHelpers';");
content = content.replace(/t = convexTest\(schema\);/g, "t = createTestContext();");
fs.writeFileSync('convex/pagination.integration.test.ts', content);

