describe("App", () => {
  it("should display the welcome message", () => {
    cy.visit("/");
    cy.contains("Hello, EaglePass!").should("be.visible");
  });
});
