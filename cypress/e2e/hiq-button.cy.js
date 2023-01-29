describe("test for button hiq", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on hiq button and check if it deletes the text on editor", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type("gabmim ");
        cy.get("button.btn-outline-danger").contains("HIQ").click();
        cy.get("button.suggestion").should("not.exist");
    });

    it("will click on `HIQ` buttons and check if it deletes the markings in the editor", () => {
        const text = "gabmim gabmim "
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get("#editor").type(text);
        cy.get("button.btn-outline-danger").first().contains("HIQ").click();
        cy.get("button.btn-outline-danger").first().contains("HIQ").click();
        cy.get("button.suggestion").should("not.exist");
        // cy.get("#editor").should('contain.text', text)
    });
});
