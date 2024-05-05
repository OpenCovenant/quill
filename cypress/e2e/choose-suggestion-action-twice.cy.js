describe("Highlighting Markings Through Various Operations", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should behave as expected when performing different operations on the markings", () => {
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get(".typo").should("be.visible");

        cy.get(".typo").first().click();
        cy.get('[data-test="marking-card"]')
            .find('[data-test="blur-marking-button"]')
            .click();
        cy.get(".typo").first().click();
        cy.get("#editor > p > .typo").should("have.length", 3).should('be.visible');

        cy.get('[data-test="marking-card"]')
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get(".typo").first().click();
        cy.get("#editor > p > .typo").should("have.length", 2).should('be.visible');

        cy.get('[data-test="marking-card"]')
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get("#editor > p > .typo").should("have.length", 1).should('be.visible');

        cy.get('[data-test="marking-card"]')
            .find('[data-test="dismiss-marking-button"]')
            .click();
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="marking-card"]').should("not.exist");
    });
});
