describe("Permission E2E Tests", () => {
  const checkHome = (role: string, testId: string) => {
    localStorage.setItem("testRole", role);
    cy.visit("/");
    cy.get(`[data-testid="${testId}"]`).should("be.visible");
  };

  it("student permissions", () => {
    checkHome("student", "student-dashboard");
  });

  it("teacher permissions", () => {
    checkHome("staff", "staff-dashboard");
  });

  it("admin permissions", () => {
    checkHome("admin", "admin-dashboard");
  });
});
