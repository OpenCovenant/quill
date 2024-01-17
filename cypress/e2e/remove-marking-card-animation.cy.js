describe("Remove Marking - Fade Right Animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should remove all cards and trigger fade-out animation", () => {
        // Check initial state
        cy.get(".typo").should("not.exist");

        // Type some text
        cy.get('[data-test="editor"]').type("sakt eshte");

        // Wait for the button to appear
        cy.get('[data-test="dismiss-marking-button"]').should("be.visible");

        // Click the button for each card
        cy.get('[data-test="marking-card"]').each((card, index) => {
            cy.wrap(card).find('[data-test="dismiss-marking-button"]').click();

            cy.wrap(card).should("not.exist");
        });
    });
});
