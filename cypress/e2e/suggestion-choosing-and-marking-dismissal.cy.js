describe("Quick Suggestion and Marking Dismissal Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should properly apply a suggestion and dismiss a marking", () => {
        cy.get('[data-test="editor"]').clear().type("lider gabmim");

        cy.get(".typo-marking-header")
            .parent()
            .parent()
            .parent()
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get(".loanword-marking-header")
            .parent()
            .parent()
            .parent()
            .find('[data-test="dismiss-marking-button"]')
            .first()
            .click();

        cy.get(".typo").should("not.exist");
        cy.get(".loanword").should("not.exist");
        cy.get(".template-marking-span").should("be.visible");
    });

    it("should properly choose suggestions and dismiss markings", () => {
        cy.get('[data-test="editor"]')
            .clear()
            .type("gabmi lider e eshte e gabmim e saktë eshte pra eshte");

        cy.get(".typo-marking-header")
            .parent()
            .parent()
            .parent()
            .eq(0)
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get(".loanword-marking-header")
            .parent()
            .parent()
            .parent()
            .find('[data-test="dismiss-marking-button"]')
            .first()
            .click();
        cy.get(".typo-marking-header")
            .parent()
            .parent()
            .parent()
            .eq(1)
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get(".typo-marking-header")
            .parent()
            .parent()
            .parent()
            .eq(2)
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get(".typo-marking-header")
            .parent()
            .parent()
            .parent()
            .eq(3)
            .find('[data-test="suggestion"]')
            .first()
            .click();
        cy.get(".typo-marking-header")
            .parent()
            .parent()
            .parent()
            .eq(4)
            .find('[data-test="suggestion"]')
            .first()
            .click();

        cy.get(".typo").should("not.exist");
        cy.get(".loanword").should("not.exist");
        cy.get(".template-marking-span").should("be.visible");
    });
});
