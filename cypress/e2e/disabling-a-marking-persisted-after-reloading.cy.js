describe("Enabling/disabling a marking is persisted after reloading.", () => {
    beforeEach(() => {
        cy.visit("/settings");
    });

    it("will uncheck all the switch on the /settings page reload the page and check if they are still disabled ", () => {
        cy.get('[data-test="switch-check-testing"]').should('be.checked');
        cy.get('[data-test="switch-check-testing"]').click({ multiple: true, force:true });
        cy.get('[data-test="switch-check-testing"]').should('not.be.checked');
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should('not.be.checked');
        cy.get('[data-test="switch-check-testing"]').click({ multiple: true, force:true });
        cy.get('[data-test="switch-check-testing"]').should('be.checked');
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should('be.checked');

    });
});

