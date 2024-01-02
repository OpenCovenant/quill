describe("Settings Page Navigation Tests From Gear Icon", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should navigate to the /settings page when the gear icon is clicked", () => {
        cy.get('[data-test="gear-button-testing"]').click();
        cy.url().should("include", "/settings");
    });
});
