# Firestore Backup Strategy

To ensure data safety, schedule a daily export of the Firestore database to Cloud Storage using the Firebase CLI or `gcloud`.

Example cron job using `gcloud`:

```bash
0 2 * * * gcloud firestore export gs://<PROJECT_ID>-backups --collection-ids="passes,legs,locations,groups,schedules,users"
```

Backups should be retained for 30 days and verified with periodic restore tests.
