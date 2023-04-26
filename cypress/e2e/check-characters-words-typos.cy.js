describe("its going to test if the characters change, words, typos change as we write", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will click on dokument and on shkruaj again", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim ");
        cy.wait(2000);
        cy.get('#characterCountSpan').contains("7 karaktere, 1 fjalë, 1 shenjim").should("exist");
        cy.get('[data-test="editor"]').type(" gabim");
        cy.get('#characterCountSpan').contains("13 karaktere, 2 fjalë, 1 shenjim").should("exist");
        cy.get('[data-test="editor"]').clear();
        cy.get('#characterCountSpan').contains("0 karaktere, 0 fjalë, 0 shenjime").should("exist");
        cy.get('[data-test="editor"]').type('{shift}');
        cy.get('#characterCountSpan').contains("0 karaktere, 0 fjalë, 0 shenjime").should("exist");
    });
});
