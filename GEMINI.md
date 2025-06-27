# GEMINI.md - EaglePass Project Notes

This document serves as an internal knowledge base for the Gemini AI agent working on the EaglePass project. It contains context, decisions, and guidelines to ensure consistent and efficient development.

## Project Context & Goals
- **Project Name:** EaglePass - Digital Hall Pass System
- **Primary Goal:** Develop a mobile-first PWA for student movement tracking, emphasizing security (FERPA compliance) and ease of use.
- **Key Differentiators (from PRD):** Open data export (BigQuery), code-enforced FERPA masking, Pass Freeze & period auto-close, lightweight PWA.
- **User Roles:** Student, Teacher/Support, Admin (with distinct capabilities).

## Tech Stack Decisions
- **Frontend:** React (TypeScript) with Vite, Tailwind CSS, shadcn/ui.
- **Backend:** Firebase (Cloud Firestore, Cloud Functions, Authentication).
- **Testing:** Jest & React Testing Library (Unit/Component), Cypress (E2E).
- **Build Tool:** Vite (explicitly chosen for fast DX).
- **Mobile Strategy:** Installable PWA (React Native wrapper is a future consideration, not MVP).

## File Structure & Conventions
- **Root Directory:** `/Users/parkerarob/eagle-pass`
- **Source Code:** `src/`
  - `src/components/`: Reusable React components (especially shadcn/ui components).
  - `src/pages/`: Top-level components representing different views/routes.
  - `src/hooks/`: Custom React hooks.
  - `src/utils/`: Utility functions (e.g., `src/lib/utils.ts` for shadcn/ui).
  - `src/services/`: Firebase interactions, API calls.
  - `src/context/`: React Context API for global state.
  - `src/assets/`: Images, icons, fonts.
- **Testing:**
  - Unit/Component tests: `src/**/*.test.ts(x)`
  - E2E tests: `cypress/e2e/**/*.cy.ts`

## Development Workflow & Commands
- **Install Dependencies:** `npm install`
- **Start Dev Server:** `npm run dev`
- **Run Unit Tests:** `npm test`
- **Run E2E Tests (headless):** `npm run cypress:run`
- **Open Cypress Test Runner:** `npx cypress open`
- **Firebase Config File:** `src/firebase.ts` (contains sensitive API keys, do not expose in logs/public repos).

## Best Practices & Guidelines
- **FERPA Compliance:** Always prioritize data privacy and security. Ensure PII is handled according to PRD Section 12.
- **Code-Enforced FERPA Masking:** Implement programmatic masking for PII in exports and sensitive displays.
- **Role-Based Access Control (RBAC):** Implement and rigorously test RBAC as defined in PRD Section 6 & 8.
- **Immutability:** Adhere to immutable logging principles (PRD Section 2).
- **Modularity & Reusability:** Design components and functions to be modular and reusable.
- **TypeScript:** Leverage TypeScript for strong typing and improved code quality.
- **Tailwind CSS:** Use Tailwind utility classes for styling; create custom components for complex styles.
- **shadcn/ui:** Utilize shadcn/ui components for consistent UI/UX.
- **Error Handling:** Implement robust error handling for all API calls and critical operations.
- **Code Comments:** Add comments sparingly, focusing on *why* complex logic is implemented, not *what* it does.
- **PRD as Source of Truth:** Always refer to the `Desktop/EHP/PRD.txt` for requirements and scope.

## Known Issues / Considerations
- `npx` issues during initial setup (resolved by manual file creation and `tsconfig` adjustments).
- Cypress interactive mode requires manual intervention.

## Future Tasks (from PRD)
- Implement Google SSO.
- Implement Pass Lifecycle (Start, Check-in, Return, Restroom, Parking Lot).
- Implement Logging.
- Implement Escalations.
- Implement Location Responsibility.
- Implement Student Schedule.
- Implement Permission Hierarchy.
- Implement Groups & Group Passes.
- Implement Roles & Capabilities.
- Implement Reporting.
- Implement Data Import / Sync.
- Implement FERPA & Security features.
- Implement API Integrations.
- Implement Design Style.

This document will be updated as the project progresses and new decisions are made.
