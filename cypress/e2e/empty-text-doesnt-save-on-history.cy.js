describe("empty text should not be on the history tab", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will type empty text and new line and should not be saved on history tab", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type(" ");
        cy.wait(16000);
        cy.get('[data-test="written-texts-history-button"]').click();
        cy.get('[data-test="written-text"]').should("not.exist");
    });
});
