describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('Register a new user successfully', () => {
    const randomString = Math.random().toString(36).substring(7);
    const username = `testuser_${randomString}`;
    const email = `testuser_${randomString}@example.com`;
    cy.get('input[name="userName"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('PassWord123!');
    cy.get('input[name="confirmPassword"]').type('PassWord123!');

    cy.get('form').submit();
    cy.contains('Register successful!').should('be.visible');
    cy.location('pathname').should('eq','/login');
  });

  it('Display error messages for invalid register', () => {
    cy.get('form').submit();
    cy.contains('Registration failed:').should('be.visible');
  });

  it('Display error messages for invalid email inputs', () => {
    cy.get('input[name="userName"]').type('testuser1');
    cy.get('input[name="email"]').type('testuser1example.com');
    cy.get('input[name="password"]').type('PassWord123!');
    cy.get('input[name="confirmPassword"]').type('PassWord123!');
    cy.get('form').submit();
    cy.contains('Email format error. Please enter a valid email.').should('be.visible');
    cy.contains('Registration failed: Please double check your register information').should('be.visible');
  });

})