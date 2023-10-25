describe("", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("", () => {
        // Check initial state
        cy.get("#editor > p > .typo").should("not.exist");

        // Type some text
        cy.get('[data-test="editor"]').type("asd gabmim asd ");

        // Wait for the button to appear
        cy.get("#editor > p > .typo").should("be.visible");

        cy.get("#editor > p > .typo").first().click()

        cy.get(".card").find('[data-test="blur-marking-button"]').click();

        cy.get("#editor > p > .typo").first().click()

        cy.get(".card").find('[data-test="suggestion"]').first().click();

        cy.get("#editor > p > .typo").first().click()

        cy.get(".card").find('[data-test="suggestion"]').first().click();


        // Click the button for each card
        // cy.get(".sticky .card").each((card, index) => {
        //     cy.wrap(card).find('[data-test="dismiss-marking-button"]').click();
        //
        //     cy.wrap(card).should("not.exist");
        // });
    });
});
