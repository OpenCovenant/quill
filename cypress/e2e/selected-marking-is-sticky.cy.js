describe("Sticky Marking Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should remain on the screen after adding multiple new lines", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim");

        for (let i = 0; i < 30; ++i) {
            cy.get("#editor").type("{enter}");
        }

        cy.get(".typo").first().click();
        cy.scrollTo("bottom");
        cy.get('[data-test="highlighted-text-marking"]').should("be.visible");
        cy.get('[data-test="editor"]').clear();
    });
});
