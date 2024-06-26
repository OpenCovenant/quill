describe("dark mode", () => {
    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem("penda-dark-mode", "false");
            }
        });
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

    it("should correctly update the dark mode status in local storage", () => {
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "false"
            );
        });

        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').click({
            force: true
        });
        cy.reload();
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "true"
            );
        });

        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').click({
            force: true
        });
        cy.reload();
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "false"
            );
        });
    });
});
