xdescribe("Clicking on editor placeholder must not lose the focus on editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Clicking on placeholder text should not lose focus on editor", () => {
        cy.get('[data-test="editor-placeholder-text"]').click();
        cy.get('[data-test="editor"]').should('be.focused');
    });
});
