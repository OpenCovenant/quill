describe("Settings page should open from offcanvas page", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on the \"cilesimet\" located on offcanvas and check if it loaded the /settings page ", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="cilesimet-button"]').click();
        cy.url().should("include", "/settings");
    });
});
