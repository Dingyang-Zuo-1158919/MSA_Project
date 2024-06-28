describe('Update Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.get('a[href="/sceneries"]').first().click({ multiple: true });
    cy.get('.MuiGrid-container .MuiCard-root').eq(0).contains('View').click();
    cy.wait(2000);
    cy.get('[data-testid="update-button"]').should('exist').contains('Update').click();
  });

  it('Update form data successfully', () => {
    cy.get('#sceneryNameInput').clear().type('0 Test Scenery');
    cy.get('#countryInput').clear().type('Test Country');
    cy.get('#cityInput').clear().type('Test City');
    cy.get('#commentInput').clear().type('Test Comment');

    cy.get('button[type="button"]').click({ multiple: true });
    cy.wait(1000);
    cy.url().should('include', '/about/');
  });

  it('Display error when trying to upload with invalid form data', () => {
    cy.get('#sceneryNameInput').clear();
    cy.get('#countryInput').clear();
    cy.get('button[type="button"]').should('be.disabled');
  });

  it('Navigate to home page', () => {
    cy.get('button').contains('Return').click();
    cy.url().should('include', '/');
  });

});