describe("Writings History", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should test the history section and toggle the history button on/off", () => {
        cy.get('[data-test="editor"]').type("saktë");
        cy.wait(16000);
        cy.get('[data-test="writings-history-button"]').click();
        cy.get('[data-test="writing"]').contains("saktë").should("exist");
        cy.get('[data-test="close-writings-history-modal-button"]').click();
        cy.get('[data-test="flex-switch-check-checked"]').click();
        cy.get('[data-test="writings-history-modal-body"]').should("not.contain", 'saktë');
    });
});
