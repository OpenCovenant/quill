describe("Removing Highlighted Marking", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should remove the focused highlight when clicking on remove-highlighted-marking", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd ");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="editor"]').type("asd ");
        cy.get(".typo").first().click();
        cy.get('[data-test="highlighted-marking"]')
            .contains("asd")
            .should("exist");
        cy.get('[data-test="blur-marking-button"]').click();
        cy.get('[data-test="marking-span"]')
            .contains("asd")
            .should("exist");
        cy.get('[data-test="marking-span"]')
            .contains("gabmim")
            .should("exist");
        cy.get('[data-test="marking-span"]')
            .contains("asd")
            .should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
