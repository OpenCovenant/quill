describe("Move up markings cards animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Will delete one card and trigger the move up animation for the remaining cards", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="suggestion"]').should("be.visible");

        cy.get('[data-test="marking-card"]').first()
            .find('[data-test="suggestion"]').first()
            .click();

        cy.get('[data-test="marking-card"]').first().should("have.class", "fade-out");
        cy.get('[data-test="marking-card"]').first().should("have.class", "move-up-animation");
        cy.get('[data-test="marking-card"]').should("have.length", 2);
    });
});
