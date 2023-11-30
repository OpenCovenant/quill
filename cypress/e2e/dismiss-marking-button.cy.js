describe("test for dismiss-marking button", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on dismiss-marking button and check if it deletes the text on editor", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').click();
        cy.get('[data-test="suggestion"]').should("not.exist");
    });

     it("will click on dismiss-marking buttons and check if it deletes the markings in the editor", () => {
        const text = "gabmim gabmim";
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type(text);

        // Click on each dismiss-marking button
        cy.get(".sticky .card").each((card) => {
            cy.wrap(card).find('[data-test="dismiss-marking-button"]').click();

            cy.wrap(card).should("not.exist");
        });

        // Ensure that there are no remaining suggestions
        cy.get('[data-test="suggestion"]').should("not.exist");
        // Ensure that the editor content matches the original text
        cy.get('[data-test="editor"]').should("have.text", text);
    });
});
