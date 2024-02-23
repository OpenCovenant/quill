xdescribe("Sticky Marking", () => {
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
        // TODO: similar effect to cy.scrollTo("bottom"); cy.wait(3000); so why does the scroll "take time"?
        cy.get('[data-test="contact"]').dblclick();
        cy.get('[data-test="highlighted-marking"]').should("be.visible");
    });
});
