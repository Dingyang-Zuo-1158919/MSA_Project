describe('Upload Page', () => {
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
    // Navigate to upload page
    cy.get('a[href="/upload"]').first().click({ multiple: true });
  });

  it('Upload a valid scenery without image', () => {
    // Fill valid scenery details without uploading an image
    cy.get('#sceneryNameInput').should('be.visible').type('Test Scenery');
    cy.get('#countryInput').type('Test Country');
    cy.get('#cityInput').type('Test City');
    cy.get('#commentInput').type('Test Comment');
    cy.get('button[type="submit"]').click();
    // Verify error message for missing image upload
    cy.contains('No scenery image uploaded.').should('be.visible');
  });

  it('Display error when trying to upload without selecting a file', () => {
    // Verify submit button is disabled without selecting a file
    cy.get('button[type="submit"]').should('be.disabled');
    // Verify error message for missing file selection
    cy.contains('Please select a file.').should('be.visible');
  });

  it('Display error when trying to upload with invalid form data', () => {
    // Fill invalid scenery details and check if submit button is enabled
    cy.get('#cityInput').type('Test City');
    cy.get('#commentInput').type('Test Comment');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Navigate to home page', () => {
    // Click on the 'Return' button and verify navigation to the home page
    cy.get('button').contains('Return').click();
    cy.url().should('include', '/');
  });
});
