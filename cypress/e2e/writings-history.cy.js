describe("Writings History", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should not save empty text on the writings history", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type(" ");
        cy.wait(16000);
        cy.get('[data-test="writings-history-button"]').click();
        cy.get('[data-test="writing"]').should("not.exist");
    });

    it("should check the history section and the toggle button", () => {
        cy.get('[data-test="editor"]').type("saktë");
        cy.wait(16000);
        cy.get('[data-test="writings-history-button"]').click();
        cy.get('[data-test="writing"]').contains("saktë").should("exist");
        cy.get('[data-test="close-writings-history-modal-button"]').click();
        cy.get('[data-test="flex-switch-check-checked"]').click();
        cy.get('[data-test="writings-history-modal-body"]').should(
            "not.contain",
            "saktë"
        );
    });
});
