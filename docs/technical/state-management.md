# State Management

Application state is managed with React Context providers:

- **AuthContext** – exposes the current user and role.
- **PassContext** – provides active passes for the logged-in student.
- **LocationCacheContext** – caches location records to minimize reads.
- **SyncStatusContext** – tracks online/offline status and sync activity.

Contexts are located in `src/state` and consumed via custom hooks like `useAuth()`.
