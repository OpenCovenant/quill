describe('test for history button', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/'); 
    })

    it('will test the history section and togle the history button on/off', () => {

        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("test");
        cy.wait(16000);
        cy.get('button.bi-clock-history').click();
        cy.get('p#writtenText').contains("test").should("exist");
        cy.get('button#closeWrittenTextsModalButton').click();
        cy.get('input#flexSwitchCheckChecked').click();
        cy.get('div.modal-body').contains('p#writtenText').should("not.exist");
    }); 

});