describe('Header Navigatiion', () => {
  beforeEach(() => {
    // Before each test, visit the homepage '/'
    cy.visit('/');
  });

  it('Navigate to Sceneries on link click', () => {
    // Click on the 'Sceneries' link and verify URL change
    cy.get('a[href="/sceneries"]').first().click();
    cy.url().should('include', '/sceneries');
  })

  it('Navigate to Login on link click', () => {
    // Click on the 'Login' link and verify URL change
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  })

  it('Navigate to Register on link click', () => {
    // Click on the 'Register' link and verify URL change
    cy.get('a[href="/register"]').click();
    cy.url().should('include', '/register');
  })

  it('Navigate to Homepage on "Sceneries Sharing" click', () => {
    // Click on the 'Sceneries Sharing' link and verify URL change
    cy.get('a[href="/"]').click();
    cy.url().should('include', '/');
  })

  it('Display login and register links when not logged in', () => {
    // Ensure 'Login' and 'Register' links are visible when not logged in
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/register"]').should('be.visible');
    // Navigate to a page that requires login and verify redirection
    cy.visit('/upload');
    cy.url().should('include', '/login');
  });

  it('Display user-specific links when logged in', () => {
    // Log in with mock credentials and verify UI changes
    cy.get('a[href="/login"]').click();
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/');
    // Verify 'Login' and 'Register' links are no longer visible, and 'Upload' link is visible
    cy.get('a[href="/login"]').should('not.exist');
    cy.get('a[href="/register"]').should('not.exist');
    cy.get('a[href="/upload"]').should('be.visible');
  });

  it('Log out successfully', () => {
    // Log in with mock credentials
    cy.get('a[href="/login"]').click();
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');

    // After successful login, log out and verify UI changes
    cy.get('a[href="/login"]').should('not.exist');
    cy.get('a[href="/register"]').should('not.exist');
    cy.get('a[href="/sceneries"]').should('be.visible');

    cy.contains('Logout').click();
    cy.url().should('include', '/');
    // Verify 'Logout' redirects to homepage and 'Login', 'Register', 'Sceneries' links are visible
    cy.get('a[href="/"]').should('be.visible');
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/register"]').should('be.visible');
    cy.get('a[href="/sceneries"]').should('be.visible');
  });

  it('Switch between dark and light mode', () => {
    // Verify background color changes when switching between dark and light modes
    cy.get('body').should('have.css', 'background-color').and('match', /rgb\(234,\s*234,\s*234\)/);
    cy.get('[data-testid="dark-mode-switch"]').click();
    cy.get('body').should('have.css', 'background-color').and('match', /rgb\(18,\s*18,\s*18\)/);
    cy.get('[data-testid="dark-mode-switch"]').click();
    cy.get('body').should('have.css', 'background-color').and('match', /rgb\(234,\s*234,\s*234\)/);
  });

});