describe('Header Navigatiion', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Navigate to Sceneries on link click', () => {
    cy.get('a[href="/sceneries"]').first().click();
    cy.url().should('include', '/sceneries');
  })

  it('Navigate to Login on link click', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  })

  it('Navigate to Register on link click', () => {
    cy.get('a[href="/register"]').click();
    cy.url().should('include', '/register');
  })

  it('Navigate to Homepage on "Sceneries Sharing" click', () => {
    cy.get('a[href="/"]').click();
    cy.url().should('include', '/');
  })

  it('Shows login and register links when not logged in', () => {
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/register"]').should('be.visible');
    cy.visit('/upload');
    cy.url().should('include', '/login');
  });

  it('Shows user-specific links when logged in', () => {
    cy.get('a[href="/login"]').click();
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/');
    cy.get('a[href="/login"]').should('not.exist');
    cy.get('a[href="/register"]').should('not.exist');
    cy.get('a[href="/upload"]').should('be.visible');
  });

  it('Logs out successfully', () => {
    cy.get('a[href="/login"]').click();
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');

    cy.get('a[href="/login"]').should('not.exist');
    cy.get('a[href="/register"]').should('not.exist');
    cy.get('a[href="/sceneries"]').should('be.visible');

    cy.contains('Logout').click();
    cy.url().should('include', '/');
    cy.get('a[href="/"]').should('be.visible');
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/register"]').should('be.visible');
    cy.get('a[href="/sceneries"]').should('be.visible');
  });

  it('Switches between dark and light mode', () => {
    cy.get('body').should('have.css', 'background-color').and('match', /rgb\(234,\s*234,\s*234\)/); 
    cy.get('[data-testid="dark-mode-switch"]').click(); 
    cy.get('body').should('have.css', 'background-color').and('match', /rgb\(18,\s*18,\s*18\)/);
    cy.get('[data-testid="dark-mode-switch"]').click();
    cy.get('body').should('have.css', 'background-color').and('match', /rgb\(234,\s*234,\s*234\)/);
  });

});