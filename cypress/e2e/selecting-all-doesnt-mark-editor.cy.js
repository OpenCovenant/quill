describe("Selecting all text should not mark the editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will select all text and check if the editor is marked", () => {
        cy.get('[data-test="editor"]').type("test per shenjimet");
        cy.get('[data-test="editor"]').type("{selectall}");
        cy.get("span.typo").contains("gabime shkrimi").should("exist");
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
