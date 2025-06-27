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

### Unit and Component Tests (Jest & React Testing Library)

To run unit and component tests:

```bash
npm test
```

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

*   **Product Requirements Document (PRD):** `Desktop/EHP/PRD.txt` (Contains detailed functional and non-functional requirements).
*   **Agent Notes:** `GEMINI.md` (Internal notes for the AI agent).

## Contributing

(To be added later - guidelines for contributing to the project.)