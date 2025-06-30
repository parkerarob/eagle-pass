describe("Mobile E2E Tests", () => {
  beforeEach(() => {
    cy.viewport("iphone-6");
    cy.visit("/");
  });

  it("renders mobile layout", () => {
    cy.get("nav").should("be.visible");
  });

  it("displays dashboard content", () => {
    cy.contains("Dashboard").should("be.visible");
  });
});
