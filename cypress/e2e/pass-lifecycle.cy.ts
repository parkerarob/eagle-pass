describe('Pass Lifecycle E2E', () => {
  beforeEach(() => {
    // Optionally seed test data or reset state
    cy.visit('/');
  });

  it('should create a new pass', () => {
    cy.get('input[placeholder="Student ID"]').type('student1');
    cy.get('input[placeholder="Origin Location"]').type('locA');
    cy.get('select').select('restroom');
    cy.contains('Create Pass').click();
    // Assert pass created (UI feedback or DB check)
  });

  it('should check in at a new location', () => {
    // Assume pass already created
    cy.get('input[placeholder="Location ID"]').type('locB');
    cy.contains('Check In').click();
    // Assert check-in (UI feedback or DB check)
  });

  it('should return pass to origin and close', () => {
    cy.contains('Return to Origin').click();
    // Assert pass closed (UI feedback or DB check)
  });

  it('should prevent creating a second active pass', () => {
    // Try to create another pass for same student
    cy.get('input[placeholder="Student ID"]').type('student1');
    cy.get('input[placeholder="Origin Location"]').type('locA');
    cy.get('select').select('restroom');
    cy.contains('Create Pass').click();
    // Assert error message
  });

  it('should block restroom pass from checking in elsewhere', () => {
    // Create restroom pass, try to check in at non-origin
    cy.get('input[placeholder="Student ID"]').type('student2');
    cy.get('input[placeholder="Origin Location"]').type('locA');
    cy.get('select').select('restroom');
    cy.contains('Create Pass').click();
    cy.get('input[placeholder="Location ID"]').type('locB');
    cy.contains('Check In').click();
    // Assert error message
  });
}); 