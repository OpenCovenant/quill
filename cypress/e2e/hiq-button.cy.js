describe("test for button hiq", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on hiq button and check if it deletes the text on editor", () => {
        cy.get("[data-test='editor'] > p > .typo").should("not.exist");
        cy.get("[data-test='editor']").type("gabmim ");
        cy.get("button.btn-outline-danger").contains("HIQ").click();
        cy.get("button.suggestion").should("not.exist");
    });

    it("will click on `HIQ` buttons and check if it deletes the markings in the editor", () => {
        const text = "gabmim gabmim ";
        cy.get("[data-test='editor'] > p > .typo").should("not.exist");
        cy.get("[data-test='editor']").type(text);
        cy.wait(2000)
        cy.get("button.btn-outline-danger").first().contains("HIQ").click();
        cy.wait(2000)
        cy.get("button.btn-outline-danger").first().contains("HIQ").click();
        // cy.get("button.btn-outline-danger").first().contains("HIQ").click();
        cy.get("button.suggestion").should("not.exist");
        // I guess because the whitespaces are transformed into NBSPs
        console.log(text.charCodeAt(6), text.replace(/ /g, '\u00a0').charCodeAt(6))
        cy.get("[data-test='editor']").should('contain.text', text.replace(/ /g, '\u00a0'));
    });
});
