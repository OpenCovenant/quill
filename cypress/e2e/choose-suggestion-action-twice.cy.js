describe("the highlight of markings intertwined with some other marking operations", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will behave as expected as we perform different operations on the markings", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get("#editor > p > .typo").should("be.visible");

        cy.get("#editor > p > .typo").first().click()
        cy.get('[data-test="marking-card"]').find('[data-test="blur-marking-button"]').click();
        cy.get("#editor > p > .typo").first().click()

        cy.get('[data-test="marking-card"]').find('[data-test="suggestion"]').first().click();
        cy.get("#editor > p > .typo").first().click()
        cy.get('[data-test="marking-card"]').find('[data-test="suggestion"]').first().click();
        cy.get('[data-test="marking-card"]').find('[data-test="dismiss-marking-button"]').click();
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="marking-card"]').should("not.exist");
    });
});
