describe("editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should not mark the editor when selecting all text", () => {
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="dismiss-marking-button"]').click();
        cy.get('[data-test="suggestion"]').should("not.exist");

        cy.get('[data-test="editor"]').type("{selectall}");
        // waiting to see if any marking will be made
        cy.wait(2000);

        cy.get(".typo-marking-header").should("be.visible");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("be.visible");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("be.visible");
    });
});
