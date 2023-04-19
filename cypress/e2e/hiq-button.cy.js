describe("test for button hiq", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on hiq button and check if it deletes the text on editor", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').contains("HIQ").click();
        cy.get("button.suggestion").should("not.exist");
    });

    it("will click on `HIQ` buttons and check if it deletes the markings in the editor", () => {
        const text = "gabmim gabmim";
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type(text);
        cy.get('[data-test="dismiss-marking-button"]')
            .first()
            .contains("HIQ")
            .click();
        cy.get('[data-test="dismiss-marking-button"]')
            .first()
            .contains("HIQ")
            .click();
        cy.get("button.suggestion").should("not.exist");
        cy.get('[data-test="editor"]').should("have.text", text);
    });
});
