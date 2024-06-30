describe('Register Page', () => {
  beforeEach(() => {
    // Before each test, visit the register page '/register'
    cy.visit('/register');
  });

  it('Register a new user successfully', () => {
    // Generate a random username and email for registration
    const randomString = Math.random().toString(36).substring(7);
    const username = `testuser_${randomString}`;
    const email = `testuser_${randomString}@example.com`;
    // Fill out registration form
    cy.get('input[name="userName"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('PassWord123!');
    cy.get('input[name="confirmPassword"]').type('PassWord123!');
    // Submit form and verify successful registration message and redirection to login page
    cy.get('form').submit();
    cy.contains('Register successful!').should('be.visible');
    cy.location('pathname').should('eq','/login');
  });

  it('Display error messages for invalid register', () => {
    // Submit the form without filling out any fields
    cy.get('form').submit();
    // Verify if the registration failed error message is displayed
    cy.contains('Registration failed:').should('be.visible');
  });

  it('Display error messages for invalid email inputs', () => {
    // Fill out the form with invalid email format
    cy.get('input[name="userName"]').type('testuser1');
    cy.get('input[name="email"]').type('testuser1example.com');
    cy.get('input[name="password"]').type('PassWord123!');
    cy.get('input[name="confirmPassword"]').type('PassWord123!');
    // Submit form and verify specific error messages related to invalid email format
    cy.get('form').submit();
    cy.contains('Email format error. Please enter a valid email.').should('be.visible');
    cy.contains('Registration failed: Please double check your register information').should('be.visible');
  });

})