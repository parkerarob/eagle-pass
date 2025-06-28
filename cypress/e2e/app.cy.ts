describe("App Test Mode Behavior", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show authenticated state in test mode", () => {
    // In test mode, authentication is bypassed and we should see the authenticated view
    cy.contains("Welcome, Test User").should("be.visible");
    cy.contains("Sign Out").should("be.visible");
    cy.contains("Pass Lifecycle Demo").should("be.visible");
  });

  it("should have proper page structure when authenticated", () => {
    // Test for structural elements that are stable
    cy.get("div").should("exist"); // App container exists
    cy.get("h1").contains("Welcome, Test User").should("be.visible"); // Header exists
    cy.get("button").contains("Sign Out").should("be.visible"); // Sign out button exists
  });

  it("should show pass creation form", () => {
    // Test that the pass lifecycle page is loaded with form elements
    cy.get('[data-cy="student-id-input"]').should("be.visible");
    cy.get('[data-cy="origin-location-input"]').should("be.visible");
    cy.get('[data-cy="pass-type-select"]').should("be.visible");
    cy.get("button").contains("Create Pass").should("be.visible");
  });
});

// Test authenticated state functionality
describe("App Authenticated State", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should show pass lifecycle page when authenticated", () => {
    // Since we're in test mode, authentication is mocked
    cy.contains("Pass Lifecycle Demo").should("be.visible");
    cy.get('[data-cy="student-id-input"]').should("be.visible");
  });
});

describe("App User State Edge Cases", () => {
  it("should show pending approval page if user is pending", () => {
    // Simulate pending approval by stubbing getUserApprovalStatus to return 'pending'
    cy.visit("/", {
      onBeforeLoad(win) {
        win.eval(`
          window.Cypress = true;
          window.__eaglepass_test_approval = 'pending';
        `);
      },
    });
    cy.contains("Account Pending Approval").should("be.visible");
    cy.get('[data-cy="pending-approval-msg"]').should("be.visible");
  });

  it("should show error if user has disallowed domain", () => {
    // Simulate disallowed domain by stubbing signInWithGoogle to throw
    cy.visit("/", {
      onBeforeLoad(win) {
        win.eval(`
          window.Cypress = true;
          window.__eaglepass_test_disallowed = true;
        `);
      },
    });
    // Simulate clicking sign in and expect error
    cy.contains("Sign in with Google").click();
    cy.get('[data-cy="auth-error-msg"]').should("be.visible");
    cy.contains("Your email domain is not allowed").should("be.visible");
  });
});
