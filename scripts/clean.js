#!/usr/bin/env node

/**
 * Cross-platform script to clean Next.js build artifacts
 * Handles Windows file locking issues and OneDrive sync problems
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const isWindows = process.platform === 'win32';
const nextDir = path.join(process.cwd(), '.next');

function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  try {
    if (isWindows) {
      // Use PowerShell for better handling of locked files
      try {
        execSync(`powershell -Command "Remove-Item -Path '${dirPath}' -Recurse -Force -ErrorAction SilentlyContinue"`, {
          stdio: 'ignore',
          timeout: 10000,
        });
      } catch (error) {
        // Fallback to rmdir
        try {
          execSync(`rmdir /s /q "${dirPath}"`, { stdio: 'ignore', timeout: 5000 });
        } catch (e) {
          console.warn(`Could not remove ${dirPath}, may be locked by another process`);
        }
      }
    } else {
      execSync(`rm -rf "${dirPath}"`, { stdio: 'ignore' });
    }
    console.log(`✓ Cleaned ${dirPath}`);
  } catch (error) {
    console.warn(`⚠ Could not fully clean ${dirPath}: ${error.message}`);
  }
}

console.log('Cleaning Next.js build artifacts...\n');

// Remove .next directory
removeDir(nextDir);

// Also clean common cache locations
const cacheDirs = [
  path.join(process.cwd(), 'node_modules', '.cache'),
  path.join(process.cwd(), '.turbo'),
];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    removeDir(dir);
  }
});

console.log('\n✓ Clean complete. Run "npm run build" to rebuild.');

