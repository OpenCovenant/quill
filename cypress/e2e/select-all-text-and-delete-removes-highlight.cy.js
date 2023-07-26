describe("Removing the highlighted marking by selecting all the text and deleting it, actually removes the highlighted marking.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will select all text and delete and check if the highlighted marking is removed", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd ");
        cy.get('[data-test="editor"]').type(" gabmim ");
        cy.get('[data-test="editor"]').type(" asd ");
        cy.get('#editor .typo:first-of-type').click();
        cy.get('[data-test="editor"]').type('{selectall}');
        cy.get('[data-test="editor"]').type('{del}');
        cy.get('[data-test="text-marking-typo-test"]').contains("asd").should("not.exist");
        cy.get('[data-test="text-marking-typo-test"]').contains("gabmim").should("not.exist");
        cy.get('[data-test="text-marking-typo-test"]').contains("asd").should("not.exist");
        cy.get('[data-test="editor"]').clear();
    });
});
