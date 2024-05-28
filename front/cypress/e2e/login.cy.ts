describe('Login spec', () => {

  const loginAccount = {
    email: 'yoga@studio.com',
    password: 'password!',
  };

  it('should not be possible to proceed with the login process because the submit button is disabled due to an incorrect email input', () => {
    cy.visit('/login');

    const emailNotCorrectlyFormattedAccount = {
      ...loginAccount,
      email: 'yogastudio.com',
    };
    cy.get('input[formControlName=email]').type(emailNotCorrectlyFormattedAccount.email);
    cy.get('input[formControlName=password]').type(emailNotCorrectlyFormattedAccount.password);

    cy.get('#submitButton').should('be.disabled');
  });

  it('Login successfully', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', loginAccount);

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type(loginAccount.email);
    cy.get('input[formControlName=password]').type(loginAccount.password);

    cy.get('#submitButton').should('be.enabled');
    cy.get('#submitButton').click();

    cy.url().should('include', '/sessions')
  })
});
