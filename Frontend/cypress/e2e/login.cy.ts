describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('display login form elements', () => {
    cy.get('h1').should('contain', 'Log in');
    cy.get('input[name="userName"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
    cy.get('a[href="/register"]').should('contain', "Don't have an account? Sign Up");
  });

  it('show error for incorrect login', () => {
    cy.get('input[name="userName"]').type('invalidusername');
    cy.get('input[name="password"]').type('invalidpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Login failed: Request failed with status code 401').should('be.visible');
  });

  it('log in successfully with correct credentials', () => {
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
    cy.url().should('include', '/');
    cy.get('a[href="/login"]').should('not.exist');
    cy.get('a[href="/register"]').should('not.exist');
    cy.get('a[href="/upload"]').should('be.visible');
    cy.contains('Welcome back, testuser').should('be.visible');
  });

  it('navigate to registration page', () => {
    cy.contains("Don't have an account? Sign Up").click();
    cy.url().should('include', '/register');
  });

  it('should display success message after successful login', () => {
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
    cy.get('.MuiSnackbarContent-message').should('contain', 'Login successful!');
  });

});