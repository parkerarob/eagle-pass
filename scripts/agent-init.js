#!/usr/bin/env node

/**
 * AI Agent Initialization Script
 * Sets up the development environment for AI agent workflow
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DATE_STAMP = new Date().toISOString().split('T')[0].replace(/-/g, '');
const BRANCH_NAME = `agent-development-${DATE_STAMP}`;
const LOG_FILE = `docs/AGENT_LOG_${DATE_STAMP}.md`;

console.log('🤖 Initializing AI Agent Development Environment...\n');

// Step 1: Verify current state
console.log('📋 Step 1: Verifying current project state...');
try {
  console.log('Running tests...');
  execSync('npm test', { stdio: 'pipe' });
  console.log('✅ All tests passing');
  
  console.log('Running linter...');
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('✅ No linting errors');
  
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.log('⚠️  Warning: Working directory has uncommitted changes');
    console.log(gitStatus);
  } else {
    console.log('✅ Clean git status');
  }
} catch (error) {
  console.error('❌ Pre-flight checks failed:', error.message);
  process.exit(1);
}

// Step 2: Create development branch
console.log('\n🌿 Step 2: Creating development branch...');
try {
  execSync(`git checkout -b ${BRANCH_NAME}`, { stdio: 'pipe' });
  execSync(`git push -u origin ${BRANCH_NAME}`, { stdio: 'pipe' });
  console.log(`✅ Created and pushed branch: ${BRANCH_NAME}`);
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log(`📝 Branch ${BRANCH_NAME} already exists, switching to it...`);
    execSync(`git checkout ${BRANCH_NAME}`, { stdio: 'pipe' });
  } else {
    console.error('❌ Failed to create branch:', error.message);
    process.exit(1);
  }
}

// Step 3: Initialize agent log
console.log('\n📝 Step 3: Creating agent log file...');
const logContent = `# AI Agent Development Log - ${DATE_STAMP}

## Session Information
- **Started:** ${new Date().toISOString()}
- **Branch:** ${BRANCH_NAME}
- **Initial Coverage:** ~24.5%
- **Target Coverage:** 80%

## Task Progress

### Phase 1: Core MVP (Weeks 1-4)
- [ ] Authentication & User Management
- [ ] Pass Lifecycle Implementation  
- [ ] Location Management
- [ ] Schedule Management
- [ ] Basic UI Components

### Daily Log

#### ${new Date().toLocaleDateString()}
- ✅ Initialized AI agent development environment
- ✅ Created development branch: ${BRANCH_NAME}
- 📝 Ready to begin task execution

---

## Task Completion Template

### Task: [TASK_NAME]
**Started:** [TIME]
**Completed:** [TIME]
**Duration:** [DURATION]

**Changes Made:**
- [CHANGE_1]
- [CHANGE_2]

**Tests Added:**
- [TEST_1]
- [TEST_2]

**Coverage Impact:** [OLD]% -> [NEW]%

**Commit:** [COMMIT_HASH]

---
`;

fs.writeFileSync(LOG_FILE, logContent);
console.log(`✅ Created agent log: ${LOG_FILE}`);

// Step 4: Update task summary
console.log('\n📊 Step 4: Updating task summary...');
const taskSummaryPath = 'docs/TASK_SUMMARY.md';
let taskSummary = fs.readFileSync(taskSummaryPath, 'utf8');

// Update the current status section
const currentStatusRegex = /### 🔄 In Progress[\s\S]*?(?=###|\n## |$)/;
const newInProgress = `### 🔄 In Progress
- AI Agent Development Session - Started ${new Date().toLocaleDateString()}
- Current Branch: ${BRANCH_NAME}
- Current Phase: Phase 1 - Core MVP Development

`;

taskSummary = taskSummary.replace(currentStatusRegex, newInProgress);
fs.writeFileSync(taskSummaryPath, taskSummary);
console.log('✅ Updated TASK_SUMMARY.md');

// Step 5: Create initial commit
console.log('\n💾 Step 5: Creating initial commit...');
try {
  execSync('git add .', { stdio: 'pipe' });
  execSync(`git commit -m "chore: initialize AI agent development workflow

- Created development branch: ${BRANCH_NAME}
- Set up agent logging system
- Updated task summary
- Ready for automated development"`, { stdio: 'pipe' });
  execSync(`git push origin ${BRANCH_NAME}`, { stdio: 'pipe' });
  console.log('✅ Initial commit created and pushed');
} catch (error) {
  console.error('❌ Failed to create initial commit:', error.message);
}

// Step 6: Display next steps
console.log('\n🎯 Next Steps for AI Agent:');
console.log('1. Begin with Section 1.1: Authentication & User Management');
console.log('2. Follow the task execution pattern in AI_AGENT_WORKFLOW.md');
console.log('3. Update documentation after each task');
console.log('4. Commit changes frequently');
console.log('5. Track progress in the agent log file');

console.log('\n📁 Key Files to Monitor:');
console.log('- docs/PROJECT_COMPLETION_TASKS.md (main task list)');
console.log('- docs/TASK_SUMMARY.md (progress overview)');
console.log(`- ${LOG_FILE} (detailed log)`);
console.log('- docs/AI_AGENT_WORKFLOW.md (process guide)');

console.log('\n🚀 AI Agent Development Environment Ready!');
console.log(`Current branch: ${BRANCH_NAME}`);
console.log('Happy coding! 🤖'); 