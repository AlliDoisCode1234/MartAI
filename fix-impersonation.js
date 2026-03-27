const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace super_admin insertions
  content = content.replace(/const (\w+) = await t\.run\(async \(ctx\) => \{\s*const id = await ctx\.db\.insert\('users', \{([^}]*)role:\s*'super_admin'([^}]*)\}\);\s*(?:await ctx\.db\.insert\('internalAdmins', \{[^}]*\}\);\s*)?return id;\s*\}\);/g, 
    "const $1 = await t.run(async (ctx) => {\n      const id = await ctx.db.insert('users', {$2$3});\n      await ctx.db.insert('internalAdmins', { userId: id, role: 'super_admin', createdAt: Date.now(), updatedAt: Date.now() });\n      return id;\n    });");

  fs.writeFileSync(file, content);
}

fixFile('__tests__/convex/security/impersonation.test.ts');
