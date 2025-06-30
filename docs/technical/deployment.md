# Deployment Guide

Use the provided npm scripts and Firebase CLI to deploy.

1. Run `npm run build` to generate production assets.
2. Deploy functions and hosting with `firebase deploy`.
3. Staging and production projects are configured via `.firebaserc`.
4. Performance tests can be run with `npm run load:test` and `npm run lighthouse` before deployment.
