describe('Error Page', () => {
  beforeEach(() => {
    cy.visit('/nonexistentpage'); 
  });

  it('Display the error page with correct content', () => {
    cy.get('h1').should('contain.text', '404');
    cy.get('h4').should('contain.text', 'Oops! Page not found.');
    cy.contains('Go Back').should('be.visible');
  });

  it('Navigate to homepage on "Go Back" button click', () => {
    cy.get('button').contains('Go Back').click();
    cy.url().should('include', '/homepage');
  });

});