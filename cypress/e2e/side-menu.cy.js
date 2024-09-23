describe("side menu", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should open and close the side menu as expected", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get(".offcanvas.offcanvas-start.show").should("be.visible");
        cy.get('[data-test="close-side-menu-button"]').click();
    });

    it("should navigate to the settings page when clicking on its corresponding list item on the side menu", () => {
        cy.get('[data-test="navbar-toggler-icon"]').click();
        cy.get('[data-test="settings-side-menu-item"]').click();
        cy.url().should("include", "/settings");
    });
});
