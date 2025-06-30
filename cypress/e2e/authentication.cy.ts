describe("Authentication E2E Tests", () => {
  beforeEach(() => {
    localStorage.removeItem("testRole");
    cy.visit("/");
  });

  it("shows login page after logout", () => {
    cy.contains("Sign Out").click();
    cy.contains("Sign in with Google").should("be.visible");
  });

  it("redirects to dashboard based on role", () => {
    localStorage.setItem("testRole", "staff");
    cy.visit("/");
    cy.get('[data-testid="staff-dashboard"]').should("be.visible");
    localStorage.setItem("testRole", "admin");
    cy.visit("/");
    cy.get('[data-testid="admin-dashboard"]').should("be.visible");
  });

  it("maintains session after reload", () => {
    cy.contains("Welcome, Test User").should("be.visible");
    cy.reload();
    cy.contains("Welcome, Test User").should("be.visible");
  });

  it("prevents access when signed out", () => {
    cy.contains("Sign Out").click();
    cy.visit("/demo");
    cy.contains("Sign in to your account").should("be.visible");
  });
});
