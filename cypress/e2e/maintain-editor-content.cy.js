describe("Writen Text Should Stay On Editor When Navigating On Other Pages", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("it should contain text in editor when navigating on other pages", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="gear-button-testing"]').click();
        cy.url().should("include", "/settings");
        cy.get('[data-test="penda-home-button"]').click();
        cy.url().should("include", "");
        cy.get('[data-test="editor"]').contains("gabmim").should("exist");
        cy.get('[data-test="text-marking-span"')
            .contains("gabmim")
            .should("exist");
    });
});
