describe('Error Page', () => {
  beforeEach(() => {
    // Before each test, visit a non-existent page to trigger the error page
    cy.visit('/nonexistentpage'); 
  });

  it('Display the error page with correct content', () => {
    // Verify if the error page displays the correct status code and message
    cy.get('h1').should('contain.text', '404');
    cy.get('h4').should('contain.text', 'Oops! Page not found.');
    cy.contains('Go Back').should('be.visible');
  });

  it('Navigate to homepage on "Go Back" button click', () => {
    // Click on the 'Go Back' button and check if redirected to the homepage
    cy.get('button').contains('Go Back').click();
    cy.url().should('include', '/homepage');
  });

});