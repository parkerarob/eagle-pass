# E2E Testing Guide

## Overview

This guide explains our robust E2E testing approach using Cypress, designed to avoid brittle tests that break with every UI change.

## Key Principles

### ✅ **Test Functionality, Not Text**
- **Good**: Test that buttons exist and are clickable
- **Bad**: Test for exact text content that changes frequently

### ✅ **Use Stable Selectors**
- **Good**: `data-cy="submit-button"` attributes
- **Bad**: CSS classes that change with styling updates

### ✅ **Test User Workflows**
- **Good**: Complete user journeys (create pass → check in → return)
- **Bad**: Isolated actions without context

### ✅ **Handle Different States**
- **Good**: Test both authenticated and unauthenticated states
- **Bad**: Assume a single application state

## Test Structure

### Authentication Flow Tests (`app.cy.ts`)
```typescript
// Tests the authentication page and login flow
describe('App Authentication Flow', () => {
  it('should show authentication page when not logged in', () => {
    cy.contains('Sign in to your account').should('be.visible');
    cy.contains('Sign in with Google').should('be.visible');
  });
});
```

### Pass Lifecycle Tests (`pass-lifecycle.cy.ts`)
```typescript
// Tests the main application functionality
describe('Pass Lifecycle E2E', () => {
  context('Pass Creation', () => {
    it('should create pass with valid data', () => {
      cy.get('[data-cy="student-id-input"]').type('TEST-STUDENT-001');
      cy.get('[data-cy="origin-location-input"]').type('CLASSROOM-A');
      cy.get('[data-cy="pass-type-select"]').select('restroom');
      cy.get('button').contains('Create Pass').click();
      cy.get('[data-cy="success-msg"]').should('be.visible');
    });
  });
});
```

## Data-Cy Attributes

We use `data-cy` attributes for stable test selectors:

| Component | Attribute | Purpose |
|-----------|-----------|---------|
| Student ID Input | `data-cy="student-id-input"` | Pass creation form |
| Location Input | `data-cy="origin-location-input"` | Pass creation form |
| Pass Type Select | `data-cy="pass-type-select"` | Pass creation form |
| Check-in Input | `data-cy="checkin-location-input"` | Location check-in |
| Check-in Button | `data-cy="checkin-button"` | Location check-in |
| Return Button | `data-cy="return-button"` | Return to origin |
| Success Message | `data-cy="success-msg"` | Success feedback |
| Error Message | `data-cy="error-msg"` | Error feedback |

## Test Categories

### 1. **Structural Tests**
- Verify UI elements exist
- Check form validation
- Test button states

### 2. **Functional Tests**
- Complete user workflows
- Business rule validation
- Error handling

### 3. **Integration Tests**
- Authentication flow
- Database interactions
- State management

## Avoiding Brittle Tests

### ❌ **Don't Do This**
```typescript
// Brittle - breaks when text changes
cy.contains('Hello, EaglePass!').should('be.visible');

// Brittle - breaks when CSS changes
cy.get('.btn-primary').click();

// Brittle - assumes specific user data
cy.contains('Welcome, john@example.com');
```

### ✅ **Do This Instead**
```typescript
// Robust - tests functionality
cy.get('[data-cy="welcome-message"]').should('be.visible');

// Robust - uses stable selectors
cy.get('[data-cy="submit-button"]').click();

// Robust - tests patterns, not exact content
cy.get('[data-cy="user-greeting"]').should('contain', 'Welcome');
```

## Authentication Testing

Our app now automatically bypasses authentication in test mode (when running under Cypress). This means:

1. **No manual login or auth mocking is needed** for E2E tests.
2. **Tests always run as a mock user** ("Test User") when Cypress is detected.
3. **You can test authenticated flows and UI directly** in E2E tests.

**Note:** Backend operations (like Firebase writes) are not expected to succeed in CI unless specifically mocked. E2E tests should verify that error handling works when backend calls fail.

**Advanced:**
- Cypress E2E tests can now simulate pending approval and disallowed domain states by setting `window.__eaglepass_test_approval` and `window.__eaglepass_test_disallowed` flags in test mode. These scenarios are covered in `app.cy.ts`.

```typescript
// Example: Authenticated test (no login needed)
it('should show pass lifecycle page when authenticated', () => {
  cy.visit('/');
  cy.contains('Pass Lifecycle Demo').should('be.visible');
  cy.get('[data-cy="student-id-input"]').should('be.visible');
});
```

## Running Tests

### Local Development
```bash
# Start dev server
npm run dev

# Run specific test
npx cypress run --spec "cypress/e2e/app.cy.ts"

# Run all E2E tests
npx cypress run

# Open Cypress UI
npx cypress open
```

### CI/CD
Tests run automatically in GitHub Actions using the `cypress-io/github-action`:
- Starts dev server automatically
- Waits for server to be ready
- Runs all tests in headless mode
- Records videos and screenshots on failure

## Maintenance

### Adding New Tests
1. Add `data-cy` attributes to new components
2. Follow the naming convention: `componentName-action` or `componentName-element`
3. Group related tests in `context()` blocks
4. Test both success and error scenarios

### Updating Existing Tests
1. Prefer updating selectors over test logic
2. Keep tests focused on functionality
3. Update documentation when adding new `data-cy` attributes

## Best Practices

1. **Use descriptive test names** that explain what the test validates
2. **Group related tests** using `context()` blocks
3. **Test error states** as thoroughly as success states
4. **Use timeouts** for async operations
5. **Clean up test data** between tests when needed
6. **Document complex test scenarios** with comments

This approach ensures our E2E tests remain stable and valuable as the application evolves. 