describe("Selecting all text should not mark the editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will select all text and check if the editor is marked", () => {
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').click();
        cy.get('[data-test="suggestion"]').should("not.exist");
        cy.get('[data-test="editor"]').type("{selectall}");
        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("exist");
    });
});
