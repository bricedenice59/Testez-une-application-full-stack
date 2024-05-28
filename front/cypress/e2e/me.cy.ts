describe('Account page', () => {
  const adminAccount = {
    id: 1,
    email: 'yoga@studio.com',
    firstName: 'user1_firstname',
    lastName: 'user1_lastname',
    admin: true,
    password: 'password!',
    createdAt: new Date('05/28/2024'),
    updatedAt: new Date('05/28/2024')
  };

  const notAdminAccount = {
    ...adminAccount,
    admin: false
  };

  beforeEach(() => {
    cy.intercept('GET', '/api/session', (req) => {
      req.reply([]);
    });
    cy.visit('/login');
  });

  it('should not be possible to proceed with the login process because the submit button is disabled due to an incorrect email input', () => {
    const emailNotCorrectlyFormattedAccount = {
      ...adminAccount,
      email: 'yogastudio.com',
    };
    cy.get('input[formControlName=email]').type(emailNotCorrectlyFormattedAccount.email);
    cy.get('input[formControlName=password]').type(emailNotCorrectlyFormattedAccount.password);

    cy.get('#submitButton').should('be.disabled');
  });

  describe('As an admin user', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', adminAccount);

      cy.intercept('GET', `/api/user/${adminAccount.id}`, (req) => {
        req.reply(adminAccount);
      });

      cy.get('input[formControlName=email]').type(adminAccount.email);
      cy.get('input[formControlName=password]').type(adminAccount.password);

      cy.get('#submitButton').click();
      cy.url().should('include', '/sessions');

      cy.get('#accountLink').click();
      cy.url().should('include', '/me');
    });

    it('should show all user information and show: You are admin, also delete button should not be displayed', () => {
      cy.get('#meNameLabel').contains(`Name: ${adminAccount.firstName} ${adminAccount.lastName.toUpperCase()}`);
      cy.get('#meEmailLabel').contains(`Email: ${adminAccount.email}`);
      cy.get('#meAdminLabel').contains(`You are admin`);
      cy.get('#meCreatedAtLabel').contains(`Create at: May 28, 2024`);
      cy.get('#meUpdatedAtLabel').contains(`Last update: May 28, 2024`);

      cy.get('#meDeleteButton').should('not.exist');
    });
  });

  describe('As a NOT admin user', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', notAdminAccount);

      cy.intercept('GET', `/api/user/${notAdminAccount.id}`, (req) => {
        req.reply(notAdminAccount);
      });

      cy.get('input[formControlName=email]').type(notAdminAccount.email);
      cy.get('input[formControlName=password]').type(notAdminAccount.password);

      cy.get('#submitButton').click();
      cy.url().should('include', '/sessions');

      cy.get('#accountLink').click();
      cy.url().should('include', '/me');
    });

    it('should show all user information and NOT show: You are admin, also delete button MUST be be displayed', () => {
      cy.get('#meNameLabel').contains(`Name: ${notAdminAccount.firstName} ${notAdminAccount.lastName.toUpperCase()}`);
      cy.get('#meEmailLabel').contains(`Email: ${notAdminAccount.email}`);
      cy.get('#meCreatedAtLabel').contains(`Create at: May 28, 2024`);
      cy.get('#meUpdatedAtLabel').contains(`Last update: May 28, 2024`);

      cy.get('#meAdminLabel').should('not.exist');
      cy.get('#meDeleteButton').should('exist');
    });

    it('should go back to the login page when delete account button is clicked', () => {
      cy.intercept('DELETE', `/api/user/${notAdminAccount.id}`, (req) => {
        req.reply(notAdminAccount);
      });
      cy.get('#meDeleteButton').click();

      cy.url().should('include', 'http://localhost:4200/'); //provided that test is run with server running on port 4200...
      cy.get('#accountLink').should('not.exist');
    });
  });
});
