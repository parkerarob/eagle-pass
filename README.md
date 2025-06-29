# EaglePass – Digital Hall Pass System

"Simple, transparent student movement."

## Project Overview
EaglePass is a modern, mobile-first Progressive Web Application (PWA) designed to streamline student movement within educational institutions. It provides a digital hall pass system with features for pass lifecycle management, logging, escalations, location responsibility, student scheduling, permission hierarchies, group passes, roles & capabilities, authentication, reporting, and data import/sync.

This project prioritizes security and FERPA compliance, ensuring student data is handled with the utmost care.

## Tech Stack

**Frontend:** React (TypeScript) with Vite, Tailwind CSS, shadcn/ui
**Backend:** Firebase (Cloud Firestore, Cloud Functions, Authentication)
**Realtime:** Firestore listeners
**Hosting/CDN:** Firebase Hosting + Cloudflare proxy
**Analytics:** BigQuery export + Data Studio templates

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd eagle-pass
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Firebase Configuration:**
    *   Create a Firebase project (e.g., `eaglepass-dev`) in the [Firebase Console](https://console.firebase.google.com/).
    *   Add a web app to your Firebase project.
    *   Obtain your Firebase configuration object.
    *   Create a file `src/firebase.ts` and add your configuration:
        ```typescript
        import { initializeApp } from "firebase/app";
        import { getAuth } from "firebase/auth";
        import { getFirestore } from "firebase/firestore";

        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        export { auth, db };
        ```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Testing

### Unit and Component Tests (Vitest & React Testing Library)

To run unit and component tests:

```bash
npm test              # Run tests once
npm run test:ui       # Open Vitest UI for interactive testing
npm run test:coverage # Run tests with coverage report
npm run coverage:check # Run tests and display coverage summary
```

Run `npm run coverage:check` to see the current coverage percentage. The goal is 80% overall.

### End-to-End Tests (Cypress)

To run Cypress tests in headless mode:

```bash
npm run cypress:run
```

To open the Cypress Test Runner for interactive testing:

```bash
npx cypress open
```

## Documentation

### Project Documentation
*   **[Product Requirements Document (PRD)](docs/PRD.txt)** - Complete functional requirements and specifications
*   **[Detailed Task List](docs/PROJECT_COMPLETION_TASKS.md)** - Comprehensive task breakdown with subtasks for project completion
*   **[Task Summary](docs/TASK_SUMMARY.md)** - High-level overview, milestones, and current project status
*   **[CI/CD Documentation](docs/ci-cd.md)** - Continuous integration and deployment setup guide
*   **[AI Agent Workflow](docs/AI_AGENT_WORKFLOW.md)** - Structured workflow for AI agent development
*   **[AI Agent Quick Start](docs/AI_AGENT_QUICKSTART.md)** - Fast setup guide for AI agents
*   **[Testing Strategy](docs/TESTING_STRATEGY.md)** - Comprehensive testing approach and guidelines

### Development Progress
- **Current Phase:** Core MVP Development (Phase 1 of 4)
- **Test Coverage Target:** 80%
- **Estimated Completion:** 12 weeks total

## AI Agent Development

This project includes a structured workflow for AI agents to systematically complete development tasks. The workflow ensures proper testing, documentation, and version control at each step.

### AI Agent Scripts

```bash
# Initialize AI agent development environment
npm run agent:init

# Mark a task as complete (interactive)
npm run agent:complete

# Check test coverage progress
npm run coverage:check
```

### AI Agent Workflow
1. **Initialization**: Set up development branch and logging
2. **Task Execution**: Follow structured pattern for each task
3. **Documentation**: Update all relevant docs after each task
4. **Version Control**: Commit with descriptive messages and push to GitHub
5. **Validation**: Ensure tests pass and coverage improves

For detailed instructions, see [AI Agent Workflow Documentation](docs/AI_AGENT_WORKFLOW.md).

## Contributing

(To be added later - guidelines for contributing to the project.)