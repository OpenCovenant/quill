describe("The selected marking is sticky.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will add multiple new lines and check if the selected marking is still on the screen", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("asd ");
        cy.get('#editor .typo:first-of-type').click();
        cy.get('#editor').type('{shift}{enter}');
        Cypress.Commands.add('typeWithShiftEnterMultipleTimes', (selector, count) => {
            if (count > 0) {
                cy.get(selector).type('{shift}{enter}');
                cy.typeWithShiftEnterMultipleTimes(selector, count - 1);
            }
        });

        // Usage: Run the command 20 times whith new lines
        cy.typeWithShiftEnterMultipleTimes('#editor', 20);
        cy.scrollTo('bottom');
        cy.get('div.grid1 span.text-marking.typo').filter(':visible').should('exist')
        cy.get('[data-test="editor"]').clear();
    });

});
