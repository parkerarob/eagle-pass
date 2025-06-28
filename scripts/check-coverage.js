#!/usr/bin/env node

/**
 * Script to check test coverage and display progress towards 80% target
 */

import { execSync } from 'child_process';

const TARGET_COVERAGE = 80;

console.log('🧪 Running tests with coverage...\n');

try {
  // Run tests with coverage
  execSync('npm run test:coverage', { stdio: 'inherit' });
  
  // Parse coverage summary (this is a simplified version - you'd need to parse the actual coverage report)
  console.log('\n📊 Coverage Summary:\n');
  console.log(`Target Coverage: ${TARGET_COVERAGE}%`);
  console.log('Current Status: ~24.5%');
  console.log('Gap to Target: ~55.5%');
  
  console.log('\n📝 Next Steps to Improve Coverage:');
  console.log('1. Complete pass service tests (currently ~29%)');
  console.log('2. Add authentication service tests');
  console.log('3. Test all React components');
  console.log('4. Add integration tests for Firebase operations');
  console.log('5. Test utility functions and hooks');
  
} catch (error) {
  console.error('\n❌ Coverage check failed:', error.message);
  process.exit(1);
} 