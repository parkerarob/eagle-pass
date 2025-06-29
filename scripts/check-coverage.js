#!/usr/bin/env node

/**
 * Script to check test coverage and display progress towards 80% target
 */

import { execSync } from "child_process";
import fs from "fs";

const TARGET_COVERAGE = 80;

console.log("🧪 Running tests with coverage...\n");

try {
  // Run tests with coverage
  execSync("npm run test:coverage", { stdio: "inherit" });

  // Parse coverage results from coverage-final.json
  const coverageFile = "coverage/coverage-final.json";
  const data = JSON.parse(fs.readFileSync(coverageFile, "utf8"));
  let totalStatements = 0;
  let coveredStatements = 0;

  for (const file of Object.values(data)) {
    for (const count of Object.values(file.s)) {
      totalStatements += 1;
      if (count > 0) {
        coveredStatements += 1;
      }
    }
  }
  const currentCoverage = (coveredStatements / totalStatements) * 100;

  console.log("\n📊 Coverage Summary:\n");
  console.log(`Target Coverage: ${TARGET_COVERAGE}%`);
  console.log(`Current Status: ${currentCoverage.toFixed(2)}%`);
  console.log(
    `Gap to Target: ${(TARGET_COVERAGE - currentCoverage).toFixed(2)}%`,
  );

  console.log("\n📝 Next Steps to Improve Coverage:");
  console.log("1. Complete pass service tests (currently ~29%)");
  console.log("2. Add authentication service tests");
  console.log("3. Test all React components");
  console.log("4. Add integration tests for Firebase operations");
  console.log("5. Test utility functions and hooks");
} catch (error) {
  console.error("\n❌ Coverage check failed:", error.message);
  process.exit(1);
}
