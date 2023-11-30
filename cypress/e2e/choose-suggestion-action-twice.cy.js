describe("the highlight of markings intertwined with some other marking operations", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will behave as expected as we perform different operations on the markings", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get(".typo").should("be.visible");

        cy.get(".typo").first().click()
        cy.get('[data-test="marking-card"]').find('[data-test="blur-marking-button"]').click();
        cy.get(".typo").first().click()

        cy.get('[data-test="marking-card"]').find('[data-test="suggestion"]').first().click();
        cy.get(".typo").first().click()
        cy.get('[data-test="marking-card"]').find('[data-test="suggestion"]').first().click();
        cy.get('[data-test="marking-card"]').find('[data-test="dismiss-marking-button"]').click();
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="marking-card"]').should("not.exist");
    });
});
