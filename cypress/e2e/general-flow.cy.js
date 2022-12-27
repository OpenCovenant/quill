describe('a general flow of quill', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/');
    })

    it('contains the editor in which we want to write', () => {
        cy.get("#editor").should("exist");
    });

    it('will mark typos in the editor', () => {
        cy.get("#editor").should("exist");
        cy.get("#editor").contains("p");
        cy.get("#editor>p>.typo").should("not.exist");
        cy.get("#editor").type("asd ");
        cy.get("#editor>p>.typo").should("exist");
    });

    it('will mark loanwords in the editor', () => {
        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get("#editor").type("lider ");
        cy.get("#editor > p > .loanword").should("exist");
    });
});

