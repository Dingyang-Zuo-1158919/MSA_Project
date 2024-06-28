describe('AboutPage', () => {
  beforeEach(() => {
    cy.visit('/sceneries');
    cy.get('.MuiGrid-container .MuiCard-root').first().contains('View').click();
  });

  it('Display scenery details correctly', () => {
    cy.get('img').should('be.visible');
    cy.get('h3').should('contain.text', '99 island');
    cy.get('h4').should('contain.text', 'Japan - Sasebo');
    cy.contains('Uploader Comment:').should('be.visible');
  });

  it('Handle collection functionality', () => {
    cy.visit('/login');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.get('a[href="/sceneries"]').first().click({ multiple: true });
    cy.get('.MuiGrid-container .MuiCard-root').first().contains('View').click();
    cy.wait(2000);
    cy.get('[data-testid="collect-button"]').contains('Collect').should('exist');
  });

  it('Handle deletion without logged in', () => {
    cy.get('button').contains('Delete').should('be.disabled');
  });

  it('Return button functionality', () => {
    cy.get('button').contains('Return').click();
    cy.url().should('include', '/');
  });

  it('Display login message if user is not authenticated', () => {
    cy.contains('log in to enable below operations').should('be.visible');
  });
});