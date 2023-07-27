describe("Enabling/disabling a marking is persisted after reloading.", () => {
    beforeEach(() => {
        cy.visit("/settings");
    });

    it("will uncheck all the switch on the /settings page reload the page and check if they are still disabled ", () => {
        cy.get('[data-test="switch-check-testing"]').should('have.class', 'ng-untouched');
        cy.get('[data-test="switch-check-testing"]').click({ multiple: true, force:true });
        cy.get('[data-test="switch-check-testing"]').should('have.class', 'ng-touched');
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should('have.class', 'ng-untouched');
        cy.get('[data-test="switch-check-testing"]').click({ multiple: true, force:true });
        cy.get('[data-test="switch-check-testing"]').should('have.class', 'ng-touched');
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should('have.class', 'ng-untouched');

    });
});

