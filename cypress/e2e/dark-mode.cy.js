describe("dark mode", () => {
    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem("penda-dark-mode-system", "false");
                win.localStorage.setItem("penda-dark-mode", "false");
            }
        });
    });

    it("should toggle the dark mode button, reload, and maintain the desired state", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "false"
            );
        });

        cy.get('[data-test="dark-mode-button"]').click();
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "true"
            );
        });

        cy.reload();
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "true"
            );
        });

        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="light-mode-button"]').click();
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "false"
            );
        });

        cy.reload();
        cy.window().then((win) => {
            expect(win.localStorage.getItem("penda-dark-mode")).to.equal(
                "false"
            );
        });
    });
});
