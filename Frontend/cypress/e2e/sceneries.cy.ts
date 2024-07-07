describe('Sceneries Page', () => {
  beforeEach(() => {
    // Before each test, visit the sceneries page '/sceneries'
    cy.visit('/sceneries'); 
  });

  it('Display sceneries and handle sorting', () => {
    // Ensure the page has loaded by checking that the circular progress indicator is not present
    cy.get('.MuiCircularProgress-root').should('not.exist'); 
    // Check if there are more than zero scenery items displayed
    cy.get('.MuiGrid-container .MuiGrid-item').should('have.length.greaterThan', 0);

    // Sort by name and verify the first scenery name is '99 islands'
    cy.contains('button', 'Name').click();
    cy.get('.MuiGrid-container .MuiGrid-item').first().contains('h5', '1paris').should('exist');

    // Sort by country and verify the first scenery's country is 'Vietnam'
    cy.contains('button', 'Country').click();
    cy.get('.MuiSwitch-input').click({multiple: true});
    cy.get('.MuiGrid-container .MuiGrid-item').first().within(() => {
      cy.get('.MuiCardHeader-title').within(() => {
        cy.contains('Vietnam').should('exist');
      });
    });

    // Sort by city and verify the first scenery's city is 'Japan'
    cy.contains('button', 'City').click();
    // Wait for sorting to complete
    cy.wait(1000);
    cy.get('.MuiGrid-container .MuiGrid-item').first().within(() => {
      cy.get('.MuiCardHeader-title').within(() => {
        cy.contains('Japan').should('exist');
      });
    });
  });

  it('Paginate sceneries', () => {
    // Check if the pagination component exists
    cy.get('.MuiPagination-ul').should('exist');

    // Click on page 2 and verify it is selected
    cy.get('.MuiPagination-ul li').contains('2').click();
    cy.get('.MuiPaginationItem-page.Mui-selected').contains('2').should('exist');

    // Verify there are more than zero scenery items on the current page after pagination
    cy.get('.MuiGrid-container .MuiGrid-item').should('have.length.greaterThan', 0); 
  });
});