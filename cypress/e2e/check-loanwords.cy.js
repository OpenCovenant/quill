describe("Editor Interaction with Loanword TextField", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should reflect changes in the loanword text field when suggestions are clicked in the editor", () => {
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("prijës").click();
        cy.get('[data-test="editor"]').contains("prijës").should("be.visible");
        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get(".loanword").should("not.exist");

        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("udhëheqës").click();
        cy.get('[data-test="editor"]').contains("udhëheqës").should("be.visible");
        cy.get('[data-test="clear-editor-icon"]').click();
    });
});
