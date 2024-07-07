describe('Update Page', () => {
  beforeEach(() => {
    // Before each test, visit the login page '/login'
    cy.visit('/login');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    // Type mock credentials and login
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    // Navigate to sceneries page and click on the 'View' button of the first scenery card
    cy.get('a[href="/sceneries"]').first().click({ multiple: true });
    cy.get('.MuiGrid-container .MuiCard-root').eq(0).contains('View').click();
    cy.wait(2000);
    // Click on the 'Update' button for the scenery
    cy.get('[data-testid="update-button"]').should('exist').contains('Update').click();
  });

  it('Update form data successfully', () => {
    // Fill and update form data with valid inputs
    cy.get('#sceneryNameInput').clear().type('0 Test Scenery');
    cy.get('#cityInput').clear().type('Test City');
    cy.get('#commentInput').clear().type('Test Comment');
  });

  it('Display error when trying to upload with invalid form data', () => {
    // Clear input fields to simulate invalid form data
    cy.get('#sceneryNameInput').clear();
    // Check if the submit button is disabled
    cy.get('button[type="button"]').should('be.disabled');
  });

  it('Navigate to home page', () => {
    // Click on the 'Return' button and verify navigation to the home page
    cy.get('button').contains('Return').click();
    cy.url().should('include', '/');
  });

});