# Security Rules

Security rules enforce FERPA compliance and role-based access.

- Students may only read and write their own passes.
- Staff may update passes for assigned locations.
- Admins have full read/write access.
- All writes are validated through Cloud Functions.
- Exported data is masked using the utilities in `src/services/reports.ts`.
