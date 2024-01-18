describe("Clear Editor Button Functionality", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it('should clear the text in the editor when the "x" button is clicked', () => {
        cy.get('[data-test="clear-editor-icon"]').should("not.exist");
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("saktë");
        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get('[data-test="editor"]').contains("saktë").should("not.exist");
        cy.get('[data-test="clear-editor-icon"]').should("not.exist");
    });
});
