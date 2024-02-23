describe("Typing in the Editor Removes the Focused Typo", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should remove the focused marking when typing in the editor", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim asd ");
        cy.get(".typo").first().click();
        cy.get('[data-test="highlighted-marking"]').should(
            "have.text",
            "gabmim"
        );
        cy.get('[data-test="highlighted-marking"]')
            .contains("asd")
            .should("not.exist");
        cy.get('[data-test="editor"]').type("{end}");
        cy.get('[data-test="editor"]').type("pra ");
        cy.get('[data-test="marking-span"]')
            .contains("gabmim")
            .should("exist");
        cy.get('[data-test="marking-span"]')
            .contains("asd")
            .should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
