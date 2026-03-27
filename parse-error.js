const fs = require('fs');
const content = fs.readFileSync('test-out-final-4.txt', 'utf8');
const lines = content.split('\n');
const failIndex = lines.findIndex(l => l.includes('Failed Suites') || l.includes('Failed Tests'));
if (failIndex !== -1) {
  console.log(lines.slice(failIndex, failIndex + 50).join('\n'));
} else {
  console.log("Could not find fail block.");
  // Print last 50 lines as fallback
  console.log(lines.slice(-50).join('\n'));
}
