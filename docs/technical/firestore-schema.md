# Firestore Schema

Collections used by the Eagle Pass application:

- **passes** – Student hall passes.
- **locations** – Approved campus locations.
- **groups** – Student group definitions.
- **schedules** – Student and staff schedules.
- **users** – Authenticated users with role metadata.

Each collection has composite indexes configured for common queries. See `src/services/firestoreSchema.ts` for the exact field definitions.
