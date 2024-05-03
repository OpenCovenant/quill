describe("Home Button", () => {
    beforeEach(() => {
        cy.visit("/te-dhe-tek");
    });

    it("should click on the PENDA home button, redirecting to the home page", () => {
        cy.get('[data-test="home-button"]').click();
        cy.url().should("include", "");
    });
});
