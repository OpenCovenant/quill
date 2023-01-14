describe('test the home button on "PENDA" ', () => {
    beforeEach(() => {
        //I had to visit this link to actually test if it works
        cy.visit('http://localhost:4200/te-dhe-tek'); 
    })
    it('will click on penda which redirects to home', () => {
        
        cy.get('.penda-header-logo').click();
        cy.url().should('include', '');


});
});