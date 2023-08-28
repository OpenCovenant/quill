describe("Selecting all text and then copying with ctrl + c should not mark the editor", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will select all text then copy and check if the editor is marked", () => {
        cy.get('[data-test="editor"]').type("test per shenjimet");
        cy.get('[data-test="editor"]').type("{selectall}");
        cy.get('[data-test="editor"]').trigger('keydown', { keyCode: 67, ctrlKey: true });
      //COPY DOESNT WORK
        /* cy.get('[data-test="editor"]')
            .focus() // Focus on the input field
            .trigger('keydown', { keyCode: 67, ctrlKey: true });*/
        cy.get("span.typo").contains("gabime shkrimi").should("exist");
        cy.get(".list-group-item b")
            .contains("shkrim pa gabime")
            .should("exist");
        cy.get(".list-group-item span")
            .contains(
                "shenjime për fjalë të shkruara gabim, gabime fonetikore, shenja pikësimi"
            )
            .should("exist");

        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
                expect(text).to.eq("test per shenjimet");
            });
        });
    });
});
