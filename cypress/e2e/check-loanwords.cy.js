describe("Editor Interaction with Loanword TextField", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should reflect changes in the editor when suggestions of loanwords are applied", () => {
        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("prijës").click();
        cy.get('[data-test="editor"]').contains("prijës").should("be.visible");
        cy.get('[data-test="clear-editor-icon"]').click();
        cy.get(".loanword").should("not.exist");

        cy.get('[data-test="editor"]').type("lider ");
        cy.get('[data-test="suggestion"]').contains("udhëheqës").click();
        cy.get('[data-test="editor"]').contains("udhëheqës").should("be.visible");
    });
});
