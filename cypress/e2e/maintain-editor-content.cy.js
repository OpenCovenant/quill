describe("Written Text Should Stay On Editor When Navigating On Other Pages", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should contain text in editor when navigating to other pages", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="settings-gear-button"]').click();
        cy.url().should("include", "/settings");
        cy.get('[data-test="home-button"]').click();
        cy.url().should("include", "");
        cy.get('[data-test="editor"]').contains("gabmim").should("be.visible");
        cy.get('[data-test="marking-span"').contains("gabmim").should("be.visible");
    });
});
