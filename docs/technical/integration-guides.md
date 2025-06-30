# Integration Guides

This project integrates with several external systems:

1. **OneRoster** – Import rosters using the `handleOneRosterImport` function.
2. **Webhooks** – Send pass events to third-party systems via `dispatchWebhook`.
3. **Email** – Notifications are sent with the `sendEmail` helper.
4. **SFTP Sync** – Data exports uploaded using `handleSftpSync`.

Each integration can be enabled in the Firebase project environment configuration.
