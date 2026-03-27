const fs = require('fs');
const files = [
  '__tests__/convex/security/impersonation.test.ts',
  '__tests__/convex/ai/writerPersonas.test.ts'
];
for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/role: 'super_admin'/g, "role: 'user'").replace(/role: 'admin'/g, "role: 'user'");
    fs.writeFileSync(file, content);
    console.log(`Replaced in ${file}`);
  }
}
