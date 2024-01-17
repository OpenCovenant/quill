describe("Dark Mode Local Storage Check", () => {
    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem('penda-dark-mode', 'false');
            },
        });
    });

    it("should correctly update the dark mode status in local storage", () => {

        cy.window().then((win) => {
            const localStorageValue = win.localStorage.getItem('penda-dark-mode');

            expect(localStorageValue).to.equal('false');
        });

        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').click({
            force: true
        });
        cy.reload();
        cy.window().then((win) => {
            const localStorageValue = win.localStorage.getItem('penda-dark-mode');

            expect(localStorageValue).to.equal('true');
        });

        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="dark-mode-button-toggle-switch"]').click({
            force: true
        });
        cy.reload();
        cy.window().then((win) => {
            const localStorageValue = win.localStorage.getItem('penda-dark-mode');

            expect(localStorageValue).to.equal('false');
        });
    });
});
