describe('Upload Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.get('a[href="/upload"]').first().click({ multiple: true });
  });

  it('Upload a valid scenery without image', () => {
      cy.get('#sceneryNameInput').should('be.visible').type('Test Scenery');
      cy.get('#countryInput').type('Test Country');
      cy.get('#cityInput').type('Test City');
      cy.get('#commentInput').type('Test Comment');
      cy.get('button[type="submit"]').click();
      cy.contains('No scenery image uploaded.').should('be.visible');
  });

  it('Display error when trying to upload without selecting a file', () => {
      cy.get('button[type="submit"]').should('be.disabled');
      cy.contains('Please select a file.').should('be.visible');
  });

  it('Display error when trying to upload with invalid form data', () => {
      cy.get('#cityInput').type('Test City');
      cy.get('#commentInput').type('Test Comment');
      cy.get('button[type="submit"]').should('be.visible');
  });

  it('Navigate to home page', () => {
    cy.get('button').contains('Return').click();
    cy.url().should('include', '/');
  });
});
