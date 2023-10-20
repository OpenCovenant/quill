describe("Suggestion Marking - Fade right animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Will replace all markings with the first suggestions. Will trigger fade animation", () => {
        // Check initial state
        cy.get("#editor > p > .typo").should("not.exist");

        // Add some text
        cy.get('[data-test="editor"]').type("asd ");
        cy.get('[data-test="editor"]').type("te ");
        cy.get('[data-test="editor"]').type("mjeku ");
        cy.get('[data-test="editor"]').type("fëmijsës ");

        // Wait for the button to appear
        cy.get('[data-test="suggestion"]').should("be.visible");

        // Click the first suggestion for each card
        cy.get(".sticky .card").each((card, index) => {
            cy.wrap(card).find('[data-test="suggestion"]:first').click();
        });

        cy.get(".sticky .card").should("not.exist");
    });
});
