describe('not found page(404)', () => {
  it('Should show the not found page when the page does not exist', () => {
    cy.visit('/pagenotfound');

    cy.get('h1').should('contain', 'Page not found !');
  });
});
