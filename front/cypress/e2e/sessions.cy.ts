import {Session} from "../../src/app/features/sessions/interfaces/session.interface";

describe('Sessions page', () => {
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
  const nonAdminAccount = {
    id: 2,
    email: 'yoga@studio.com',
    firstName: 'user1_firstname',
    lastName: 'user1_lastname',
    admin: false,
    password: 'password!',
    createdAt: new Date('05/28/2024'),
    updatedAt: new Date('05/28/2024')
  };

  const currentSession : Session = {
    id: 1,
    name: 'Yoga session',
    description: 'Yoga session of the day',
    date: new Date(),
    teacher_id: 1,
    users: [2],
    createdAt: new Date('05/28/2024'),
    updatedAt: new Date('05/28/2024'),
  };

  const listSessions : Session[] = [currentSession];

  const listTeachers = [
    {
      id: 1,
      lastName: 'brice',
      firstName: 'denice',
      createdAt: new Date('05/28/2024'),
      updatedAt: new Date('05/28/2024'),
    },
    {
      id: 2,
      lastName: 'toto',
      firstName: 'toto',
      createdAt: new Date('05/28/2024'),
      updatedAt: new Date('05/28/2024'),
    },
  ];

  function formatString(date: Date){
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }

  beforeEach(() => {
    cy.intercept('GET', '/api/session', (req) => {
      req.reply(listSessions);
    });
    cy.intercept('GET', `/api/teacher`, listTeachers);
  });

  describe('As a user (admin or not)', () => {
    beforeEach(() => {
      cy.visit('/login');

      cy.intercept('POST', '/api/auth/login', adminAccount);

      cy.get('input[formControlName=email]').type(adminAccount.email);
      cy.get('input[formControlName=password]').type(adminAccount.password + '{enter}{enter}');

      cy.url().should('include', '/sessions');
    });

    it('should be able to load an existing session', () => {
      cy.get('#sessionContainer').should('have.length', listSessions.length);
    });
  });

  describe('As an admin user', () => {
    beforeEach(() => {
      cy.visit('/login');

      cy.intercept('POST', '/api/auth/login', adminAccount);
      cy.intercept('POST', '/api/session', (req) => {
        req.reply(currentSession);
      });

      cy.get('input[formControlName=email]').type(adminAccount.email);
      cy.get('input[formControlName=password]').type(adminAccount.password + '{enter}{enter}');

      cy.url().should('include', '/sessions');
    });

    it('should be able to interact with the button: create session', () => {
      cy.get('#createSessionButton').should('exist');
    });

    it('should NOT be able to save a session with missing filled inputs', () => {
      cy.get('#createSessionButton').click()
      cy.get('#saveButton').should('be.disabled');
    });

    it('should successfully create, update and delete a session', () => {
      //region Create Session

      cy.get('#createSessionButton').click()
      cy.get('input[formControlName=name]').type(currentSession.name);
      cy.get('input[formControlName=date]').type(formatString(currentSession.date));
      cy.get('mat-select[formControlName="teacher_id"]').then($select => {
        // trigger the dropdown to open
        $select.click();
        // select by value:
        cy.get('mat-option').contains(listTeachers[0].firstName).click();
      });

      cy.get('#saveButton').should('be.disabled');

      cy.get('textarea[formControlName=description]').type(currentSession.description);

      cy.get('#saveButton').should('be.enabled');

      cy.get('#saveButton').click();

      cy.get('mat-snack-bar-container').contains('Session created !').should('exist');
      cy.get('mat-snack-bar-container').contains('Close').click();

      cy.get('#sessionContainer').should('have.length', 1);

      cy.get('#sessionName').should('contain', currentSession.name);
      cy.get('#sessionDescription').should('contain', currentSession.description);

      //endregion

      //region Update Session
      let dateToday = new Date();

      const updatedSession ={
        ...currentSession,
        name: 'Yoga session (updated)',
        description: 'Yoga session of the day (updated)',
        date: new Date(dateToday.setDate(dateToday.getDate() + 1)) //+1 day for update purpose
      }

      cy.intercept('GET', `/api/session/${currentSession.id}`, currentSession);
      cy.intercept('PUT', `/api/session/${currentSession.id}`, (req) => {
        listSessions.splice(0, 1, updatedSession); //replace with new modified session entity
        req.reply(updatedSession);
      });

      cy.get('#editSessionButton').click()
      cy.get('input[formControlName=name]').clear().type(updatedSession.name);
      cy.get('input[formControlName=date]').clear().type(formatString(updatedSession.date));
      cy.get('mat-select[formControlName="teacher_id"]').then($select => {
        // trigger the dropdown to open
        $select.click();
        // select by value:
        cy.get('mat-option').contains(listTeachers[1].firstName).click();
      });

      cy.get('textarea[formControlName=description]').clear().type(updatedSession.description);

      cy.get('#saveButton').click();

      cy.get('mat-snack-bar-container').contains('Session updated !').should('exist');
      cy.get('mat-snack-bar-container').contains('Close').click();

      cy.get('#sessionName').should('contain', updatedSession.name);
      cy.get('#sessionDescription').should('contain', updatedSession.description);
      //endregion

      //region Delete Session
      cy.intercept('GET', `/api/teacher/${listTeachers[0].id}`, (req) => {
        req.reply({statusCode: 200});
      });
      cy.intercept('DELETE', `/api/session/${updatedSession.id}`, (req) => {
          listSessions.splice(0,1); //remove existing session
          req.reply({statusCode: 200});
        }
      )

      cy.get('#detailSessionButton').click();

      cy.get('#deleteSessionButton').should('exist');

      cy.get('#deleteSessionButton').click();

      cy.get('mat-snack-bar-container').contains('Session deleted !').should('exist');
      cy.get('mat-snack-bar-container').contains('Close').click();
      //endregion
    });
  });
});
