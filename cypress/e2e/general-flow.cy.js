describe('a general flow of quill', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/');
    })

    it('contains the editor in which we want to write', () => {
        cy.get("#editor").should("exist");
    });

    it('will mark typos in the editor', () => {
        cy.get("#editor").should("exist");
        cy.get("#editor").children().should("exist");
        cy.get("#editor>p").should("exist");
        cy.get("#editor>p").first().should("not.have.attr", "class", "typo");
        cy.get("#editor").type("asd ");
        cy.wait(5000);
        // cy.get("#editor>p>.typo").should("exist");
        cy.get("#editor>p").first().should("have.attr", "class", "typo");
    });

    it('will mark loanwords in the editor', () => {
        cy.wait(5000);
        cy.get("#editor > p > .loanword").should("not.exist");
        cy.get("#editor").type("lider ");
        cy.wait(5000);
        cy.get("#editor > p").children().should("exist");
    });
});

