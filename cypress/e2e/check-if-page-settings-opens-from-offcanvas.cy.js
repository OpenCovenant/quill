describe("Settings Page Opening from Offcanvas", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it('should navigate to the "/settings" page when clicking on the "cilesimet" in the offcanvas menu', () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="settings-button"]').click();
        cy.url().should("include", "/settings");
    });
});
