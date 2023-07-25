describe("Enabling/disabling a marking is persisted after reloading.", () => {
    beforeEach(() => {
        cy.visit("/settings");
    });

    it("will uncheck all the switch on the /settings page reload the page and check if they are still disabled ", () => {
        // Verify the button has the class 'ng-touched' indicating it's enabled
        cy.get('[data-test="switch-check-testing"]').should('have.class', 'ng-touched');
        cy.get('[data-test="switch-check-testing"]').click();
        // Verify the button has the class 'ng-untouched' indicating it's disabled
        cy.get('[data-test="switch-check-testing"]').should('have.class', 'ng-untouched');
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should('not.be.checked');
        cy.get('[data-test="switch-check-testing"]').click({ multiple: true });
        cy.get('[data-test="switch-check-testing"]').should('be.checked');
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should('be.checked');

    });
});
