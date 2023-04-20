describe("its going to test if the place holder is there after clicking on dokument", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/");
    });

    it("will click on dokument and on shkruaj again and check for the placeholder if its still there", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd ");
        cy.get('button[id="uploadDocumentToggleButton"]').click();
        cy.get('button[id="writeTextToggleButton"]').click();
        cy.get('div>#editor-placeholder').should("not.exist");
        cy.get('[data-test="editor"]').clear();
        });
    });

