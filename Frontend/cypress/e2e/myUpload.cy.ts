describe('My Upload', () => {
  beforeEach(() => {
    cy.visit('/login');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.get('button[aria-label="select merge strategy"]').click();
    cy.contains('My Upload').click();
  });

  it('Display user upload', () => {
    cy.get('.single-scenery').should('have.length.greaterThan', 0);
  });

  it('Sort collection by name, country, and city', () => {
    cy.contains('Sort By:').should('be.visible');
    cy.contains('Name').click();
    cy.get('.single-scenery')
      .first()
      .find('.scenery-name')
      .invoke('text')
      .then(firstSceneryName => {
        cy.get('.single-scenery')
          .last()
          .find('.scenery-name')
          .invoke('text')
          .should(lastSceneryName => {
            expect(firstSceneryName.localeCompare(lastSceneryName)).to.equal(0);
          });
      });

    cy.contains('Country').click();
    cy.get('.single-scenery')
      .first()
      .find('.scenery-country')
      .invoke('text')
      .then(firstSceneryCountry => {
        cy.get('.single-scenery')
          .last()
          .find('.scenery-country')
          .invoke('text')
          .should(lastSceneryCountry => {
            expect(firstSceneryCountry.localeCompare(lastSceneryCountry)).to.equal(0);
          });
      });

    cy.contains('City').click();
    cy.get('.single-scenery')
      .first()
      .find('.scenery-city')
      .invoke('text')
      .then(firstSceneryCity => {
        cy.get('.single-scenery')
          .last()
          .find('.scenery-city')
          .invoke('text')
          .should(lastSceneryCity => {
            expect(firstSceneryCity.localeCompare(lastSceneryCity)).to.equal(0);
          });
      });
  });

  it('Change sort order', () => {
    cy.contains('Sort Order: Ascending').should('be.visible');
    cy.get('.MuiSwitch-root').last().click({ multiple: true });
    cy.get('.single-scenery')
      .first()
      .find('.scenery-name')
      .invoke('text')
      .then(firstSceneryName => {
        cy.get('.single-scenery')
          .last()
          .find('.scenery-name')
          .invoke('text')
          .should(lastSceneryName => {
            expect(firstSceneryName.localeCompare(lastSceneryName)).to.equal(0);
          });
      });
  });

})