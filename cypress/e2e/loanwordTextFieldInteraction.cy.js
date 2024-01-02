describe("Editor Interaction with Loanword TextField", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should reflect changes in the loanword text field when suggestions are clicked in the editor", () => {
        cy.get(".loanword").should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("prijës").click();
        cy.get('[data-test="editor"]').contains("prijës").should("exist");
        cy.get('[data-test="clear-editor-icon"]').click();

        cy.get(".loanword").should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("drejtues").click();
        cy.get('[data-test="editor"]').contains("drejtues").should("exist");
        cy.get('[data-test="clear-editor-icon"]').click();

        cy.get(".loanword").should("not.exist");
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("udhëheqës").click();
        cy.get('[data-test="editor"]').contains("udhëheqës").should("exist");
        cy.get('[data-test="clear-editor-icon"]').click();
    });
});
