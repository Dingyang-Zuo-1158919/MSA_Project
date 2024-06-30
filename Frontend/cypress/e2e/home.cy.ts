describe('Home Page', () => {
    beforeEach(() => {
        // Before each test, visit the homepage '/'
        cy.visit('/');
    });

    it('Display slider images', () => {
        // Verify that the slider displays 5 non-cloned slides
        cy.get('.slick-slide:not(.slick-cloned)').should('have.length', 5);
    });

    it('Display welcome message', () => {
        // Ensure the welcome message is visible on the home page
        cy.contains('Welcome to share your sceneries!').should('be.visible');
    });

    it('Display "Click to enjoy more!" link', () => {
        // Verify the presence of the "Click to enjoy more!" link
        cy.contains('Click to enjoy more!').should('be.visible');
    });

    it('Navigate to Sceneries when clicking "Click to enjoy more!" ', () => {
        // Click on the "Click to enjoy more!" link and verify navigation to the Sceneries page
        cy.contains('Click to enjoy more!').click();
        cy.url().should('include', '/sceneries');
    });
});
