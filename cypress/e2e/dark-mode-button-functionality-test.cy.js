describe("Dark Mode Toggle and Reload Check", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should toggle the dark mode button, reload, and maintain the desired state", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should(
            "not.be.checked"
        );

        cy.get('[data-test="dark-mode-button-toggle-switch"]').click({
            force: true
        });
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should(
            "be.checked"
        );

        cy.reload();
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should(
            "be.checked"
        );

        cy.get('[data-test="dark-mode-button-toggle-switch"]').click({
            force: true
        });
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should(
            "not.be.checked"
        );

        cy.reload();
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should(
            "not.be.checked"
        );
    });
});
