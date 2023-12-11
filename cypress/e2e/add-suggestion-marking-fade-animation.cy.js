describe("Suggestion Marking - Fade right animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Will replace all markings with the first suggestions. Will trigger fade animation", () => {
        // Check initial state
        cy.get(".typo").should("not.exist");

        // Add some text
        cy.get('[data-test="editor"]').type("gabmim gabmim");

        // Wait for the button to appear
        cy.get('[data-test="suggestion"]').should("be.visible");

        // Click the first suggestion for each card
        cy.get('[data-test="marking-card"]').each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]').first().click();
        });

        cy.get('[data-test="marking-card"] .fade-out').should('not.exist');
    });
});
