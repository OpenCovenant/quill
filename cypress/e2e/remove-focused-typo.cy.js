describe("Typing in the editor removes the focused typo.", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("will test if the focused marking will be removed when we start typing on the editor ", () => {
        cy.get("#editor > p > .typo").should("not.exist");
        cy.get('[data-test="editor"]').type("gabmim asd ");
        cy.get("#editor > p > .typo").first().click();
        cy.get('[data-test="highlighted-text-marking"]').should(
            "have.text",
            "gabmim"
        );
        cy.get('[data-test="highlighted-text-marking"]')
            .contains("asd")
            .should("not.exist");
        cy.get('[data-test="editor"]').type("{end}");
        cy.get('[data-test="editor"]').type("pra ");
        cy.get('[data-test="text-marking-span"]')
            .contains("gabmim")
            .should("exist");
        cy.get('[data-test="text-marking-span"]')
            .contains("asd")
            .should("exist");
        cy.get('[data-test="editor"]').clear();
    });
});
