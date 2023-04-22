describe("test for the x button that clears test on editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it('will click on the "x" button and check if the text is clear', () => {
        cy.get('[data-test="clear-editor-icon"]').should("not.exist");
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("saktë");
        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get('[data-test="editor"]').contains("saktë").should("not.exist");
        cy.get('[data-test="clear-editor-icon"]').should("not.exist");
    });
});
