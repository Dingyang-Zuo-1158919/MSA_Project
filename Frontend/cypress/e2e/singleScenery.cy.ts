describe('Single Scenery', () => {
  beforeEach(() => {
    cy.visit('/sceneries');
  });

  it('Display scenery details', () => {
    cy.contains("Australia").should('be.visible');
    cy.contains("City View").should('be.visible');
    cy.contains("Sydney").should('be.visible');
  });

  it('Display an image', () => {
    cy.get('img').should('be.visible');
  });

  it('Navigates to about page', () => {
    cy.get('.MuiGrid-container .MuiCard-root').first().contains('View').click();
    cy.url().should('include', `/about/`);
  });
});