describe("Marking Information Page Navigation Tests", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should navigate to the detailed information page when the information button of a marking is clicked", () => {
        cy.get('[data-test="editor"]').type("Shkoi tek zyra.");
        cy.get('[data-test="marking-information-icon"]').click();
        cy.url().should("include", "/te-dhe-tek");
    });
});
