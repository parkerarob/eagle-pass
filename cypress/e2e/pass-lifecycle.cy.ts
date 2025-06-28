describe("Pass Lifecycle E2E", () => {
  beforeEach(() => {
    // Visit the app - this will show auth page if not authenticated
    cy.visit("/");

    // For now, these tests assume we can reach the pass lifecycle page
    // In a real scenario, you'd either:
    // 1. Mock authentication
    // 2. Use a test user account
    // 3. Skip these tests in CI until auth is mocked
  });

  context("Pass Creation", () => {
    it("should display pass creation form", () => {
      // Test that form elements exist and are functional
      cy.get('input[placeholder*="Student"]').should("be.visible");
      cy.get('input[placeholder*="Location"]').should("be.visible");
      cy.get("select").should("be.visible");
      cy.get("button").contains("Create Pass").should("be.visible");
    });

    it("should require student ID and location", () => {
      // Test form validation
      cy.get("button").contains("Create Pass").click();
      // Form should not submit without required fields
      cy.get('input[placeholder*="Student"]').should("have.attr", "required");
      cy.get('input[placeholder*="Location"]').should("have.attr", "required");
    });

    it("should create pass with valid data", () => {
      cy.get('input[placeholder*="Student"]').type("TEST-STUDENT-001");
      cy.get('input[placeholder*="Location"]').type("CLASSROOM-A");
      cy.get("select").select("restroom");
      cy.get("button").contains("Create Pass").click();

      // Should show success message or change UI state
      cy.get('[data-cy="success-msg"]', { timeout: 10000 }).should(
        "be.visible",
      );
    });
  });

  context("Pass Actions", () => {
    beforeEach(() => {
      // Create a pass before each test in this context
      cy.get('input[placeholder*="Student"]').clear().type("TEST-STUDENT-002");
      cy.get('input[placeholder*="Location"]').clear().type("CLASSROOM-B");
      cy.get("select").select("nurse");
      cy.get("button").contains("Create Pass").click();
      cy.get('[data-cy="success-msg"]', { timeout: 10000 }).should(
        "be.visible",
      );
    });

    it("should allow check-in at new location", () => {
      cy.get('input[placeholder*="Location ID"]').type("NURSE-OFFICE");
      cy.get("button").contains("Check In").click();

      // Should show success or update UI
      cy.get('[data-cy="success-msg"]', { timeout: 10000 }).should(
        "be.visible",
      );
    });

    it("should allow return to origin", () => {
      // First check in somewhere
      cy.get('input[placeholder*="Location ID"]').type("NURSE-OFFICE");
      cy.get("button").contains("Check In").click();
      cy.get('[data-cy="success-msg"]', { timeout: 10000 }).should(
        "be.visible",
      );

      // Then return
      cy.get("button").contains("Return").click();
      cy.get('[data-cy="success-msg"]', { timeout: 10000 }).should(
        "be.visible",
      );
    });
  });

  context("Error Handling", () => {
    it("should show error for invalid operations", () => {
      // Try to check in without a pass
      cy.get('input[placeholder*="Location ID"]').type("INVALID-LOCATION");
      cy.get("button").contains("Check In").click();

      // Should show error message
      cy.get('[data-cy="error-msg"]', { timeout: 10000 }).should("be.visible");
    });
  });

  context("Business Rules", () => {
    it("should prevent duplicate active passes", () => {
      // Create first pass
      cy.get('input[placeholder*="Student"]').type("TEST-STUDENT-003");
      cy.get('input[placeholder*="Location"]').type("CLASSROOM-C");
      cy.get("select").select("restroom");
      cy.get("button").contains("Create Pass").click();
      cy.get('[data-cy="success-msg"]', { timeout: 10000 }).should(
        "be.visible",
      );

      // Try to create second pass for same student
      cy.get('input[placeholder*="Student"]').clear().type("TEST-STUDENT-003");
      cy.get('input[placeholder*="Location"]').clear().type("CLASSROOM-D");
      cy.get("select").select("nurse");
      cy.get("button").contains("Create Pass").click();

      // Should show error
      cy.get('[data-cy="error-msg"]', { timeout: 10000 }).should("be.visible");
    });

    it("should enforce restroom pass restrictions", () => {
      // Create restroom pass
      cy.get('input[placeholder*="Student"]').type("TEST-STUDENT-004");
      cy.get('input[placeholder*="Location"]').type("CLASSROOM-E");
      cy.get("select").select("restroom");
      cy.get("button").contains("Create Pass").click();
      cy.get('[data-cy="success-msg"]', { timeout: 10000 }).should(
        "be.visible",
      );

      // Try to check in at non-restroom location
      cy.get('input[placeholder*="Location ID"]').type("LIBRARY");
      cy.get("button").contains("Check In").click();

      // Should show error
      cy.get('[data-cy="error-msg"]', { timeout: 10000 }).should("be.visible");
    });
  });
});
