describe('Home Page', () => {
  beforeEach(() => {
      cy.visit('/');
  });

  it('Display slider images', () => {
      cy.get('.slick-slide:not(.slick-cloned)').should('have.length', 5);
  });

  it('Display welcome message', () => {
      cy.contains('Welcome to share your sceneries!').should('be.visible');
  });

  it('Display "Click to enjoy more!" link', () => {
      cy.contains('Click to enjoy more!').should('be.visible');
  });

  it('Navigate to Sceneries when clicking "Click to enjoy more!" ', () => {
      cy.contains('Click to enjoy more!').click();
      cy.url().should('include', '/sceneries');
  });
});
