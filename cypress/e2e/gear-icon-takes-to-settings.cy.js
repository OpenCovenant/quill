describe("Clicking on the gear icon takes you to /settings page", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on gear icon and check if it goes to /settings", () => {
        cy.get('[data-test="gear-button-testing"]').click();
        cy.url().should("include", "/settings");
    });
});
