describe("test for history button", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will test the history section and togle the history button on/off", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("saktë");
        cy.wait(16000);
        cy.get('[data-test="written-texts-history-button"]').click();
        cy.get('[data-test="written-text"]').contains("saktë").should("exist");
        cy.get('[data-test="close-written-texts-modal-button"]').click();
        cy.get('[data-test="flex-switch-check-checked"]').click();
        cy.get('[data-test="written-texts-modal-body"]')
            .contains("p#writtenText")
            .should("not.exist");
    });
});
