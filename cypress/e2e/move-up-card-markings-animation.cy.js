describe("Move up markings cards animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Will delete one card and trigger the move up animation for the remaining cards", () => {
        // Check initial state
        cy.get(".typo").should("not.exist");

        // Add some text
        cy.get('[data-test="editor"]').type("sakt eshte");

        // Wait for the button to appear
        cy.get('[data-test="suggestion"]').should("be.visible");

        cy.get(".sticky .card:first")
            .find('[data-test="suggestion"]:first')
            .click();

        //Check if card has the fade-out class
        cy.get(".sticky .card:first").should("have.class", "fade-out");

        //wait for the animation to complete
        cy.wait(500);

        // Checks if other cards have triggered the move-up-animation
        cy.get(".sticky .card:first").should("have.class", "move-up-animation");

        // Checks if other cards still exist
        cy.get(".sticky .card").should("have.length", 2);
    });
});
