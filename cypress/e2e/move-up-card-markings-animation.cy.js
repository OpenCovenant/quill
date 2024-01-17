describe("Move Up Marking Cards Animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should trigger move-up animation for remaining cards after deleting one card", () => {
        // Check initial state
        cy.get(".typo").should("not.exist");

        // Add some text
        cy.get('[data-test="editor"]').type("sakt eshte");

        // Wait for the button to appear
        cy.get('[data-test="suggestion"]').should("be.visible");

        cy.get('[data-test="marking-card"]').first()
            .find('[data-test="suggestion"]').first()
            .click();

        //Check if card has the fade-out class
        cy.get('[data-test="marking-card"]').first().should("have.class", "fade-out");

        //wait for the animation to complete
        cy.wait(500);

        // Checks if other cards have triggered the move-up-animation
        cy.get('[data-test="marking-card"]').first().should("have.class", "move-up-animation");

        // Checks if other cards still exist
        cy.get('[data-test="marking-card"]').should("have.length", 2);
    });
});
