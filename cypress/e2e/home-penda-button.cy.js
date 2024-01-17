describe("Home Button Test", () => {
    beforeEach(() => {
        cy.visit("/te-dhe-tek");
    });

    it("should click on the PENDA home button, redirecting to the home page", () => {
        cy.get('[data-test="penda-home-button"]').click();
        cy.url().should("include", "");
    });
});
