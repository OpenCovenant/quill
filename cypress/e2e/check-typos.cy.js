describe("Editor Interaction with Typo TextField", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should reflect changes in the typo text field when suggestions are clicked in the editor", () => {
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gabime").click();
        cy.get('[data-test="editor"]').contains("gabime").should("be.visible");
        cy.get('[data-test="editor"]').clear();
        cy.get(".typo").should("not.exist");

        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gabim").click();
        cy.get('[data-test="editor"]').contains("gabim").should("be.visible");
        cy.get('[data-test="editor"]').clear();
    });
});
