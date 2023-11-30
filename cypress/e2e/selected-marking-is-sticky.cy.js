describe("The selected marking is sticky.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will add multiple new lines and check if the selected marking is still on the screen", () => {
        cy.get(".typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim");

        for (let i = 0; i < 30; ++i) {
            cy.get("#editor").type("{enter}");
        }

        cy.get(".typo").first().click();
        cy.scrollTo("bottom");
        cy.get('[data-test="highlighted-text-marking"]').should("be.visible");
        cy.get('[data-test="editor"]').clear();
    });
});
