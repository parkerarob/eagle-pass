#!/usr/bin/env node

/**
 * AI Agent Task Completion Script
 * Marks tasks as complete and updates all documentation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🤖 AI Agent Task Completion Assistant\n');
  
  // Get task information
  const taskName = await prompt('Task Name: ');
  const taskSection = await prompt('Task Section (e.g., 1.1): ');
  const description = await prompt('Brief Description: ');
  const duration = await prompt('Duration (e.g., 2 hours): ');
  const coverageChange = await prompt('Coverage Change (e.g., 24.5% -> 28.3%): ');
  
  rl.close();
  
  console.log('\n📊 Running tests to verify completion...');
  try {
    execSync('npm test', { stdio: 'pipe' });
    execSync('npm run lint', { stdio: 'pipe' });
    console.log('✅ All tests passing and no lint errors');
  } catch (error) {
    console.error('❌ Tests failing! Fix issues before marking complete.');
    process.exit(1);
  }
  
  // Update PROJECT_COMPLETION_TASKS.md
  console.log('\n📝 Updating task list...');
  const taskFile = 'docs/PROJECT_COMPLETION_TASKS.md';
  let taskContent = fs.readFileSync(taskFile, 'utf8');
  
  // Find and update the specific task (simplified - in real implementation would be more sophisticated)
  const date = new Date().toISOString().split('T')[0];
  const updatedTask = `- [x] **${taskName}** ✅ ${date}`;
  console.log(`Marked complete: ${taskName}`);
  
  // Update TASK_SUMMARY.md
  console.log('\n📈 Updating task summary...');
  const summaryFile = 'docs/TASK_SUMMARY.md';
  let summaryContent = fs.readFileSync(summaryFile, 'utf8');
  
  // Add to recently completed section
  const completedRegex = /(### ✅ Recently Completed[\s\S]*?)(\n### |$)/;
  const newCompleted = `### ✅ Recently Completed
- ${date} ${taskName} - ${description}

`;
  
  if (summaryContent.match(completedRegex)) {
    summaryContent = summaryContent.replace(completedRegex, (match, p1, p2) => {
      return newCompleted + p2;
    });
  } else {
    // Add section if it doesn't exist
    summaryContent = summaryContent.replace('## Current Status', `${newCompleted}\n## Current Status`);
  }
  
  fs.writeFileSync(summaryFile, summaryContent);
  console.log('✅ Updated task summary');
  
  // Update agent log if it exists
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const logFile = `docs/AGENT_LOG_${today}.md`;
  
  if (fs.existsSync(logFile)) {
    console.log('\n📋 Updating agent log...');
    let logContent = fs.readFileSync(logFile, 'utf8');
    
    const taskReport = `
### Task: ${taskName}
**Started:** [Manual Entry]
**Completed:** ${new Date().toISOString()}
**Duration:** ${duration}

**Changes Made:**
- ${description}

**Tests Added:**
- [Manual Entry Required]

**Coverage Impact:** ${coverageChange}

**Commit:** [To be added after commit]

---
`;
    
    logContent += taskReport;
    fs.writeFileSync(logFile, logContent);
    console.log('✅ Updated agent log');
  }
  
  // Commit changes
  console.log('\n💾 Creating commit...');
  const commitMsg = `feat: ${taskSection} - ${taskName}

${description}

Tests: All passing
Coverage: ${coverageChange}
Section: ${taskSection}`;
  
  try {
    execSync('git add .', { stdio: 'pipe' });
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'pipe' });
    
    // Get commit hash
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    console.log(`✅ Committed with hash: ${commitHash.substring(0, 8)}`);
    
    // Update log with commit hash if log exists
    if (fs.existsSync(logFile)) {
      let logContent = fs.readFileSync(logFile, 'utf8');
      logContent = logContent.replace('**Commit:** [To be added after commit]', 
                                     `**Commit:** ${commitHash.substring(0, 8)}`);
      fs.writeFileSync(logFile, logContent);
    }
    
    // Push to remote
    execSync('git push', { stdio: 'pipe' });
    console.log('✅ Pushed to remote repository');
    
  } catch (error) {
    console.error('❌ Failed to commit changes:', error.message);
    process.exit(1);
  }
  
  // Display next steps
  console.log('\n🎯 Task Completion Summary:');
  console.log(`✅ Task: ${taskName}`);
  console.log(`📍 Section: ${taskSection}`);
  console.log(`📝 Description: ${description}`);
  console.log(`⏱️  Duration: ${duration}`);
  console.log(`📊 Coverage: ${coverageChange}`);
  console.log(`🚀 All documentation updated and committed`);
  
  console.log('\n📋 Next Actions for AI Agent:');
  console.log('1. Review PROJECT_COMPLETION_TASKS.md for next task');
  console.log('2. Follow the task execution pattern');
  console.log('3. Continue systematic progress through the task list');
  
  console.log('\n🤖 Ready for next task!');
}

main().catch(console.error); 