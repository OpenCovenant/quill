describe("Editor Interaction with Typo TextField", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should reflect changes in the typo text field when suggestions are clicked in the editor", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gabime").click();
        cy.get('[data-test="editor"]').contains("gabime").should("exist");
        cy.get('[data-test="editor"]').clear();

        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gabimi").click();
        cy.get('[data-test="editor"]').contains("gabimi").should("exist");
        cy.get('[data-test="editor"]').clear();

        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gazmim").click();
        cy.get('[data-test="editor"]').contains("gazmim").should("exist");
        cy.get('[data-test="editor"]').clear();

        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="suggestion"]').contains("gabim").click();
        cy.get('[data-test="editor"]').contains("gabim").should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
