describe("Empty Text History Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should not save empty text on the history tab", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type(" ");
        cy.wait(16000);
        cy.get('[data-test="written-texts-history-button"]').click();
        cy.get('[data-test="written-text"]').should("not.exist");
    });
});
