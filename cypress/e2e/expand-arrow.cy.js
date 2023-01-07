describe('click on the expand arrow and click on all suggestions and close it again', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/'); 
    })


    it('will click on the expand arrow and click on all suggestions and close it again', () => {

        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("fshji ");
        cy.get('h3.bi-arrow-right-square').click();
        cy.get('button.suggestion').contains("afshi").click();
        cy.get("#editor").contains("afshi").should("exist");
        cy.get("#editor").clear();

        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("fshji ");
        cy.get('h3.bi-arrow-right-square').click();
        cy.get('button.suggestion').contains("fshiu").click();
        cy.get("#editor").contains("fshiu").should("exist");
        cy.get("#editor").clear();

        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("fshji ");
        cy.get('h3.bi-arrow-right-square').click();
        cy.get('button.suggestion').contains("shaji").click();
        cy.get("#editor").contains("shaji").should("exist");
        cy.get('h3.bi-arrow-left-square').click();
        cy.get("#editor").clear();
    });

});