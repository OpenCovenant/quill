describe("Enable/disable dark mode button and reload to check if its working", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will enable the dark mode button reload and then disable it and reload and check whether it stays as desired", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should("not.be.checked");
        cy.get('[data-test="dark-mode-button-toggle-swotch"]').click({force: true});
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should("be.checked");
        cy.reload();
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should("be.checked");
        cy.get('[data-test="dark-mode-button-toggle-switch"]').click({force: true});
        cy.get('[data-test="dark-mode-button-toggle-switch"]').should("not.be.checked");
        cy.reload();
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[[data-test="dark-mode-button-toggle-switch"]').should("not.be.checked");
        cy.reload();
    });
});
