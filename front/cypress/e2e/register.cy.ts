describe('Register page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  const signUpAccount = {
    firstname: "John",
    lastname: "Doe",
    email: 'yoga@studio.com',
    password: 'password!',
  };

  it('should not be possible to proceed with the sign-up process because the submit button is disabled due to a missing input(firstname)', () => {
    cy.get('input[formControlName=lastName]').type(signUpAccount.lastname);
    cy.get('input[formControlName=email]').type(signUpAccount.email);
    cy.get('input[formControlName=password]').type(signUpAccount.password);

    cy.get('#submitButton').should('be.disabled');
  });

  it('should not be possible to proceed with the sign-up process because the submit button is disabled due to a missing input(lastname)', () => {
    cy.get('input[formControlName=firstName]').type(signUpAccount.firstname);
    cy.get('input[formControlName=email]').type(signUpAccount.email);
    cy.get('input[formControlName=password]').type(signUpAccount.password);

    cy.get('#submitButton').should('be.disabled');
  });

  it('should not be possible to proceed with the sign-up process because the submit button is disabled due to a malformated user email', () => {
    const emailNotCorrectlyFormattedAccount = {
      ...signUpAccount,
      email: 'yogastudio.com',
    };

    cy.get('input[formControlName=firstName]').type(signUpAccount.firstname);
    cy.get('input[formControlName=lastName]').type(signUpAccount.lastname);
    cy.get('input[formControlName=email]').type(emailNotCorrectlyFormattedAccount.email);
    cy.get('input[formControlName=password]').type(signUpAccount.password);

    cy.get('#submitButton').should('be.disabled');
  });

  it('Should fail to create account because of a network failure', () => {
    cy.intercept('POST', '/api/auth/register', {
      forceNetworkError: true // Simulates a network failure
    }).as('registerApiRequest');

    cy.get('input[formControlName=firstName]').type(signUpAccount.firstname);
    cy.get('input[formControlName=lastName]').type(signUpAccount.lastname);
    cy.get('input[formControlName=email]').type(signUpAccount.email);
    cy.get('input[formControlName=password]').type(signUpAccount.password);

    cy.get('#submitButton').should('be.enabled');

    cy.get('#submitButton').click();

    cy.wait('@registerApiRequest');
    cy.get('.error').should('be.visible');
  });

  it('Should sign up account successfully and redirect to the login page', () => {
    cy.intercept('POST', '/api/auth/register', signUpAccount);

    cy.get('input[formControlName=firstName]').type(signUpAccount.firstname);
    cy.get('input[formControlName=lastName]').type(signUpAccount.lastname);
    cy.get('input[formControlName=email]').type(signUpAccount.email);
    cy.get('input[formControlName=password]').type(signUpAccount.password);

    cy.get('#submitButton').should('be.enabled');

    cy.get('#submitButton').click();

    cy.url().should('include', '/login')
  });
});
