describe('Login Page', () => {
  beforeEach(() => {
    // Before each test, visit the login page '/login'
    cy.visit('/login');
  });

  it('Display login form elements', () => {
    // Verify presence of login form elements
    cy.get('h1').should('contain', 'Log in');
    cy.get('input[name="userName"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
    cy.get('a[href="/register"]').should('contain', "Don't have an account? Sign Up");
  });

  it('Display error for incorrect login', () => {
    // Attempt login with invalid credentials and verify error message
    cy.get('input[name="userName"]').type('invalidusername');
    cy.get('input[name="password"]').type('invalidpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Login failed: Request failed with status code 401').should('be.visible');
  });

  it('Log in successfully with correct credentials', () => {
    // Intercept login request and simulate successful login
    cy.intercept('POST', `${Cypress.env('API_URL')}/Users/Login`, {
      statusCode: 200,
      body: {
        userName: 'testuser',
      }
    }).as('loginRequest');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    // Verify successful login redirects to homepage '/'
    cy.url().should('include', '/');
    // Ensure 'Login' and 'Register' links are no longer visible, and 'Upload' link is visible
    cy.get('a[href="/login"]').should('not.exist');
    cy.get('a[href="/register"]').should('not.exist');
    cy.get('a[href="/upload"]').should('be.visible');
    // Verify welcome message for logged in user
    cy.contains('Welcome back, testuser').should('be.visible');
  });

  it('Navigate to registration page', () => {
    // Click on 'Sign Up' link and verify navigation to registration page
    cy.contains("Don't have an account? Sign Up").click();
    cy.url().should('include', '/register');
  });

  it('Display success message after successful login', () => {
    // Intercept login request and simulate successful login
    cy.intercept('POST', `${Cypress.env('API_URL')}/Users/Login`, {
      statusCode: 200,
      body: {
        userName: 'testuser',
      }
    }).as('loginRequest');
    const mockUsername = "testuser";
    const mockPassword = "TestPass123!";
    cy.get('input[name="userName"]').type(mockUsername);
    cy.get('input[name="password"]').type(mockPassword);
    cy.get('button[type="submit"]').click();
    // Verify success message appears after successful login
    cy.get('.MuiSnackbarContent-message').should('contain', 'Login successful!');
  });

});