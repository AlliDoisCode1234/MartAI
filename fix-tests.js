const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace admin insertions
  content = content.replace(/const admin = await ctx\.db\.insert\('users', \{([^}]*)role:\s*'admin'([^}]*)\}\);/g, 
    "const admin = await ctx.db.insert('users', {$1$2});\n      await ctx.db.insert('internalAdmins', { userId: admin, role: 'admin', createdAt: Date.now(), updatedAt: Date.now() });");

  // Replace super_admin insertions
  content = content.replace(/const superAdmin = await ctx\.db\.insert\('users', \{([^}]*)role:\s*'super_admin'([^}]*)\}\);/g, 
    "const superAdmin = await ctx.db.insert('users', {$1$2});\n      await ctx.db.insert('internalAdmins', { userId: superAdmin, role: 'super_admin', createdAt: Date.now(), updatedAt: Date.now() });");

  fs.writeFileSync(file, content);
}

fixFile('convex/admin.integration.test.ts');
