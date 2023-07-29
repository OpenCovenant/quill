describe("Settings page should open from navigation page", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on the \"cilesimet\" located on offcanvas and check if it loaded the /settings page ", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="marking-information-icon"]').click();
        cy.url().should("include", "/te-dhe-tek");
    });
});
