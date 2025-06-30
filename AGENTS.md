# Eagle Pass AGENT Instructions

This repository contains workflows and documentation for the AI agent. Follow these rules when making changes.

## Required Commands
Run **all** of these before committing to ensure the project remains stable:

```bash
npm run lint
npm test
npm run build
npm run coverage:check
npm run cypress:run
```

## Commit Messages
Use the commit message format defined in `docs/AI_AGENT_QUICKSTART.md`:

```
feat: [SECTION] - [TASK_NAME]

[DETAILED_DESCRIPTION]

Tests: [TEST_STATUS]
Coverage: [OLD]% -> [NEW]%
```

## Documentation Updates
After every task, update:

- `docs/PROJECT_COMPLETION_TASKS.md`
- `docs/TASK_SUMMARY.md`
- The current agent log

## Coverage Target
Maintain at least **80%** test coverage. See `docs/TESTING_STRATEGY.md` for guidance.

## Directory Overview
- `src/components/` – shared React components
- `src/services/` – application services and business logic
- `src/pages/` – page components and routing
- `cypress/` – Cypress end-to-end tests
