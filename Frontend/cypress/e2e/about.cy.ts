describe('AboutPage', () => {
  beforeEach(() => {
    // Before each test, visit the /sceneries page and click on the first scenery's 'View' button
    cy.visit('/sceneries');
    cy.get('.MuiGrid-container .MuiCard-root').first().contains('View').click();
  });

  it('Display scenery details correctly', () => {
    // Check if the image, title, location, and uploader comment are displayed correctly
    cy.get('img').should('be.visible');
    cy.get('h3').should('contain.text', '1paris');
    cy.get('h4').should('contain.text', 'France - Paris');
    cy.contains('Uploader Comment:').should('be.visible');
  });

  it('Handle collection functionality', () => {
    // Simulate logging in and check if the 'Collect' button appears on the scenery details page
    cy.visit('/login');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    // Wait for authentication to complete
    cy.wait(2000);
    cy.get('a[href="/sceneries"]').first().click({ multiple: true });
    cy.get('.MuiGrid-container .MuiCard-root').first().contains('View').click();
    // Wait for page to load
    cy.wait(2000);
    cy.get('[data-testid="collect-button"]').contains('Collect').should('exist');
  });

  it('Handle deletion without logged in', () => {
    // Check if the 'Delete' button is disabled when user is not logged in
    cy.get('button').contains('Delete').should('be.disabled');
  });

  it('Return button functionality', () => {
    // Click on the 'Return' button and verify if redirected back to the homepage
    cy.get('button').contains('Return').click();
    cy.url().should('include', '/');
  });

  it('Display login message if user is not authenticated', () => {
    // Check if the login message appears when user is not authenticated
    cy.contains('log in to enable below operations').should('be.visible');
  });
});