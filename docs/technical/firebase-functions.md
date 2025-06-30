# Firebase Cloud Functions

This document lists all implemented Cloud Functions and their responsibilities.

- **validatePassCreation** – Validates incoming pass data before creation.
- **logAudit** – Writes audit entries for key events.
- **escalationTrigger** – Invokes escalation logic when a pass is created.
- **handlePeriodChange** – Closes passes automatically when periods change.
- **cleanupClosedPasses** – Archives old closed passes.
- **handleOneRosterImport** – Imports roster data from CSV.
- **dispatchWebhook** – Sends POST requests to external systems.
- **sendEmail** – Dispatches email notifications.
- **exportData** – Exports Firestore collections as newline-delimited JSON.
- **handleSftpSync** – Uploads data to remote SFTP servers.
