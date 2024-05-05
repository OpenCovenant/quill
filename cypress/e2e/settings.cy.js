describe("settings", () => {
    beforeEach(() => {
        cy.visit("/settings");
    });

    it("should persist the enabled/disabled status of marking types after reloading", () => {
        cy.get('[data-test="switch-check-testing"]').should("be.checked");
        cy.get('[data-test="switch-check-testing"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="switch-check-testing"]').should("not.be.checked");
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should("not.be.checked");
        cy.get('[data-test="switch-check-testing"]').click({
            multiple: true,
            force: true
        });
        cy.get('[data-test="switch-check-testing"]').should("be.checked");
        cy.reload();
        cy.get('[data-test="switch-check-testing"]').should("be.checked");
    });
});
