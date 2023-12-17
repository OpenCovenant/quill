xdescribe("quickly applying a suggestion and dismissing a marking", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will properly apply the respective suggestion and dismiss the respective marking", () => {
        cy.get('[data-test="editor"]').clear().type("lider gabmim");

        cy.get('.typo-marking-header').parent().parent().parent().find('[data-test="suggestion"]').first().click();
        cy.get('.loanword-marking-header').parent().parent().parent().find('[data-test="dismiss-marking-button"]').first().click();

        cy.get('.typo').should('not.exist')
        cy.get('.loanword').should('not.exist')
        cy.get('.template-marking-span').should('be.visible')
    });
});
