describe("Typing in the editor removes the focused typo.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will test if the focused marking will be removed when we start typing on the editor ", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="editor"]').type("asd ");
        cy.get('#editor .typo:first-of-type').click();
        cy.get('[data-test="text-marking-typo-test-marked"]').should('contain', 'gabmim');
        cy.get('[data-test="text-marking-typo-test-marked"]').contains("asd").should("not.exist");
        cy.get('[data-test="editor"]').type('{end}');
        cy.get('[data-test="editor"]').type("Shkoi tek zyra.");
        cy.get('[data-test="text-marking-typo-test"]').contains("gabmim").should("exist");
        cy.get('[data-test="text-marking-typo-test"]').contains("asd").should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
