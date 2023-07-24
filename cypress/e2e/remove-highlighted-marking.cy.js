describe("Clicking on the remove-highlighted-marking actually removes the highlighted marking.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on the remove highlighted-marking and check if it removes the focused highlight ", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd ");
        cy.get('[data-test="editor"]').type(" gabmim ");
        cy.get('[data-test="editor"]').type(" asd ");
        cy.get('#editor .typo:first-of-type').click();
        cy.get('div.grid1 span.text-marking.typo').should('contain', 'asd');
        cy.get('div.grid1 span.text-marking.typo').contains("gabmim").should("not.exist");
        cy.get('[data-test="dismiss-marking-button"]').click();
        cy.get('div.grid1 span.text-marking.typo').contains("asd").should("exist");
        cy.get('div.grid1 span.text-marking.typo').contains("gabmim").should("exist");
        cy.get('div.grid1 span.text-marking.typo').contains("asd").should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
