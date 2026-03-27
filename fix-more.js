const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Insert internalAdmins
  content = content.replace(/const (\w+) = await ctx\.db\.insert\('users', \{([^}]*)role:\s*'super_admin'([^}]*)\}\);/g, 
    "const $1 = await ctx.db.insert('users', {$2role: 'super_admin'$3});\n      await ctx.db.insert('internalAdmins', { userId: $1, role: 'super_admin', createdAt: Date.now(), updatedAt: Date.now() });");

  content = content.replace(/const (\w+) = await ctx\.db\.insert\('users', \{([^}]*)role:\s*'admin'([^}]*)\}\);/g, 
    "const $1 = await ctx.db.insert('users', {$2role: 'admin'$3});\n      await ctx.db.insert('internalAdmins', { userId: $1, role: 'admin', createdAt: Date.now(), updatedAt: Date.now() });");

  // Fix withIdentity missing subject
  // For pagination, usually the var is adminUserId or superAdminUserId
  // If it's `adminT = t.withIdentity({ email: 'admin@example.com' })` we change to `{ subject: adminUserId, email... }`
  content = content.replace(/t\.withIdentity\(\{ email:\s*'admin@example.com'\s*}\)/g, "t.withIdentity({ subject: adminUserId, email: 'admin@example.com' })");
  content = content.replace(/t\.withIdentity\(\{ email:\s*'super@example.com'\s*}\)/g, "t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' })");
  content = content.replace(/t\.withIdentity\(\{ email:\s*'user@example.com'\s*}\)/g, "t.withIdentity({ subject: regularUserId, email: 'user@example.com' })");

  fs.writeFileSync(file, content);
}

fix('convex/pagination.integration.test.ts');
fix('__tests__/convex/apiKeys.integration.test.ts');
