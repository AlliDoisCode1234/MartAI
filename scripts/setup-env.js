#!/usr/bin/env node

/**
 * Setup script to generate secure secrets and create .env.local
 * Run with: node scripts/setup-env.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}

console.log('🔐 MartAI Environment Setup\n');
console.log('Generating secure secrets...\n');

const secrets = {
  JWT_SECRET: generateSecret(),
  JWT_REFRESH_SECRET: generateSecret(),
  API_SECRET_KEY: generateSecret(),
  CSRF_SECRET: generateSecret(),
  CRON_SECRET: generateSecret(),
  API_KEY_HASH: generateSecret(),
};

console.log('✅ Generated secrets:');
console.log('━'.repeat(80));
Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});
console.log('━'.repeat(80));

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (fs.existsSync(envLocalPath)) {
  console.log('\n⚠️  .env.local already exists!');
  console.log('Please manually add the secrets above to your .env.local file.');
  console.log('\nOr delete .env.local and run this script again to create a new one.\n');
} else {
  // Read .env.example
  if (!fs.existsSync(envExamplePath)) {
    console.log('\n❌ .env.example not found!');
    console.log('Please create .env.example first.\n');
    process.exit(1);
  }

  let envContent = fs.readFileSync(envExamplePath, 'utf8');

  // Replace empty secrets with generated ones
  Object.entries(secrets).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=$`, 'gm');
    envContent = envContent.replace(regex, `${key}=${value}`);
  });

  // Write to .env.local
  fs.writeFileSync(envLocalPath, envContent);
  console.log('\n✅ Created .env.local with generated secrets!');
  console.log('\n📝 Next steps:');
  console.log('1. Add your OPENAI_API_KEY to .env.local');
  console.log('2. Update CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL if needed');
  console.log('3. Add optional integration keys (WordPress, Shopify, Google) as needed');
  console.log('\n🚀 Then run: npm run dev\n');
}

// Also output a command to copy secrets to clipboard (if on macOS/Linux)
if (process.platform === 'darwin' || process.platform === 'linux') {
  console.log('\n💡 Tip: Copy secrets to clipboard with:');
  console.log('   node scripts/setup-env.js | pbcopy  # macOS');
  console.log('   node scripts/setup-env.js | xclip   # Linux\n');
}
