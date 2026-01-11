#!/usr/bin/env node

/**
 * Updates app.json with the new version and build numbers.
 * Called by semantic-release during the prepare step.
 *
 * Usage: node scripts/update-build-numbers.js <version>
 * Example: node scripts/update-build-numbers.js 1.2.3
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Error: Version argument is required');
  console.error('Usage: node scripts/update-build-numbers.js <version>');
  process.exit(1);
}

// Parse version to generate build number
// Format: major.minor.patch -> MMNNPP (e.g., 1.2.3 -> 10203)
const [major, minor, patch] = version.split('.').map(Number);
const versionCode = major * 10000 + minor * 100 + patch;

const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Update version
appJson.expo.version = version;

// Update iOS build number (string)
if (!appJson.expo.ios) {
  appJson.expo.ios = {};
}
appJson.expo.ios.buildNumber = String(versionCode);

// Update Android version code (integer)
if (!appJson.expo.android) {
  appJson.expo.android = {};
}
appJson.expo.android.versionCode = versionCode;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log(`Updated app.json:`);
console.log(`  version: ${version}`);
console.log(`  ios.buildNumber: ${versionCode}`);
console.log(`  android.versionCode: ${versionCode}`);
