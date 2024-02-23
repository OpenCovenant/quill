describe("Remove Highlighted Marking by Deleting Selected Text", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should remove the highlighted marking when selecting all text and deleting it", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd gabmim asd ");
        cy.get(".typo").first().click();
        cy.get('[data-test="editor"]').type("{selectall}");
        cy.get('[data-test="editor"]').type("{del}");
        cy.get('[data-test="highlighted-marking"]').should("not.exist");
        cy.get('[data-test="editor"]').clear();
    });
});
