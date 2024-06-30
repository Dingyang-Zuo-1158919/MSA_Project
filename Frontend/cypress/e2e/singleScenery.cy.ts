describe('Single Scenery', () => {
  beforeEach(() => {
    // Before each test, visit the sceneries page '/sceneries'
    cy.visit('/sceneries');
  });

  it('Display scenery details', () => {
    // Verify if specific text elements related to the scenery are visible
    cy.contains("Australia").should('be.visible');
    cy.contains("City View").should('be.visible');
    cy.contains("Sydney").should('be.visible');
  });

  it('Display an image', () => {
    // Verify if an image related to the scenery is visible
    cy.get('img').should('be.visible');
  });

  it('Navigates to about page', () => {
    // Click on the 'View' button of the first scenery card and verify navigation to the about page
    cy.get('.MuiGrid-container .MuiCard-root').first().contains('View').click();
    cy.url().should('include', `/about/`);
  });
});