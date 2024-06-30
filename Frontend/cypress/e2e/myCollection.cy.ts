describe('My Collection', () => {
  beforeEach(() => {
    // Before each test, visit the login page '/login' and log in
    cy.visit('/login');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    // Wait for authentication to complete
    cy.wait(2000);
    // Navigate to 'My Collection' page
    cy.get('button[aria-label="select merge strategy"]').click();
    cy.contains('My Collection').click();
  });

  it('Display user collection', () => {
    // Verify that user's collection is displayed
    cy.get('.single-scenery').should('have.length.greaterThan', 0);
  });

  it('Sort collection by name, country, and city', () => {
    // Test sorting functionality by Name
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
            // Verify if the first scenery name is equal to the last scenery name (ascending order)
            expect(firstSceneryName.localeCompare(lastSceneryName)).to.equal(0);
          });
      });
    // Test sorting functionality by Country
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
            // Verify if the first scenery country is less than the last scenery country (ascending order)
            expect(firstSceneryCountry.localeCompare(lastSceneryCountry)).to.equal(-1);
          });
      });
    // Test sorting functionality by City
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
            // Verify if the first scenery city is less than the last scenery city (ascending order)
            expect(firstSceneryCity.localeCompare(lastSceneryCity)).to.equal(-1);
          });
      });
  });

  it('Change sort order', () => {
    // Verify default sort order is Ascending
    cy.contains('Sort Order: Ascending').should('be.visible');
    // Toggle the sort order to Descending
    cy.get('.MuiSwitch-root').last().click({ multiple: true });
    // Verify if the first scenery name is greater than the last scenery name (descending order)
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
            expect(firstSceneryName.localeCompare(lastSceneryName)).to.equal(-1);
          });
      });
  });

})