describe("Typing in the editor removes the focused typo.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will test if the focused marking will be removed when we start typing on the editor ", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.get('[data-test="editor"]').type("asd ");
        cy.wait(4000);
        cy.get('#editor .typo:first-of-type').click();
        cy.wait(1500);
        cy.get('.text-marking.typo').should('contain', 'gabmim');
        cy.get('[.text-marking typo"]').contains("asd").should("not.exist");
        cy.get('[data-test="editor"]').type("Shkoi tek zyra.");
        cy.get('[.text-marking typo]').contains("gabmim").should("exist");
        cy.get('[.text-marking typo"]').contains("asd").should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
