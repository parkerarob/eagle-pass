# EaglePass CI/CD Overview

This document complements the Cursor rule `.cursor/rules/ci-cd.mdc`, providing a high-level overview of how code flows from commit to production.

| Stage | Tool | What Happens |
|-------|------|--------------|
| Pre-commit | Husky + lint-staged | ESLint & Prettier auto-fix staged files. |
| Pull Request | GitHub Actions (`ci.yml`) | Lint → Build → Unit + Component Tests → Cypress E2E → Coverage upload. |
| Merge to `main` | GitHub Actions | Same checks re-run; artifacts cached for deploy. |
| Deploy (future) | `deploy.yml` (to be added) | Firebase Hosting deploy to **staging**; manual prod promotion. |

## Local Checklist Before Push
```bash
npm ci        # Install
npm run lint  # Lint / fix
npm test      # Unit / component tests
npx cypress run # E2E headless
npm run build # Ensure type checks pass
npm install -g firebase-tools@latest # One-time: install Firebase CLI for deploys
```

## Secrets Required
| Secret | Purpose |
|--------|---------|
| `CODECOV_TOKEN` | Upload coverage; optional. |
| `FIREBASE_DEPLOY_TOKEN` (future) | Automated Firebase Hosting deploy. |

Keep secrets in GitHub **Actions secrets** (Settings → Secrets → Actions).

---

For pipeline changes, update **both** this doc and `.cursor/rules/ci-cd.mdc` so future AI agents stay in sync. 