describe('test the home button on "PENDA"', () => {
    beforeEach(() => {
        cy.visit("/te-dhe-tek");
    });

    it("will click on penda which redirects to home", () => {
        cy.get('[data-test="penda-home-button"]').click();
        cy.url().should("include", "");
    });
});
