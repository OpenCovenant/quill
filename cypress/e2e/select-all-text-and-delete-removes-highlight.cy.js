describe("Removing the highlighted marking by selecting all the text and deleting it, actually removes the highlighted marking.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will select all text and delete and check if the highlighted marking is removed", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get('#editor > p > .typo').first().click();
        cy.get('[data-test="editor"]').type('{selectall}');
        cy.get('[data-test="editor"]').type('{del}');
        cy.get('[data-test="text-marking-typo-test"]').contains("asd").should("not.exist");
        cy.get('[data-test="text-marking-typo-test"]').contains("gabmim").should("not.exist");
        cy.get('[data-test="text-marking-typo-test"]').contains("asd").should("not.exist");
        cy.get('[data-test="editor"]').clear();
    });
});
