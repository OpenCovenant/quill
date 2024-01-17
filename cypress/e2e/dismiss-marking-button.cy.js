describe("Dismiss Marking Button Test", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should delete the text in the editor when dismiss-marking button is clicked", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').click();
        cy.get('[data-test="suggestion"]').should("not.exist");
    });

     it("should delete the markings in the editor when dismiss-marking buttons are clicked", () => {
        const text = "gabmim gabmim";
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type(text);

        // Click on each dismiss-marking button
        cy.get('[data-test="marking-card"]').each((card) => {
            cy.wrap(card).find('[data-test="dismiss-marking-button"]').click();

            cy.wrap(card).should("not.exist");
        });

        // Ensure that there are no remaining suggestions
        cy.get('[data-test="suggestion"]').should("not.exist");
        // Ensure that the editor content matches the original text
        cy.get('[data-test="editor"]').should("have.text", text);
    });
});
