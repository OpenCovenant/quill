describe("Writings History", () => {
    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem("penda-can-store-writings", "true");
            }
        });
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
        cy.get('[data-test="writing"]').contains("saktë").should("be.visible");
        cy.get('[data-test="close-writings-history-modal-button"]').click();
        cy.get('[data-test="writings-input"]').click();
        cy.get('[data-test="writings-history-modal-body"]').should(
            "not.contain",
            "saktë"
        );
    });
});
