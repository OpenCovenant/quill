describe("test for dismiss-marking button", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on dismiss-marking button and check if it deletes the text on editor", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').click();
        cy.get('[data-test="suggestion"]').should("not.exist");
    });

    it("will click on dismiss-marking buttons and check if it deletes the markings in the editor", () => {
        const text = "gabmim gabmim";
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type(text);
        cy.get('[data-test="dismiss-marking-button"]').first().click();
        cy.get('[data-test="dismiss-marking-button"]').first().click();
        cy.get('[data-test="suggestion"]').should("not.exist");
        cy.get('[data-test="editor"]').should("have.text", text);
    });
});
