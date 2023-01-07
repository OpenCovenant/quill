describe('test for button hiq', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/'); 
    })

        
    it('will click on hiq button and check if it deletes the text on editor', () => {
        
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("fshji ");
        cy.get('button.btn-outline-danger').contains("HIQ").click();
        cy.get("button.suggestion").should("not.exist");
        

    });
});