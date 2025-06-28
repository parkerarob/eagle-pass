# Eagle Pass Testing Strategy

## Overview
This document outlines the comprehensive testing strategy for the Eagle Pass digital hall pass system, targeting 80% code coverage and complete E2E test coverage of critical user flows.

## Testing Philosophy

### Test Pyramid
```
         /\
        /E2E\        (10%) - Critical user journeys
       /------\
      /Integration\   (30%) - API & component integration
     /------------\
    /  Unit Tests  \  (60%) - Services, utils, components
   /----------------\
```

### Testing Principles
1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Fast feedback loops** - Unit tests should run in milliseconds
3. **Realistic test data** - Use factory functions for consistent test data
4. **Clear test names** - Describe what is being tested and expected outcome
5. **FERPA compliance** - Test data privacy and security features thoroughly

## Test Categories

### 1. Unit Tests (Target: 80% coverage)

#### Service Layer Tests
```typescript
// Example: pass.test.ts
describe('Pass Service', () => {
  describe('createPass', () => {
    it('should create a new pass if none is open', async () => {
      // Arrange
      mockFirestore.getDocs.mockResolvedValue({ empty: true });
      
      // Act
      const pass = await createPass(...);
      
      // Assert
      expect(pass.status).toBe('open');
    });
  });
});
```

**Coverage Requirements:**
- All public methods tested
- Error scenarios covered
- Edge cases handled
- Async operations properly tested

#### Component Tests
```typescript
// Example: CheckInButton.test.tsx
describe('CheckInButton', () => {
  it('should call onCheckIn with location when clicked', () => {
    // Arrange
    const mockOnCheckIn = vi.fn();
    render(<CheckInButton onCheckIn={mockOnCheckIn} />);
    
    // Act
    fireEvent.change(screen.getByPlaceholderText('Location ID'), {
      target: { value: 'library' }
    });
    fireEvent.click(screen.getByRole('button', { name: /check in/i }));
    
    // Assert
    expect(mockOnCheckIn).toHaveBeenCalledWith('library');
  });
});
```

**Component Testing Guidelines:**
- Test user interactions
- Test conditional rendering
- Test prop validation
- Test accessibility features

### 2. Integration Tests

#### API Integration Tests
```typescript
// Example: firebase-integration.test.ts
describe('Firebase Integration', () => {
  it('should sync pass updates in real-time', async () => {
    // Create a pass
    const passId = await createPass(...);
    
    // Set up listener
    const updates = [];
    onPassUpdate(passId, (pass) => updates.push(pass));
    
    // Update pass
    await updatePass(passId, { status: 'closed' });
    
    // Verify real-time update
    await waitFor(() => {
      expect(updates).toHaveLength(1);
      expect(updates[0].status).toBe('closed');
    });
  });
});
```

#### Component Integration Tests
- Test form submission flows
- Test navigation between pages
- Test state management across components
- Test error boundary behavior

### 3. End-to-End Tests (Cypress)

#### Critical User Flows

**Test Mode Authentication:**
- When running under Cypress, the app automatically bypasses authentication and uses a mock user ("Test User"). No manual login or auth mocking is needed for E2E tests.
- E2E tests can directly test authenticated flows and UI.
- Backend operations (like Firebase writes) are not expected to succeed in CI unless specifically mocked. E2E tests should verify error handling for backend failures.

**Selector Strategy:**
- All E2E tests use robust `data-cy` selectors for stability. Avoid using placeholder or CSS selectors in new tests.

**Student Flow:**
```javascript
// cypress/e2e/student-pass-flow.cy.ts
describe('Student Pass Flow', () => {
  it('should complete full pass lifecycle', () => {
    // No login needed; test-mode auth bypass is active
    cy.visit('/');
    // Create pass
    cy.get('[data-cy="student-id-input"]').type('TEST-STUDENT-001');
    cy.get('[data-cy="origin-location-input"]').type('CLASSROOM-A');
    cy.get('[data-cy="pass-type-select"]').select('restroom');
    cy.get('button').contains('Create Pass').click();
    // Expect error message if backend is not available
    cy.get('[data-cy="error-msg"]').should('be.visible');
  });
});
```

**Teacher Flow:**
```javascript
describe('Teacher Management', () => {
  it('should issue and monitor passes', () => {
    cy.login('teacher@school.edu');
    
    // Issue pass for student
    cy.get('[data-testid="issue-pass"]').click();
    cy.get('[data-testid="student-search"]').type('John Doe');
    cy.get('[data-testid="student-result"]').first().click();
    
    // Monitor active passes
    cy.get('[data-testid="active-passes-tab"]').click();
    cy.get('[data-testid="pass-list"]').should('contain', 'John Doe');
    
    // Force return
    cy.get('[data-testid="force-return-btn"]').click();
    cy.get('[data-testid="confirm-return"]').click();
  });
});
```

**Admin Flow:**
```javascript
describe('Admin Configuration', () => {
  it('should configure system settings', () => {
    cy.login('admin@school.edu');
    
    // Update escalation thresholds
    cy.visit('/admin/settings');
    cy.get('[data-testid="warning-threshold"]').clear().type('15');
    cy.get('[data-testid="alert-threshold"]').clear().type('30');
    cy.get('[data-testid="save-settings"]').click();
    
    // Import student data
    cy.get('[data-testid="import-data"]').click();
    cy.get('input[type="file"]').selectFile('students.csv');
    cy.get('[data-testid="confirm-import"]').click();
    
    // Verify import
    cy.get('[data-testid="import-status"]').should('contain', 'Success');
  });
});
```

### 4. Performance Tests

#### Load Testing
```javascript
// k6/load-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 100 },  // Ramp up
    { duration: '10m', target: 1000 }, // Stay at 1000 users
    { duration: '5m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s
  },
};

export default function () {
  const res = http.get('https://eaglepass.app/api/passes');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3s': (r) => r.timings.duration < 3000,
  });
}
```

### 5. Security Tests

#### FERPA Compliance Tests
```typescript
describe('FERPA Compliance', () => {
  it('should mask PII in exports', async () => {
    const exportData = await exportPassReport({
      includeStudentNames: true,
      format: 'csv'
    });
    
    // Verify PII is masked
    expect(exportData).not.toContain('John Doe');
    expect(exportData).toContain('Student ****');
  });
  
  it('should enforce role-based access', async () => {
    // Login as teacher
    await loginAs('teacher');
    
    // Try to access admin endpoint
    const response = await fetch('/api/admin/users');
    
    expect(response.status).toBe(403);
  });
});
```

## Test Data Management

### Factory Functions
```typescript
// test/factories/pass.factory.ts
export const createMockPass = (overrides = {}) => ({
  id: 'pass-123',
  studentId: 'student-456',
  status: 'open',
  openedAt: Date.now(),
  originLocationId: 'classroom-101',
  issuedBy: 'teacher-789',
  type: 'regular',
  ...overrides
});

// test/factories/user.factory.ts
export const createMockStudent = (overrides = {}) => ({
  id: 'student-456',
  email: 'student@school.edu',
  displayName: 'Test Student',
  role: 'student',
  scheduleId: 'schedule-123',
  ...overrides
});
```

### Test Database
- Use Firestore emulator for integration tests
- Reset database between test runs
- Seed with realistic data volumes

## Coverage Requirements

### Minimum Coverage by Type
| File Type | Required Coverage |
|-----------|------------------|
| Services | 85% |
| Components | 80% |
| Utilities | 90% |
| Hooks | 75% |
| Pages | 70% |

### Critical Path Coverage
These features must have 100% test coverage:
- Authentication flow
- Pass creation and validation
- FERPA compliance functions
- Permission checking
- Data export with PII masking

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          fail_ci_if_error: true
          
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run E2E tests
        run: npm run cypress:run
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

### Quality Gates
- PR cannot merge if coverage drops below 80%
- All tests must pass
- No critical security vulnerabilities
- Performance benchmarks met

## Testing Best Practices

### 1. Test Organization
```
src/
├── components/
│   ├── CheckInButton.tsx
│   └── __tests__/
│       └── CheckInButton.test.tsx
├── services/
│   ├── pass.ts
│   └── pass.test.ts
└── utils/
    ├── validation.ts
    └── validation.test.ts
```

### 2. Test Naming Convention
```typescript
// Format: should [expected behavior] when [condition]
it('should disable submit button when form is invalid', () => {});
it('should show error message when API call fails', () => {});
it('should redirect to login when session expires', () => {});
```

### 3. Async Testing
```typescript
// ✅ Good - proper async handling
it('should load user data', async () => {
  const user = await getUserData('123');
  expect(user.name).toBe('John Doe');
});

// ❌ Bad - missing await
it('should load user data', () => {
  const user = getUserData('123'); // Returns promise!
  expect(user.name).toBe('John Doe'); // Will fail
});
```

### 4. Mocking Guidelines
- Mock external dependencies (Firebase, APIs)
- Don't mock what you're testing
- Use realistic mock data
- Reset mocks between tests

### 5. Accessibility Testing
```typescript
it('should be keyboard navigable', () => {
  render(<PassForm />);
  
  // Tab to first input
  userEvent.tab();
  expect(screen.getByLabelText('Destination')).toHaveFocus();
  
  // Tab to submit button
  userEvent.tab();
  userEvent.tab();
  expect(screen.getByRole('button', { name: /submit/i })).toHaveFocus();
});
```

## Test Maintenance

### Regular Review
- Weekly: Review failing tests
- Monthly: Update test data
- Quarterly: Review coverage gaps
- Annually: Update testing strategy

### Documentation
- Document complex test setups
- Explain non-obvious assertions
- Link tests to requirements
- Update when requirements change

## Troubleshooting

### Common Issues

1. **Flaky Tests**
   - Add proper wait conditions
   - Use data-testid attributes
   - Avoid timing-dependent tests

2. **Slow Tests**
   - Mock heavy operations
   - Use test database
   - Parallelize where possible

3. **Coverage Gaps**
   - Focus on critical paths first
   - Add tests for error cases
   - Test edge conditions

## Metrics & Reporting

### Key Metrics
- Overall coverage: 80%+
- Test execution time: <5 minutes
- Flaky test rate: <1%
- Critical path coverage: 100%

### Reporting Dashboard
- Daily coverage trends
- Test execution times
- Failure patterns
- Coverage by module

## Future Enhancements

### Phase 1 (Current)
- Achieve 80% unit test coverage
- Basic E2E test suite
- CI/CD integration

### Phase 2
- Visual regression testing
- Mutation testing
- Performance benchmarking

### Phase 3
- Chaos engineering
- Security penetration testing
- Load testing at scale 