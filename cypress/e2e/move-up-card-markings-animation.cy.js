describe("Move Up Marking Cards Animation", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should trigger move-up animation for remaining cards after deleting one card", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("sakt eshte");
        cy.get('[data-test="suggestion"]').should("be.visible");

        cy.get('[data-test="marking-card"]')
            .first()
            .find('[data-test="suggestion"]')
            .first()
            .click();

        cy.get('[data-test="marking-card"]')
            .first()
            .should("have.class", "fade-out");
        cy.get('[data-test="marking-card"]')
            .first()
            .should("have.class", "move-up-animation");
        cy.get('[data-test="marking-card"]').should("have.length", 2);
    });
});
