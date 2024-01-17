describe("Proper Generation of Marked Text on the RHS", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should correctly generate marked text on the right-hand side without false updates when writing before marking", () => {
        const initialText = "pra gabmim kaq";
        cy.get('[data-test="editor"]').type(initialText);
        cy.wait(3000);
        for (let i = 0; i < initialText.length; i++) {
            cy.get('[data-test="editor"]').type("{leftArrow}");
        }
        cy.get('[data-test="editor"]').type("edhe ");
        // NOTE: timeout of 100 ms so that no other request will be made in the meantime
        cy.get(".typo-marking-header", { timeout: 100 }).should(
            "have.text",
            "gabmim "
        );
    });
});
