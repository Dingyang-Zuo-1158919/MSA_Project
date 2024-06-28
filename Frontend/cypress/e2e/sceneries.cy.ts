describe('Sceneries Page', () => {
  beforeEach(() => {
    cy.visit('/sceneries'); 
  });

  it('Display sceneries and handle sorting', () => {
    cy.get('.MuiCircularProgress-root').should('not.exist'); 
    cy.get('.MuiGrid-container .MuiGrid-item').should('have.length.greaterThan', 0);


    cy.contains('button', 'Name').click();
    cy.get('.MuiGrid-container .MuiGrid-item').first().contains('h5', '99 islands').should('exist');

  
    cy.contains('button', 'Country').click();
    cy.get('.MuiSwitch-input').click({multiple: true});
    cy.get('.MuiGrid-container .MuiGrid-item').first().within(() => {
      cy.get('.MuiCardHeader-title').within(() => {
        cy.contains('Vietnam').should('exist');
      });
    });

    cy.contains('button', 'City').click();
    cy.wait(1000);
    cy.get('.MuiGrid-container .MuiGrid-item').first().within(() => {
      cy.get('.MuiCardHeader-title').within(() => {
        cy.contains('Japan').should('exist');
      });
    });
  });

  it('Paginate sceneries', () => {
    cy.get('.MuiPagination-ul').should('exist');

    cy.get('.MuiPagination-ul li').contains('2').click();
    cy.get('.MuiPaginationItem-page.Mui-selected').contains('2').should('exist');

    cy.get('.MuiGrid-container .MuiGrid-item').should('have.length.greaterThan', 0); 
  });
});