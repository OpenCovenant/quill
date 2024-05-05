describe("Removing Highlighted Marking", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should remove the focused highlight when clicking on blurring the highlighted marking", () => {
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get(".typo").first().click();
        cy.get('[data-test="highlighted-marking"]')
            .contains("asd")
            .should("be.visible");

        cy.get('[data-test="blur-marking-button"]').click();
        cy.get('[data-test="highlighted-marking"]').should("not.exist");
        cy.get('[data-test="marking-span"]').contains("asd").should("be.visible");
        cy.get('[data-test="marking-span"]').contains("gabmim").should("be.visible");
        cy.get('[data-test="marking-span"]').contains("asd").should("be.visible");
    });
});
