# Troubleshooting

Common issues and solutions when running Eagle Pass:

- **Firebase auth errors** – verify OAuth credentials and allowed domains.
- **Missing Xvfb for Cypress** – install the `xvfb` package in your CI or container.
- **Firestore permissions denied** – ensure security rules match user roles.
- **Unexpected build failures** – run `npm run lint` and `npm test` for details.
- **Slow performance** – review the performance testing scripts in `scripts/performance`.
