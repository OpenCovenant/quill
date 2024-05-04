describe("navigation bar", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should navigate to the home page when clicking on the home button", () => {
        cy.visit("/te-dhe-tek");
        cy.get('[data-test="home-button"]').click();
        cy.url().should("include", "");
    });

    it("should navigate to the settings page when clicking on the the gear icon", () => {
        cy.get('[data-test="gear-button-testing"]').click();
        cy.url().should("include", "/settings");
    });
});
