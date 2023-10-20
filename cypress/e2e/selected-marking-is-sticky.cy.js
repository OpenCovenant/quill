describe("The selected marking is sticky.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will add multiple new lines and check if the selected marking is still on the screen", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim");
        for (let i = 0; i < 30; ++i) {
            cy.get("#editor").type("{enter}");
        }
        cy.scrollTo("top");
        cy.get('[data-test="text-marking-span"]').should("be.visible");
        cy.get("#editor > p > .typo").first().click();
        cy.get('[data-test="characters-words-markings"]').scrollIntoView();
        cy.get('[data-test="highlighted-text-marking"]').should("be.visible");
        cy.get('[data-test="text-marking-span"]').should(($span) => {
            // Check if the highlighted element is visible
            if ($span.length > 0) {
                expect($span).to.not.be.visible;
                expect($span).not.to.exist;
            }
        });
        cy.get('[data-test="editor"]').clear();
    });
});
