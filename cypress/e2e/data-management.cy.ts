describe("Data Management E2E Tests", () => {
  beforeEach(() => {
    localStorage.setItem("testRole", "admin");
    cy.visit("/admin/import");
  });

  it("shows data import page", () => {
    cy.contains("Data Import/Export").should("be.visible");
  });

  it("shows reporting page", () => {
    cy.visit("/staff/reports");
    cy.contains("Reporting Dashboard").should("be.visible");
  });

  it("shows audit log page", () => {
    cy.visit("/admin/audit");
    cy.contains("Audit Log").should("be.visible");
  });
});
